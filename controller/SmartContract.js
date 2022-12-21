const CONTRACT_ABI = require('../config/config.json');
const { ethers } = require("ethers");
const { check, validationResult } = require("express-validator");
const { Console } = require("console");
const path = require('path');
require('dotenv').config()
const Web3 = require('web3')

const web3 = new Web3(process.env.HTTP_URL);
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const private_keySigner = process.env.PRIVATE_KEY;
const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
//ether js 

//ipfs import
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient.create('/ip4/127.0.0.1/tcp/5001')
const fs = require('fs');

// signup function
exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg,
            status: 422
        });
    }
    try {
        const {userAddress,  userName, _RSA_Public_Key, private_key } = req.body;
        console.log(req.body);
      
let provider = ethers.getDefaultProvider(process.env.HTTP_URL);

let privateKey = process.env.PRIVATE_KEY;

let wallet = new ethers.Wallet(privateKey, provider)
// Ether amount to send
let amountInEther = '100'
// Create a transaction object
let tx = {
    to: userAddress,
    // Convert currency unit from ether to wei
    value: ethers.utils.parseEther(amountInEther)
}
// Send a transaction
wallet.sendTransaction(tx)
.then((txObj) => {
    console.log('txHash', txObj.hash)
})


const wait = ms => new Promise(
    (resolve, reject) => setTimeout(resolve, ms)
  );
        const web3 = new Web3(process.env.HTTP_URL);
        const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
        // const private_key = process.env.PRIVATE_KEY;
        const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        await wait(15000);
        const data = await contract.methods.userRegistration(userAddress, userName, _RSA_Public_Key).encodeABI();
        let transactionObj = {
            chainId: process.env.CHAIN_ID,
            to: CONTRACT_ADDRESS,
            data: data,
            gasPrice: web3.utils.toHex(web3.utils.toWei("40", "gwei")), //gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
            gasLimit: web3.utils.toHex(1000000), //gasLimit: web3.utils.toHex(gasLimit),
        };

       let signTransactionObj = await web3.eth.accounts.signTransaction(
            transactionObj,
            private_key
        );
        console.log("signed transaction is", signTransactionObj);
        const hash = await web3.eth.sendSignedTransaction(signTransactionObj.rawTransaction);
        console.log("hash", hash);

       return res.status(200).json({
            status: 200,
            success: true,
            message: "User successfully created",
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message,
            status: 500
        });
        }    }

exports.findUser = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg,

            status: 422
        });
    }


    try {
        const { userName } = req.body;
       
        let findUser =
            await contract.methods.findUser(userName)
                .call();
    

         
        console.log("findUser....",findUser);

        if (findUser.name == "" || findUser.RSA_Key == "") {
            return res.status(400).json({
                error: "USER does not exists",
            });

        }

        let userDetails = {}
        userDetails.name = findUser.name;
        userDetails.userAddress = findUser.userAddress;
        userDetails.RSA_Key = findUser.RSA_Key;
    
        return res.status(200).json({
            status: 200,
            userDetails: userDetails,
            success: true,
            message: "User found ",

        });

    } catch (error) {
        return res.status(500).json({
            error: error.message,
            status: 500
        });
    }

};

exports.sendMessage = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg,
            status: 422
        });
    }
    try {
        const { from, to, _msg, msgType, private_key } = req.body;

// if (from == '170271640000000000') {
//     console.log("if working===");
    
// }


        const web3 = new Web3(process.env.HTTP_URL);
        const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
        const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

     const balance =  await  getWalletBalance(from)
     console.log("balance==>", balance);
     if (balance <=100) {
        console.log(" inside if");
     }

     

        const MsgData = await contract.methods.sendMessage(from, to, _msg, msgType).encodeABI();
        // console.log("msgdata======>", MsgData);
        let transactionObj = {
            chainId: process.env.CHAIN_ID,
            to: CONTRACT_ADDRESS,
            data: MsgData,
            gasPrice: web3.utils.toHex(web3.utils.toWei("10", "gwei")), //gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
            gasLimit: web3.utils.toHex(1000000), //gasLimit: web3.utils.toHex(gasLimit),
        };

        let signTransactionObj = await web3.eth.accounts.signTransaction(
            transactionObj,
            private_key
        );
        // console.log("signed transaction is", signTransactionObj);
        const hash = await web3.eth.sendSignedTransaction(signTransactionObj.rawTransaction);
        // console.log("hash", hash);

        return res.status(200).json({
            status: 200,
            success: true,
            message: "msg successfully send",
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message,
            status: 500
        });
    }
};


