// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import RectangleGovernerABI from '../../artifacts/contracts/Governance/Governer.sol/RectangleGoverner.json';
import RectangleABI from '../../artifacts/contracts/Rectangle.sol/Rectangle.json';
import {RECTANGLE_GOVERNER_ADDRESS_GOERLI } from '../../contracts';
import { ethers } from 'ethers'

/**
       * The following is an api communication example. This would be good if we would like to talk to custom provider.
       * This custom provider would prevent private key leakage while talking to the Alchemy provider. 
       * Would be good when we need to read something on the server side and not sign transaction. 
       * For signing transactions, use Metamask or Web3Provider. 
       */
      /**  const body = {
        contract: RECTANGLE_ADDRESS_GOERLI,
        dimension: dimension,
        value: value,
        description: description,
        account: account
      }

      const response = await fetch('/api/create-proposal', {
        method: 'POST',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await response.text()
*/

export default async function create_proposal(req, res) {
    console.log("Process env ",process.env)
    console.log("Body ",req.body)
    const {contract, dimension, value, description, account} = req.body;

    if(dimension != 'setLength' && dimension != 'setWidth'){
        res.status(500).send('Incorrect dimension provided')
    }
    if(value<=0){
        res.status(500).send('Incorrect value provided')
    }
    if(description==""){
        res.status(500).send('Please provide a description')
    }
    if(account==null){
        res.status(500).send('No address provided!')
    }

    let provider;
    if (process.env.ENVIRONMENT === 'local') {
      provider = new ethers.providers.JsonRpcProvider()
    } else if (process.env.ENVIRONMENT === 'testnet') {
      provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_GOERLI_URL)
    }

    const targets = [contract];
    const values = [0];
    const rectangle = new ethers.Contract(contract, RectangleABI.abi, provider)
    const calldatas = [rectangle.interface.encodeFunctionData(dimension, [value])];
    try {
        const signer = provider.getSigner(account);
        const rectangleGoverner = new ethers.Contract(RECTANGLE_GOVERNER_ADDRESS_GOERLI, RectangleGovernerABI.abi, signer)
        const proposeTx = await rectangleGoverner.propose(targets, values, calldatas, description);
        const proposeTxReceipt = await proposeTx.wait();
        const proposalCreatedEvent = proposeTxReceipt.events?.find((x) => {return x.event == "ProposalCreated"})
        const [proposalId] = proposalCreatedEvent.args;
        res.status(200).send(`Proposal created with ${proposalId}`)
    } catch (error) {
        console.log(error);
    }
}
  
  
  