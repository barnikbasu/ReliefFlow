# 🛡️ Sahayata Protocol: Programmable Disaster Relief

**Track:** Social Impact / DeFi & RWA  
**Project Status:** Functional Prototype (Polygon Amoy Testnet)

## 📌 Description: The Sahayata Protocol
Sahayata is a decentralized, programmable stablecoin system designed to eliminate "Last Mile" leakage in disaster relief. Unlike traditional cash transfers that are slow and opaque, Sahayata utilizes smart contract-enforced spending controls to ensure aid reaches verified beneficiaries and is spent exclusively at authorized essential-goods vendors (e.g., pharmacies and grocery stores). By programming the money itself, we move disaster relief from a "leap of faith" to a "cryptographic certainty."

## ⚠️ The Problem Statement
Addressing the **EIBS Social Impact track**, Sahayata solves aid leakage and opacity. Traditional relief systems lose up to 30% of funds to administrative friction or corruption. Donors often have no way to verify if their contributions were spent on essentials. Our solution replaces cash with programmable stablecoins featuring on-chain whitelisting and category-based limits, ensuring 100% utility and providing a tamper-proof audit trail.



## 🚀 Key Features
* **Beneficiary Whitelisting:** Identity management via `AidTrust.sol` to ensure only verified victims receive aid.
* **Category-Based Spending:** Smart contracts restrict transfers so that "Food Aid" cannot be diverted to non-essential items.
* **Daily Spending Caps:** On-chain logic to prevent fund-draining and ensure sustainable liquidity during a crisis.
* **Public Audit Trail:** A live transparency dashboard fetching on-chain metrics to show real-time impact to donors.

## 🛠️ Tech Stack
- **Smart Contracts:** Solidity (OpenZeppelin Standards)
- **Framework:** Hardhat
- **Blockchain:** Polygon Amoy Testnet
- **Frontend:** Next.js, Tailwind CSS, Lucide-React
- **Web3 Library:** Ethers.js
- **Deployment:** Vercel

## 🏗️ Technical Architecture
1. **Onboarding:** NGOs verify victims and merchants on `AidTrust.sol`.
2. **Distribution:** Stablecoins are minted to victims' wallets.
3. **Execution:** `SahayataCoin.sol` intercepts transactions to verify the merchant category and check daily limits.
4. **Transparency:** Frontend provides real-time data on distribution velocity and category-wise spending.



## 👥 Team Sahayata
* **Barnik Basu (Team Leader):** Lead Smart Contract Architect – Built `SahayataCoin.sol` & `AidTrust.sol`.
* **Soumyajoy Chakraborty:** Web3 Frontend Engineer – Developed the Next.js Dashboard & Ethers.js integration.
* **Anubhav Dey:** Research & Tokenomics Lead – Problem analysis, system design, and documentation.
* **Sayan Das:** DevOps & Infrastructure – Polygon Amoy deployment, seeding test data, and Vercel hosting.

## 🔗 Project Links
- **Live Demo:** [Insert your Vercel Link here]
- **Video Pitch:** [Insert your YouTube/Drive Link here]
- **Smart Contract (Amoy):** [Insert SahayataCoin Address]

---
*Developed for EIBS 2.0 Hackathon - IIT Kharagpur.*
