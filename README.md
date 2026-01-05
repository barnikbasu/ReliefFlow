# Sahayata Protocol

Sahayata is a simple on-chain aid/donation protocol allowing users to create aid requests, accept ETH donations, withdraw funds if the goal is met, and allow donors to claim refunds if the goal is not met.

## Quickstart

1. Install dependencies (root)
   - Node >= 18 recommended
   - cd to project root
   - npm install

2. Compile
   - npm run compile

3. Run local Hardhat node
   - npm run node

4. Deploy locally
   - In a new terminal: npm run deploy:local

5. Run tests
   - npm test

6. Frontend
   - cd frontend
   - npm install
   - set REACT_APP_CONTRACT_ADDRESS to deployed contract address
   - npm run dev

## Environment variables
Create a `.env` file in project root with:
```
ALCHEMY_SEPOLIA_URL="https://eth-sepolia.alchemyapi.io/v2/yourKey"
DEPLOYER_PRIVATE_KEY="0x..."
```

## Next steps / Recommended improvements
- Add reentrancy protection (OpenZeppelin ReentrancyGuard).
- Support ERC-20 donations via SafeERC20.
- Add better UI for creating requests and listing them with filters.
- Add a multisig-controlled treasury for mainnet.
- Add analytics and event indexing (TheGraph) for richer UX.

## Security & Auditing
- Run Slither and MythX, and obtain an external audit before mainnet.
- Avoid privileged single-signature keys for important operations.
