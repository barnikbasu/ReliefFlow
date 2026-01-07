# 🛡️ Sahayata Protocol: Programmable Disaster Relief

**Track:** Social Impact / DeFi & RWA  
**Project Status:** High-Fidelity Local Prototype (Polygon Amoy Integration)

## 📌 Overview
Sahayata (meaning "Help") is a decentralized, programmable stablecoin protocol designed to eliminate the "Last Mile" leakage in humanitarian aid. By utilizing smart contract-enforced spending controls, the protocol ensures that aid reaches verified beneficiaries and is spent **exclusively** at authorized essential-goods vendors.



## ⚠️ The Problem
Traditional disaster relief often suffers from up to 30% fund leakage due to:
1. **Administrative Corruption:** Funds diverted before reaching victims.
2. **Lack of Transparency:** Donors cannot track if their money bought food or non-essentials.
3. **Identity Fraud:** Difficulty in ensuring aid reaches the right person in a chaotic environment.

## ✅ Our Solution: "Smart Aid"
Sahayata turns stablecoins into "Purpose-Linked" assets. By intercepting the `transfer` logic on-chain, we ensure:
* **Restricted Spending:** Tokens tagged for "Medical Aid" only unlock at whitelisted Pharmacy addresses.
* **Daily Velocity Caps:** Limits per-day spending to prevent fund draining or theft.
* **Immutable Audit Trail:** Real-time visibility for NGOs and donors through our Transparency Dashboard.

## 🛠️ Technical Stack
* **Smart Contracts:** Solidity (OpenZeppelin ERC-20 standards)
* **Framework:** Hardhat
* **Blockchain:** Polygon Amoy Testnet (Local Simulation)
* **Frontend:** Next.js 14, Tailwind CSS, Lucide Icons
* **Web3 Integration:** Ethers.js



## 🏗️ Technical Architecture
1. **AidTrust.sol:** A registry contract that manages the identities of verified NGOs, Victims, and Merchants.
2. **SahayataCoin.sol:** The core logic. It uses a custom `_update` hook to check the recipient's category and the sender's daily balance before allowing a transaction.
3. **Frontend Dashboard:** Fetches on-chain events to display total aid distributed and spending categories.

## ⚙️ Local Setup & Execution
As this is a technical prototype, follow these steps to run the environment locally:

### 1. Smart Contracts
```bash
# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Run tests to verify spending logic
npx hardhat test
