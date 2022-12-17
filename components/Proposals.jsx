import { useEffect, useRef, useState } from 'react'
import { ethers } from 'ethers'
import { useEthers, useContractFunction, useBlockNumber} from '@usedapp/core'
import toast, { Toaster } from "react-hot-toast";
import RectangleGovernerABI from '../artifacts/contracts/Governance/Governer.sol/RectangleGoverner.json';
import RectangleABI from '../artifacts/contracts/Rectangle.sol/Rectangle.json';
import { RECTANGLE_ADDRESS_GOERLI, RECTANGLE_GOVERNER_ADDRESS_GOERLI } from '../contracts';
import notify from "./notify.jsx";
import { useRouter } from 'next/router'
import Vote from './Vote';
import Queue from './Queue';
import Execute from './Execute';
import Executed from './Executed';

export default function Proposals(props) {
  const {data, refreshProposals} = props;
  const { chainId, account } = useEthers();
 
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
                      {
                        proposal.status != "Succeeded" && proposal.status != "Queued" && proposal.status != "Executed" && proposal.status != "Defeated" &&
                        <Vote proposal={proposal} key={index} index={index} refreshProposals={refreshProposals} />
                      }
                      {
                        proposal.status == "Succeeded" &&
                        <Queue proposal={proposal} key={index} index={index} refreshProposals={refreshProposals} />
                      }
                      {
                        proposal.status == "Queued" &&
                        <Execute proposal={proposal} key={index} index={index} refreshProposals={refreshProposals} />
                      }
                      {
                        proposal.status == "Executed" &&
                        <Executed proposal={proposal} key={index} index={index} refreshProposals={refreshProposals} />
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