//getBalancwe 
const getWalletBalance = async function (address) {
    try {
        const weiBalance = await web3.eth.getBalance(address);
        const bnbBalance = Number(web3.utils.fromWei(weiBalance));
        console.log("bnbBalance===",bnbBalance);
   
        return (bnbBalance); 
    } catch (error) {
        console.log("Error in main catch: ", error);
        return { error: true, message: error }
    }



}

exports.readMessage = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg, 
            status: 422
        });
    }

    try {
        const { from, to } = req.body;
        let read = await contract.methods.readMessage(from, to).call();
        console.log("gaaaaaa", read);

        let test = []
        for (const array1 of read) {
                let newArr =  {"sender": array1[0],
                "timestamp": array1[1],
                "msg": array1[2],
                "msgType": array1[3]}
                test.push(newArr);
        }
        ///console.log('test-------------------------', test)      
        let test1 = test.filter(item =>
            item.timestamp >= req.body.firstTime && item.timestamp <= req.body.secondTime
            //m.min <= wallet.staking_balance && m.max >= wallet.staking_balance);
        );
        return res.status(200).json({
            status: 200,
            success: true,
            message: test1,

        });

    } catch (error) {
        return res.status(500).json({
            error: error.message,
            status: 500
        });
    }
};

// update rsa_key

exports.updateRSAkey = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg,
            status: 422
        });
    }
    try {
        const { newRSAkey, private_key } = req.body;
        console.log(req.body);

        const web3 = new Web3(process.env.HTTP_URL);
        const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
        const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        const data = await contract.methods.updateRSAkey(newRSAkey).encodeABI();
        let transactionObj = {
            chainId: process.env.CHAIN_ID,
            to: CONTRACT_ADDRESS,
            data: data,
            gasPrice: web3.utils.toHex(web3.utils.toWei("60", "gwei")), //gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
            gasLimit: web3.utils.toHex(1000000), //gasLimit: web3.utils.toHex(gasLimit),
        };

        let signTransactionObj = await web3.eth.accounts.signTransaction(
            transactionObj,
            private_key
        );
        console.log("signed transaction is", signTransactionObj);
        const hash = await web3.eth.sendSignedTransaction(signTransactionObj.rawTransaction);
        console.log("hash", hash);

        return res.status(200).json({
            status: 200,
            success: true,
            message: "RSA key updated successfully :0",
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message,
            status: 500
        });
    }
};
exports.userList = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg,
            status: 422
        });
    }


    try {
        const { userAddress } = req.body;
        let findUserByAddr = await contract.methods.userList(userAddress).call();
  
       
        if(!findUserByAddr){
            return res.status(400).json({
                error: "USER does not exists",
                message: "user does not exist",
                status: "true",
              });
        }
        let userDetails  = {}
        userDetails.name = findUserByAddr.name;
        userDetails.userAddress= findUserByAddr.userAddress;
        userDetails.RSA_Key = findUserByAddr.RSA_Key;
       
        return res.status(200).json({
            status: 200,
            userDetails: userDetails,
            success: true,
            message: "User found ",



       });
    
    } catch (error) {
        return res.status(500).json({
            error: error.message,
            status: 500
        });
    }



};

//ipfs APis

exports.IpfsModel = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg,
            status: 422
        });
    }
    let fileName = req.body.fileName;
    console.log("Inside controller---->", fileName);
    const imgdata = fs.readFileSync(path.resolve(__dirname, '../files/' + fileName));
    try {

        let fileHash = await ipfs.add({
            path: `files/${fileName}`, content: imgdata
        },
            { wrapWithDirectory: true })
        console.log('fileHash', fileHash);
        return res.send(`http://127.0.0.1:8080/ipfs/${fileHash.cid}`)


    } catch (error) {
        return res.status(500).json({
            error: error.message,
            status: 500
        });
    }
};



