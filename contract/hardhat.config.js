require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");


const private_key = "1ab129de18e2934201d88fe80c7f842efc13e2c13fee8e8e1ca01e3368d040c4"
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.16",
  networks : { 
    ShadowNest: { 
      // Matic_Mumbai : { 
      url: "http://3.112.128.177:10002/",
      // url: "https://rpc-mumbai.maticvigil.com",
      accounts: [`0x${private_key}`],
      chainId: 100,
    }
  },
  etherscan: {
    apiKey:"GB83J8Z9WF5MS9SREWFH1GG13FPEF6XW3I",
 }

};
