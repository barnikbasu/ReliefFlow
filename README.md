# Sahayata Protocol

Sahayata is a simple on-chain aid/donation protocol allowing users to create aid requests, accept ETH donations, withdraw funds if the goal is met, and allow donors to claim refunds if the goal is not met.

## Quickstart (local)

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
   - copy `.env.example` to `.env` and set `VITE_CONTRACT_ADDRESS`
   - npm run dev

## Environment variables
Create a `.env` file in project root with:
```
ALCHEMY_SEPOLIA_URL="https://eth-sepolia.alchemyapi.io/v2/yourKey"
DEPLOYER_PRIVATE_KEY="0x..."
```

In the frontend, set:
```
VITE_CONTRACT_ADDRESS="0x...."
```

## CI & Auto-deploy
A GitHub Actions workflow will run tests on pushes and can deploy to Sepolia using the `ALCHEMY_SEPOLIA_URL` and `DEPLOYER_PRIVATE_KEY` repository secrets.

## Next steps
- Add ReentrancyGuard and OpenZeppelin patterns before mainnet.
- Support ERC-20 donations.
- External audit before mainnet.
