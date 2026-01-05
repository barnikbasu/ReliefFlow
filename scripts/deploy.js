const hre = require("hardhat");

async function main() {
  const Sahayata = await hre.ethers.getContractFactory("SahayataProtocol");
  console.log("Deploying SahayataProtocol...");
  const sahayata = await Sahayata.deploy();
  await sahayata.deployed();
  console.log("SahayataProtocol deployed to:", sahayata.address);
  // Print formatted output for CI consumption
  console.log("::set-output name=address::" + sahayata.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
