import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Rectangle from '../components/Rectangle'
import RectangleStatistics from '../components/RectangleStatistics'
import { ethers } from 'ethers'
import { config, supportedChains } from '../config.js';
import { useEthers, Goerli, DEFAULT_SUPPORTED_CHAINS } from '@usedapp/core'
import { useEffect, useState } from 'react'
import { RECTANGLE_GOVERNER_ADDRESS_GOERLI } from '../contracts';
import RectangleGovernerABI from '../artifacts/contracts/Governance/Governer.sol/RectangleGoverner.json';
import Proposals from '../components/Proposals'
import CreateProposal from '../components/CreateProposal'
import BigNumber from "bignumber.js";
import { useRouter } from 'next/router'

const STATUS_MSG = [
    "Pending",
    "Active",
    "Canceled",
    "Defeated",
    "Succeeded",
    "Queued",
    "Expired",
    "Executed"
  ]
    
export default function Propose(props) {
  const { chainId } = useEthers()
  const {data} = props;
  const [isRefreshingData, setIsRefreshingData] = useState(false);
  const router = useRouter();

  const refreshProposals = () => {
    router.replace(router.asPath);
    setIsRefreshingData(true);
  }

  useEffect(()=>{
    setIsRefreshingData(false);
  },[props]);


  return (
        <div className='overflow-y-hidden'>
          <Head>
            <title>Rectangle Propose</title>
          </Head>

          {
          !(chainId == `${Goerli.chainId}`)
          ?
            <main className='relative top-16 h-screen w-screen'>
                <div className='absolute top-1/2 w-full text-center'>
                    <p>The current network is not supported. Please switch metamask to Goerli network!</p>
                </div>
            </main>
          :
            <main className='flex flex-row relative top-16 h-screen overflow-y-hidden'>
                <div className="basis-2/3 overflow-y-auto scrollbar-hide">
                  {isRefreshingData ? 
                    <progress className="progress progress-primary	w-60 left-1/3 top-1/2"></progress>
                    :
                    <Proposals data={data} refreshProposals={refreshProposals}/>
                  }
                </div>
                <div className="basis-1/3 overflow-hidden">
                  <CreateProposal refreshProposals={refreshProposals}/>
                </div>
            </main>
          }
        </div>
      )
}


export async function getServerSideProps() {
    let provider;
    if (process.env.ENVIRONMENT === 'local') {
      provider = new ethers.providers.JsonRpcProvider()
    } else if (process.env.ENVIRONMENT === 'testnet') {
      provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_GOERLI_URL)
    }
    const proposals = [];
    const rectangleGoverner = new ethers.Contract(RECTANGLE_GOVERNER_ADDRESS_GOERLI, RectangleGovernerABI.abi, provider)
    const proposalCreatedFilter = rectangleGoverner.filters.ProposalCreated();
    const proposalEvents = await rectangleGoverner.queryFilter(proposalCreatedFilter);
    for(let i = 0; i < proposalEvents.length; i++) {
        const proposal = proposalEvents[i];
        const [proposalId, proposer, targets, values, signatures, calldatas, startBlock, endBlock, description] = proposal.args;
        const status = await rectangleGoverner.state(proposalId);
        const quorum = await rectangleGoverner.quorum(startBlock.sub(1));  
        const quorumFormatted = new BigNumber(ethers.utils.formatEther(quorum)).integerValue();
        proposals.unshift({
            proposalId: proposalId.toHexString(),
            proposer: proposer,
            description: description,
            target: targets,
            values: values,
            startBlock: startBlock.toString(),
            endBlock: endBlock.toString(),
            calldatas: calldatas,
            status: STATUS_MSG[status],
            quorum: quorumFormatted,
            votes: {
                for: "",
                against: ""
            }
        })
    }
  
    const voteCastFilter = rectangleGoverner.filters.VoteCast();
    const voteCastEvents = await rectangleGoverner.queryFilter(voteCastFilter);
    const votes = [];
    for(let i = 0; i < voteCastEvents.length; i++) {
        const vote = voteCastEvents[i];
        const [voter, proposalId, support, weight, reason] = vote.args;
        votes.push({
            proposalId: proposalId.toHexString(),
            voter,
            support,
            weight
        })
    }
    
    /**
     * Bad approach because runtime can be slow due to so much processing on the server. 
     * O(n^2)
     * 
     * We can improve the runtime by loading each proposal on its own page and pull votes on that page
     * This would improve the runtime because we would have to query votes for only that proposal
     * 
     * For now, we are moving forward with the following approach 
     */

    proposals.forEach((proposal)=>{
      const {proposalId} = proposal

      const votesForProposalId = votes.filter((vote)=>{
        return vote.proposalId === proposalId
      })

      console.log("voting on proposal ID :", proposalId);
      console.log("votes for proposal ID", votesForProposalId);

      const forVotes = votesForProposalId.filter((vote)=>{
        return vote.support == 1
      }).reduce(function (sum, vote) {
        debugger;
        sum = ethers.BigNumber.from(sum)
        let num = sum.add(vote.weight);
        return num
      }, 0);

      const ForBN = new BigNumber(ethers.utils.formatEther(forVotes));
      proposal.votes.for = ForBN.integerValue()

      const againstVotes = votesForProposalId.filter((vote)=>{
        return vote.support == 0
      }).reduce(function (sum, vote) {
        sum = ethers.BigNumber.from(sum)
        return sum.add(vote.weight);
      }, 0);

      const AgainstBN = new BigNumber(ethers.utils.formatEther(againstVotes));
      proposal.votes.against = AgainstBN.integerValue()
    })

    return {
      props: {
        data: JSON.parse(JSON.stringify(proposals))
      }
    }
  }