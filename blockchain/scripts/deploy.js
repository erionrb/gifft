const { ethers } = require("hardhat");

const toWei = (num) => ethers.utils.parseEther(num.toString());
const fromWei = (num) => ethers.utils.formatEther(num);

async function main() {
  const [owner] = await ethers.getSigners();

  const contract = await deploy("GifFT", owner);
  saveFrontendFiles(contract, "GifFT");
}

async function deploy(contractName, deployer) {
  const Contract = await ethers.getContractFactory(contractName);
  const deployedContract = await Contract.connect(deployer).deploy();
  console.log(
    `${contractName} deployed by ${deployer.address} with contract address ${deployedContract.address}`
  );
  return deployedContract;
}

function saveFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/contractsdata";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
