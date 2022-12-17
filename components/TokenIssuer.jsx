import { useEffect, useRef, useState } from 'react'
import { useEthers, Goerli, useContractFunction } from '@usedapp/core'
import { ethers } from 'ethers'
import RectangleCrowdsaleABI from '../artifacts/contracts/Token/RectangleCrowdsale.sol/RectangleCrowdsale.json';
import { RECTANGLE_CROWDSALE } from '../contracts';
import { Contract } from '@ethersproject/contracts'
import { RECTANGLE_TOKEN_ADDRESS_GOERLI, MASTER_TOKEN_ACCOUNT } from '../contracts';
import RectangleTokenABI from '../artifacts/contracts/Token/RectangleToken.sol/RectangleToken.json';
import notify from "./notify.jsx";


export default function TokenIssuer(props) {
  // const {balance, totalAmountLeft}=props;
  const [value, setValue] = useState(0);
  const [showLoadingButton, setShowLoadingButton] = useState(false);
  const { chainId, account } = useEthers();
  const rectangleCrowdsale = new Contract(RECTANGLE_CROWDSALE, RectangleCrowdsaleABI.abi);
  const { state, send } = useContractFunction(rectangleCrowdsale, 'buyTokens', { transactionName: 'BuyTokens' });
  const [balance, setBalance] = useState(undefined);
  const [totalAmountLeft, setTotalAmountLeft] = useState(undefined);
  const [refreshBalances, setRefreshBalances] = useState(false);
  const [delegateTokens, setDelegateTokens] = useState(false);



  useEffect(() => {
    (async () => {
      if(window!=undefined && window.ethereum != undefined && chainId == Goerli.chainId && account != undefined && delegateTokens){   
        console.log("Delegating");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const rectangleToken = new ethers.Contract(RECTANGLE_TOKEN_ADDRESS_GOERLI, RectangleTokenABI.abi, provider);
        const delegate = await rectangleToken.connect(signer).delegate(account);
        await delegate.wait();
        setDelegateTokens(false);
      }
    })();
    return () => {
      // this now gets called when the component unmounts
    };
  }, [delegateTokens]);


  useEffect(() => {
    if(window!=undefined && window.ethereum != undefined && chainId == Goerli.chainId && account != undefined){   
        console.log("I am called");
        const rectangleToken = new ethers.Contract(RECTANGLE_TOKEN_ADDRESS_GOERLI, RectangleTokenABI.abi, new ethers.providers.Web3Provider(window.ethereum));
        rectangleToken.balanceOf(MASTER_TOKEN_ACCOUNT).then(totalAmountLeft =>{
          setTotalAmountLeft(ethers.utils.formatEther(totalAmountLeft))
        });
        rectangleToken.balanceOf(account).then(balance=>{
          setBalance(ethers.utils.formatEther(balance));
        });
    }
  }, [account, refreshBalances]);


  useEffect(()=>{
    if(state.status == 'Success'){
      notify("Thanks For Buying!", `Bought ${value} RECTS`);
      setRefreshBalances(true);
      setDelegateTokens(true);
      setTimeout(()=>{
        setRefreshBalances(false);
        setShowLoadingButton(false);
        resetTokenForm();
      }, 1200);  
    }

    if(state.status == 'Fail' || state.status == 'Exception' ) {
      notify("Error!", state.errorMessage)
      setDelegateTokens(false);
      setTimeout(()=>{
        setShowLoadingButton(false);
        resetTokenForm()
      }, 1200);  
    }

    if(state.status != 'None'){
      setShowLoadingButton(true)
    }

  }, [state])

  const resetTokenForm = ()=>{
    setValue(0);
  };

  const sendTokens = (e)=>{
    e.preventDefault();
    
    console.log("need to send value", value);
    console.log("address ", account);

    if(window.ethereum != undefined &&  value != 0){
      send(value);
    }
  }

  return (
    <div className="flex justify-center">
      <div>
        <div className='mb-4'>
          <h1 className='text-3xl'>Get Tokens!</h1>
        </div>
        <form className="flex flex-col" onSubmit={sendTokens}>
          <div className="form-control">
            {
              totalAmountLeft &&
              <label className="label">
                <span className="label-text">{totalAmountLeft} RECTS left to claim</span>
              </label>
            }
          
            <label className="input-group">
              <input type="number" value={value} min="1" placeholder="Enter amount" className="input input-bordered" onChange={e => setValue(e.target.value)}/>
              <span>RECTS</span>
            </label>

            {
              balance &&
              <label className="label">
                <span className="label-text-alt">Current Balance {balance} RECTS</span>
              </label>
            }

          </div>
          <div className="form-control w-full max-w-fit mt-4">
          {showLoadingButton ?
           <button disabled className="btn btn-primary loading">{state.status}</button>
            :
           <input type="submit" value="Send Tokens" disabled={value==0} className="btn btn-primary" />}
        </div>
        </form>
      </div>
       
    </div>
  )
}
