const hre = require("hardhat");

async function main() {
  const Sahayata = await hre.ethers.getContractFactory("SahayataProtocol");
  console.log("Deploying SahayataProtocol...");
  const sahayata = await Sahayata.deploy();
  await sahayata.deploymentTransaction();
  await sahayata.waitForDeployment();
  console.log("SahayataProtocol deployed to:", sahayata.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
