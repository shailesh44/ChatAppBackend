
// const hre = requrie("hardhat")
const { ethers } = require("hardhat");


async function main() {
   const [deployer] = await ethers.getSigners();
   console.log("contract deployed with the account:=> ", deployer.address);
   console.log("account balance :=>", (await deployer.getBalance()).toString());
   const UtilityApp = await ethers.getContractFactory("UtilityApp");
  //  const amount =  hre.ethers.utilis.parseEther("100");
   const contract = await UtilityApp.deploy();
   console.log("contract address => ", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });