import { useEffect, useRef, useState } from 'react'
import { ethers } from 'ethers'
import { useEthers, Goerli, useContractFunction } from '@usedapp/core'
import { Contract } from '@ethersproject/contracts'
import RectangleGovernerABI from '../artifacts/contracts/Governance/Governer.sol/RectangleGoverner.json';
import RectangleABI from '../artifacts/contracts/Rectangle.sol/Rectangle.json';
import { RECTANGLE_ADDRESS_GOERLI, RECTANGLE_GOVERNER_ADDRESS_GOERLI } from '../contracts';
import notify from "./notify.jsx";
import { useRouter } from 'next/router'

export default function CreateProposal(props) {
  const { refreshProposals } = props;
  const [dimension, setDimension] = useState("");
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [showLoadingButton, setShowLoadingButton] = useState(false); //same as creating your state variable where "Next" is the default value for buttonText and setButtonText is the setter function for your state variable instead of setState
  const { chainId, account } = useEthers();
  const rectangleGoverner = new ethers.Contract(RECTANGLE_GOVERNER_ADDRESS_GOERLI, RectangleGovernerABI.abi, ethers.getDefaultProvider(chainId));
  const { state, send } = useContractFunction(rectangleGoverner, 'propose', { transactionName: 'CreateProposal' });
  const router = useRouter();

  useEffect(()=>{
    if(state.status == 'Success'){
      setTimeout(()=>{
        resetCreateProposalForm();
        setShowLoadingButton(false);
        refreshProposals(true);
      }, 1200);  
    }

    if(state.status == 'Fail' || state.status == 'Exception' ) {
      notify("Error!", state.errorMessage)
      setTimeout(()=>{
        resetCreateProposalForm();
        setShowLoadingButton(false);
        resetCreateProposalForm();
      }, 1200); 
    }

    if(state.status != 'None'){
      setShowLoadingButton(true)
    }

  }, [state])


  const resetCreateProposalForm = ()=>{
    setDimension('');
    setValue('');
    setDescription('');
  }

  const createProposal = (e) => {    
    console.log(e);

    e.preventDefault();

    if(chainId != `${Goerli.chainId}`){
      notify("ERROR", "Please switch to Goerli network");
      return;
    }

    if(account == null){
      notify("ERROR", "Please connect to metamask wallet");
      return;
    }

    if(dimension != 'setLength' && dimension != 'setWidth'){
      notify("Hmmmm", "This should not have happened!");
      return
    }

    const rectangle = new ethers.Contract(RECTANGLE_ADDRESS_GOERLI, RectangleABI.abi, ethers.getDefaultProvider(Goerli.chainId));
    const targets = [RECTANGLE_ADDRESS_GOERLI];
    const values = [0];
    const calldatas = [rectangle.interface.encodeFunctionData(dimension, [value])];
    send(targets, values, calldatas, description);
  }

  return (
    <div className="w-full my-8">
      <h1 className="text-3xl">Create Proposal</h1>

      <form className="flex flex-col" onSubmit={createProposal}>
        <div className="form-control w-full max-w-xs m-4">
          <label className="label">
            <span className="label-text">Pick the target</span>
          </label>
          <select className="select select-bordered">
            <option value={RECTANGLE_ADDRESS_GOERLI} selected>Rectangle</option>
          </select>
        </div>

        <div className="form-control w-full max-w-xs m-4">
          <label className="label">
            <span className="label-text">Pick the dimension to change</span>
          </label>
          <select className="select select-bordered" value={dimension} required onChange={e => setDimension(e.target.value)}>
            <option value="" disabled selected>
              Pick one
            </option>
            <option value="setLength">Length</option>
            <option value="setWidth">Width</option>
          </select>
        </div>

        <div className="form-control w-full max-w-xs m-4">
          <label className="label">
            <span className="label-text">
              Provide a value for the selected dimension
            </span>
          </label>
          <input
            type="number"
            min="1"
            placeholder="value in px"
            className="input input-bordered w-full max-w-xs"
            required
            onChange={e => setValue(e.target.value)}
            value={value}
          />
        </div>

        <div className="form-control w-full max-w-md m-4">
          <label className="label">
            <span className="label-text">Description</span>
          </label> 
          <textarea required className="textarea textarea-bordered h-24" value={description} onChange={e => setDescription(e.target.value)} placeholder="Please enter proposal description here..."></textarea>
        </div>

        <div className="form-control w-full max-w-fit m-4">
          {showLoadingButton ?
           <button disabled className="btn btn-primary loading">{state.status}</button>
          :
           <input type="submit" value="Submit" className="btn btn-primary" />}
        </div>
      </form>
    </div>
  )
}
