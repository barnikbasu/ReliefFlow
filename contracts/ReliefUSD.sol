// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./ReliefRegistry.sol";

contract ReliefUSD is ERC20 {
    ReliefRegistry public registry;

    // Public Audit Trail Variables
    mapping(uint8 => uint256) public totalSpentByCategory;

    constructor(address _reg) ERC20("ReliefUSD", "rUSD") {
        registry = ReliefRegistry(_reg);
    }

    function _update(address from, address to, uint256 value) internal override {
        // Rule: If a victim is sending money, it MUST go to a registered merchant
        if (registry.isBeneficiary(from)) {
            uint8 cat = uint8(registry.merchantType(to));
            require(cat > 0, "Unauthorized Spend: Funds can only go to verified vendors");
            totalSpentByCategory[cat] += value;
        }
        super._update(from, to, value);
    }

    function issueAid(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
