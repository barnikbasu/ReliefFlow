const hre = require("hardhat");

async function main() {
  // Update these with your real addresses after deployment
  const COIN_ADDR = "PASTE_YOUR_COIN_ADDRESS";
  const TRUST_ADDR = "PASTE_YOUR_TRUST_ADDRESS";

  const [admin, victim, shop] = await hre.ethers.getSigners();
  const coin = await hre.ethers.getContractAt("SahayataCoin", COIN_ADDR);
  const trust = await hre.ethers.getContractAt("AidTrust", TRUST_ADDR);

  console.log("Seeding test data...");

  // 1. Onboard a victim and a Food Shop (Cat 1)
  await trust.onboardVictims([victim.address]);
  await trust.addLocalVendor(shop.address, 1); 

  // 2. NGO sends aid to victim
  await coin.distributeAid(victim.address, hre.ethers.parseEther("100"));

  // 3. Victim buys food (this triggers the Audit Trail logic)
  await coin.connect(victim).transfer(shop.address, hre.ethers.parseEther("25"));

  console.log("✅ Seeded: Victim bought 25 units of Food. Dashboard updated!");
}

main().catch((e) => { console.error(e); process.exit(1); });
