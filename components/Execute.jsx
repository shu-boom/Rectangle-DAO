import { useEffect, useRef, useState } from 'react'
import { ethers } from 'ethers'
import { useEthers, useContractFunction, useBlockNumber } from '@usedapp/core'
import toast, { Toaster } from "react-hot-toast";
import RectangleGovernerABI from '../artifacts/contracts/Governance/Governer.sol/RectangleGoverner.json';
import RectangleABI from '../artifacts/contracts/Rectangle.sol/Rectangle.json';
import { RECTANGLE_ADDRESS_GOERLI, RECTANGLE_GOVERNER_ADDRESS_GOERLI } from '../contracts';
import notify from "./notify.jsx";
import { useRouter } from 'next/router'

export default function Execute(props) {
    const { proposal, index, refreshProposals } = props;
    const { chainId, account } = useEthers();
    const rectangleGoverner = new ethers.Contract(RECTANGLE_GOVERNER_ADDRESS_GOERLI, RectangleGovernerABI.abi, ethers.getDefaultProvider(chainId));
    const { state, send } = useContractFunction(rectangleGoverner, 'execute', { transactionName: 'VoteCast' });
    const router = useRouter();
    const [showLoadingButton, setShowLoadingButton] = useState(false); //same as creating your state variable where "Next" is the default value for buttonText and setButtonText is the setter function for your state variable instead of setState
    const [currentlyExecutingProposalId, setCurrentlyExecutingProposalId] = useState(undefined); //same as creating your state variable where "Next" is the default value for buttonText and setButtonText is the setter function for your state variable instead of setState

    useEffect(() => {
        if (state.status == 'Success') {
            notify("Thanks For Executing!", `Queued ${currentlyExecutingProposalId}`);
            setTimeout(() => {
                setShowLoadingButton(false);
                setCurrentlyExecutingProposalId(undefined)
                refreshProposals(true);
            }, 1200);
        }

        if (state.status == 'Fail' || state.status == 'Exception') {
            notify("Error!", state.errorMessage)
            setTimeout(() => {
                setCurrentlyExecutingProposalId(undefined)
                setShowLoadingButton(false);
            }, 1200);
        }

        if (state.status != 'None') {
            setShowLoadingButton(true)
        }

    }, [state])


    const execute = () => async (event) => {
        if(account == null){
            notify("ERROR", "Please connect to metamask wallet");
            return;
        }
        const {status, proposalId} = proposal;
        let targets;
        let values;
        let calldatas;
        let descriptionHash;

        targets = proposal.target;
        values = proposal.values;
        calldatas = proposal.calldatas;
        descriptionHash = ethers.utils.id(proposal.description);

        send(targets, values, calldatas, descriptionHash)
        setCurrentlyExecutingProposalId(proposalId)
    }

    return (
        <>
            {
                showLoadingButton ?
                    <button disabled className="btn btn-primary loading">{state.status}</button>
                    :
                    <>
                        <button className="btn no-animation btn-primary bg-info border-info hover:bg-info mr-2">For {proposal.votes.for + "/" + proposal.quorum}</button>
                        <button onClick={execute()} className="btn btn-primary bg-success border-success hover:bg-success mr-2">Execute</button>
                    </>
            }

        </>
    )
}

