// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./AidTrust.sol";

contract SahayataCoin is ERC20 {
    AidTrust public trustRegistry;
    
    // Custom Logic: Daily Spending Limits (Default 50 tokens)
    uint256 public constant DAILY_LIMIT = 50 * 10**18; 
    mapping(address => uint256) public spentToday;
    mapping(address => uint256) public lastSpendTimestamp;

    // Public stats for the Transparency Dashboard
    uint256 public totalFoodDistributed;
    uint256 public totalMedsDistributed;

    constructor(address _reg) ERC20("Sahayata Token", "SAH") {
        trustRegistry = AidTrust(_reg);
    }

    // OVERRIDING THE UPDATE FUNCTION (This is the "Brain" of the system)
    function _update(address from, address to, uint256 amount) internal override {
        // Only check rules if the 'from' address is a registered victim
        if (trustRegistry.isVictim(from)) {
            uint8 cat = trustRegistry.vendorType(to);
            
            // 1. Check if recipient is a verified vendor
            require(cat != 0, "BLOCK: Recipient is not a registered Relief Shop");

            // 2. Custom Logic: Reset daily limit if 24 hours passed
            if (block.timestamp > lastSpendTimestamp[from] + 1 days) {
                spentToday[from] = 0;
                lastSpendTimestamp[from] = block.timestamp;
            }

            // 3. Enforce Daily Cap
            require(spentToday[from] + amount <= DAILY_LIMIT, "EXCEEDED: You hit your daily aid cap");
            
            // 4. Update Audit Stats
            spentToday[from] += amount;
            if (cat == 1) totalFoodDistributed += amount;
            if (cat == 2) totalMedsDistributed += amount;
        }

        super._update(from, to, amount);
    }

    // Only NGO should call this to fund the victims
    function distributeAid(address receiver, uint256 amount) external {
        // TODO: Add access control for NGO admin only
        _mint(receiver, amount);
    }
}
