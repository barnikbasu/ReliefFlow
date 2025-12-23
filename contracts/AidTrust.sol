// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/** * @title AidTrust
 * @dev This is our custom registry for IIT KGP hackathon. 
 * It maps who is a victim and which shops are allowed to take the aid tokens.
 */
contract AidTrust is Ownable {
    // 1: Food, 2: Meds, 3: Tools/Construction
    mapping(address => uint8) public vendorType;
    mapping(address => bool) public isVictim;

    // Event for the audit trail dashboard
    event VictimAdded(address user);
    event ShopVerified(address shop, uint8 category);

    constructor() Ownable(msg.sender) {}

    // Function to add multiple victims at once to save gas during emergencies
    function onboardVictims(address[] calldata people) external onlyOwner {
        for(uint i = 0; i < people.length; i++) {
            isVictim[people[i]] = true;
            emit VictimAdded(people[i]);
        }
    }

    function addLocalVendor(address shopAddr, uint8 cat) external onlyOwner {
        require(cat > 0 && cat < 4, "Invalid category: Use 1, 2, or 3");
        vendorType[shopAddr] = cat;
        emit ShopVerified(shopAddr, cat);
    }
}
