import { useEffect, useRef, useState } from 'react'
import { ethers } from 'ethers'
import { useEthers, useContractFunction, useBlockNumber} from '@usedapp/core'
import toast, { Toaster } from "react-hot-toast";
import RectangleGovernerABI from '../artifacts/contracts/Governance/Governer.sol/RectangleGoverner.json';
import RectangleABI from '../artifacts/contracts/Rectangle.sol/Rectangle.json';
import { RECTANGLE_ADDRESS_GOERLI, RECTANGLE_GOVERNER_ADDRESS_GOERLI } from '../contracts';
import notify from "./notify.jsx";
import { useRouter } from 'next/router'

export default function Proposals(props) {
  const {data, refreshProposals} = props;
  const { chainId, account } = useEthers();
  const rectangleGoverner = new ethers.Contract(RECTANGLE_GOVERNER_ADDRESS_GOERLI, RectangleGovernerABI.abi, ethers.getDefaultProvider(chainId));
  const { state, send } = useContractFunction(rectangleGoverner, 'castVote', { transactionName: 'VoteCast' });
  const router = useRouter();
  const [showLoadingButton, setShowLoadingButton] = useState(false); //same as creating your state variable where "Next" is the default value for buttonText and setButtonText is the setter function for your state variable instead of setState
  const [currentlyVotingOnProposalId, setCurrentlyVotingOnProposalId] = useState(undefined); //same as creating your state variable where "Next" is the default value for buttonText and setButtonText is the setter function for your state variable instead of setState

  useEffect(()=>{
    if(state.status == 'Success'){
      notify("Thanks For Voting!", `Voted on ${currentlyVotingOnProposalId}`);
      setTimeout(()=>{
        setShowLoadingButton(false);
        setCurrentlyVotingOnProposalId(undefined)
        refreshProposals(true);
      }, 1000);  
    }

    if(state.status == 'Fail' || state.status == 'Exception' ) {
      setCurrentlyVotingOnProposalId(undefined)
      setShowLoadingButton(false);
      notify("Error!", state.errorMessage)
    }

    if(state.status != 'None'){
      setShowLoadingButton(true)
    }

  }, [state])

  const voteFor = (index) => async (event) => {
    const proposal = data[index];
    const {status, proposalId} = proposal;
    if(status == 'Active'){
      send(proposalId, 1);
      setCurrentlyVotingOnProposalId(proposalId)
    }else{
      notify("Thanks for interest!", `Proposal is not active :(`);
    }
  }


  const voteAgainst = (index) => async (event) => {
    const proposal = data[index];
    const {status, proposalId} = proposal;
    if(status == 'Active'){
      send(proposalId, 0);
      setCurrentlyVotingOnProposalId(proposalId)
    }else{
      notify("Thanks for interest!", `Proposal is not active :(`);
    }
  }


  return (
    <div className="w-full my-8 mr-8">
        <Toaster />
        <h1 className='text-3xl mx-10'>Proposals</h1>
        {
          data.map((proposal, index)=>{
            return (
              <div key={index} className="card m-4 mx-6 p-4 bg-base-100 shadow-xl">
                <div className="absolute right-4">
                  <div className="badge badge-primary p-4">{proposal.status}</div>
                </div>
                <div className="card-body">
                  <h2 className="card-title break-all">{proposal.proposalId}</h2>
                  <p className="break-all">proposed by {proposal.proposer}</p>
                  <p className='break-all'>{proposal.description}</p>
                  <div className="card-actions flex justify-end items-center">
                      {showLoadingButton && currentlyVotingOnProposalId == proposal.proposalId?
                          <button disabled className="btn btn-primary loading">{state.status}</button> :
                          <>
                          <button onClick={voteFor(index)} className="btn btn-primary bg-success border-success hover:bg-success mr-2">For {proposal.votes.for + "/" + proposal.quorum}</button>
                          <button onClick={voteAgainst(index)} className="btn btn-primary bg-error border-error hover:bg-error mr-2">Against {proposal.votes.against + "/" + proposal.quorum}</button>
                          </>
                      }
                  </div>
                </div>
              </div>
            )
          })
        }
    </div>
  )
}