// send media with IPFS

exports.sendMedia = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg,
            status: 422
        });
    }
    try {
        let { from, to, _msg, msgType, private_key } = req.body;

        let fileName = req.body.fileName; 
        // const staticFile = "image2.jpeg";
            if(msgType == "media"){
        // let fileName = staticFile;
    console.log("Inside controller---->", fileName);
    const imgdata = fs.readFileSync(path.resolve(__dirname, '../.files/' + fileName));
    console.log("imgdata", imgdata);
    let fileHash = await ipfs.add({
        path: `../files/${fileName}`, content: imgdata  },
        { wrapWithDirectory: true })
        console.log('fileHash', fileHash);
        
        // return res.send(`http://127.0.0.1:8080/ipfs/${fileHash.cid}`)
        let mediaHash  = await (`${fileHash.cid}`)
        console.log("hash of media file",mediaHash);
     _msg=mediaHash
    }

        const web3 = new Web3(process.env.HTTP_URL);
        const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
        // const private_key = process.env.PRIVATE_KEY;
        const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        const MsgData = await contract.methods.sendMessage(from, to, _msg, msgType).encodeABI();
        // console.log("msgdata======>", MsgData);

        let transactionObj = {
            chainId: process.env.CHAIN_ID,
            to: CONTRACT_ADDRESS,
            data: MsgData,
            gasPrice: web3.utils.toHex(web3.utils.toWei("100", "gwei")), //gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
            gasLimit: web3.utils.toHex(1000000), //gasLimit: web3.utils.toHex(gasLimit),
        };

        let signTransactionObj = await web3.eth.accounts.signTransaction(
            transactionObj,
            private_key
        );
        // console.log("signed transaction is", signTransactionObj);
        const hash = await web3.eth.sendSignedTransaction(signTransactionObj.rawTransaction);
        // console.log("hash", hash);

        return res.status(200).json({
            status: 200,
            success: true,
            message: "msg successfully send",
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message,
            status: 500
        });
    }
};



// exports.restoreData = async (req, res) => {
//     const errors = validationResult(req)
//     if (!errors.isEmpty()) {
//         return res.status(422).json({
//             error: errors.array()[0].msg,
//             status: 422
//         });
//     }
//     try {
//         const { from, to, _msg, msgType, private_key } = req.body;
//         const staticFile = "image2.jpeg";
        
//             if(msgType == "media"){
        
//         let fileName = staticFile;
    
//     console.log("Inside controller---->", fileName);
//     const imgdata = fs.readFileSync(path.resolve(__dirname, '../files/' + fileName));
//     console.log("imgdata", imgdata);
//     let fileHash = await ipfs.add({
//         path: `files/${fileName}`, content: imgdata  },
//         { wrapWithDirectory: true })
//         console.log('fileHash', fileHash);
//         return res.send(`http://127.0.0.1:8080/ipfs/${fileHash.cid}`)
    

//     }


//         const web3 = new Web3(process.env.HTTP_URL);
//         const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
//         // const private_key = process.env.PRIVATE_KEY;
//         const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
//         const MsgData = await contract.methods.sendMessage(from, to, _msg, msgType).encodeABI();
//         console.log("msgdata======>", MsgData);

//         let transactionObj = {
//             chainId: process.env.CHAIN_ID,
//             to: CONTRACT_ADDRESS,
//             data: MsgData,
//             gasPrice: web3.utils.toHex(web3.utils.toWei("60", "gwei")), //gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
//             gasLimit: web3.utils.toHex(1000000), //gasLimit: web3.utils.toHex(gasLimit),
//         };

//         let signTransactionObj = await web3.eth.accounts.signTransaction(
//             transactionObj,
//             private_key
//         );
//         console.log("signed transaction is", signTransactionObj);
//         const hash = await web3.eth.sendSignedTransaction(signTransactionObj.rawTransaction);
//         console.log("hash", hash);

//         return res.status(200).json({
//             status: 200,
//             success: true,
//             message: "msg successfully send",
//         });
//     } catch (error) {
//         return res.status(500).json({
//             error: error.message,
//             status: 500
//         });
//     }
// };
