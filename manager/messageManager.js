const socketManager = require('./socketManager');
const CONTRACT_ABI = require('../config/config.json')
require('dotenv').config()
const { ethers } = require("ethers");
const Web3 = require('web3');
const { request, response } = require('express');
const path = require('path');

//ipfs import
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient.create('/ip4/0.0.0.0/tcp/5001')
const fs = require('fs');

/**
 * ether
 * 
 */
 let provider = new ethers.providers.JsonRpcProvider(process.env.HTTP_URL);
 privateKey =  process.env.PRIVATE_KEY
/**
 * WEB3 instance
 */
const web3 = new Web3(process.env.HTTP_URL);
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
//  const private_key = process.env.PRIVATE_KEY;
// const private_key = "0x1ab129de18e2934201d88fe80c7f842efc13e2c13fee8e8e1ca01e3368d040c4"
const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);


/**
 * send message
 * @param data object

 */
 const sendMessage = async function (data) {
  
  try {
   
    if(data.msgType == "media"){
console.log("Inside controller---->", data.fileName);

const imgdata = fs.readFileSync(path.resolve(__dirname, '../files/' +  data.fileName));

console.log("imgdata", imgdata);

let fileHash = await ipfs.add({
path: `files/${data.fileName}`, content: imgdata  },

{ wrapWithDirectory: true })

console.log('fileHash', fileHash);

// return res.send(`http://127.0.0.1:8080/ipfs/${fileHash.cid}`)
const mediaHash  = await (`http://3.112.128.177:8080/ipfs/${fileHash.cid}/files`)
// // console.log("hash of media file",mediaHash);
data._msg=mediaHash
}
      const balance =  
      await  getWalletBalance(data.from)
    if (balance <=111) {
     
      const transfer = await TransferMaticFromOwner (data.from)
    }

    const web3 = new Web3(process.env.HTTP_URL);
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
    const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    
    const MsgData = await contract.methods.sendMessage(data.from,data.to, data._msg, data.msgType).encodeABI();
    let transactionObj = {
        chainId: process.env.CHAIN_ID,
        to: CONTRACT_ADDRESS,
        data: MsgData,
        gasPrice: web3.utils.toHex(web3.utils.toWei("60", "gwei")), //gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
        gasLimit: web3.utils.toHex(1000000), //gasLimit: web3.utils.toHex(gasLimit),
    };

    let signTransactionObj = await web3.eth.accounts.signTransaction(
        transactionObj,
        data.private_key
    );
    console.log("signed transaction is", signTransactionObj);
    const hash = await web3.eth.sendSignedTransaction(signTransactionObj.rawTransaction);
    console.log("hash", hash);
    // let data._msg = messageee
    const findUserByAddrForSocket = await contract.methods.userList(data.from).call(); 
    data.RSA_Key = findUserByAddrForSocket.RSA_Key;
    await socketManager.receive(data)
    return  ([{"from":data.from, "to":data.to, "cid/message" :data._msg, "file" :data.fileName, "RSA_Key": findUserByAddrForSocket.RSA_Key}]);
  }
  catch (err) {
    console.log("Error in catch", err);
    return { error: true, message: err };
  }
}

/**
 * send or check balance 
 * 
 */
//getBalancwe 
const getWalletBalance = async function (address) {
  try {
      const weiBalance = await web3.eth.getBalance(address);
      const STKN_Coin = Number(web3.utils.fromWei(weiBalance));
      console.log("STKN_Coin balance===",STKN_Coin);
    
      return (STKN_Coin);
  } catch (error) {
      console.log("Error in main catch: ", error);
      return { error: true, message: error }
  }

 

}



//transfer function 
const TransferMaticFromOwner = async function (address){
  try {
  
    let provider = ethers.getDefaultProvider(process.env.HTTP_URL);
    let privateKey = process.env.PRIVATE_KEY;
    let wallet = new ethers.Wallet(privateKey, provider)
    // Ether amount to send
    let amountInEther = '1'
    let tx = {
        to: address,
        // Convert currency unit from ether to wei
        value: ethers.utils.parseEther(amountInEther)
    }
    wallet.sendTransaction(tx)
    .then((txObj) => {
       
    })
    
  } catch (error) {
    console.log("Error in main catch: ", error);
      return { error: true, message: error }
    
  }
}




/**
 * EXPORT MODULE
 */
module.exports = {
  sendMessage,
}