// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/// @title Sahayata Protocol — simple donation/aid request contract
/// @author
/// @notice Allows users to create aid requests, accept ETH donations, withdraw if goal met, and refunds if goal not met.
contract SahayataProtocol {
    uint256 public requestCount;

    struct Request {
        uint256 id;
        address payable creator;
        string title;
        string description;
        uint256 goal; // in wei
        uint256 raised; // in wei
        uint256 deadline; // unix timestamp
        bool withdrawn;
        bool exists;
    }

    // request id => Request
    mapping(uint256 => Request) public requests;
    // request id => donor => amount
    mapping(uint256 => mapping(address => uint256)) public donations;

    event RequestCreated(uint256 indexed id, address indexed creator, uint256 goal, uint256 deadline);
    event Donated(uint256 indexed id, address indexed donor, uint256 amount);
    event Withdrawn(uint256 indexed id, address indexed creator, uint256 amount);
    event Refunded(uint256 indexed id, address indexed donor, uint256 amount);

    modifier requestExists(uint256 _id) {
        require(requests[_id].exists, "Request does not exist");
        _;
    }

    /// @notice Create a new aid request
    /// @param _title short title
    /// @param _description longer description
    /// @param _goal target amount in wei
    /// @param _durationSeconds duration in seconds from now for which donations will be accepted
    function createRequest(
        string calldata _title,
        string calldata _description,
        uint256 _goal,
        uint256 _durationSeconds
    ) external returns (uint256) {
        require(_goal > 0, "Goal must be > 0");
        require(_durationSeconds >= 1 hours, "Duration too short");

        requestCount++;
        uint256 id = requestCount;

        requests[id] = Request({
            id: id,
            creator: payable(msg.sender),
            title: _title,
            description: _description,
            goal: _goal,
            raised: 0,
            deadline: block.timestamp + _durationSeconds,
            withdrawn: false,
            exists: true
        });

        emit RequestCreated(id, msg.sender, _goal, requests[id].deadline);
        return id;
    }

    /// @notice Donate ETH to a request
    /// @param _id request id
    function donate(uint256 _id) external payable requestExists(_id) {
        Request storage r = requests[_id];
        require(block.timestamp <= r.deadline, "Deadline passed");
        require(msg.value > 0, "Must send ETH");
        r.raised += msg.value;
        donations[_id][msg.sender] += msg.value;
        emit Donated(_id, msg.sender, msg.value);
    }

    /// @notice Withdraw funds to the creator if goal met
    /// @param _id request id
    function withdraw(uint256 _id) external requestExists(_id) {
        Request storage r = requests[_id];
        require(msg.sender == r.creator, "Only creator");
        require(block.timestamp <= r.deadline || r.raised >= r.goal, "Cannot withdraw yet");
        require(r.raised >= r.goal, "Goal not reached");
        require(!r.withdrawn, "Already withdrawn");

        r.withdrawn = true;
        uint256 amount = r.raised;
        // reset raised to prevent double-withdraw
        r.raised = 0;
        (bool success, ) = r.creator.call{value: amount}("");
        require(success, "Transfer failed");
        emit Withdrawn(_id, r.creator, amount);
    }

    /// @notice Refund donation to donor if goal not met and deadline passed
    /// @param _id request id
    function claimRefund(uint256 _id) external requestExists(_id) {
        Request storage r = requests[_id];
        require(block.timestamp > r.deadline, "Deadline not passed");
        require(r.raised < r.goal, "Goal was reached");
        uint256 donated = donations[_id][msg.sender];
        require(donated > 0, "No donation to refund");

        // zero out donor's donation first (pull pattern)
        donations[_id][msg.sender] = 0;
        // reduce raised for bookkeeping
        if (r.raised >= donated) {
            r.raised -= donated;
        } else {
            r.raised = 0;
        }

        (bool success, ) = payable(msg.sender).call{value: donated}("");
        require(success, "Refund transfer failed");
        emit Refunded(_id, msg.sender, donated);
    }

    /// @notice Fetch request details (convenience)
    function getRequest(uint256 _id)
        external
        view
        requestExists(_id)
        returns (
            uint256 id,
            address creator,
            string memory title,
            string memory description,
            uint256 goal,
            uint256 raised,
            uint256 deadline,
            bool withdrawn
        )
    {
        Request memory r = requests[_id];
        return (r.id, r.creator, r.title, r.description, r.goal, r.raised, r.deadline, r.withdrawn);
    }
}
