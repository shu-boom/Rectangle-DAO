import { useEffect, useRef, useState } from 'react'
import { ethers } from 'ethers'
import { useEthers, useContractFunction, useBlockNumber } from '@usedapp/core'
import toast, { Toaster } from "react-hot-toast";
import RectangleGovernerABI from '../artifacts/contracts/Governance/Governer.sol/RectangleGoverner.json';
import RectangleABI from '../artifacts/contracts/Rectangle.sol/Rectangle.json';
import { RECTANGLE_ADDRESS_GOERLI, RECTANGLE_GOVERNER_ADDRESS_GOERLI } from '../contracts';
import notify from "./notify.jsx";
import { useRouter } from 'next/router'

export default function Executed(props) {
    const { proposal } = props;

    return (
        <>
            <button className="btn no-animation btn-primary bg-info border-info hover:bg-info mr-2">For {proposal.votes.for + "/" + proposal.quorum}</button>
        </>
    )
}

