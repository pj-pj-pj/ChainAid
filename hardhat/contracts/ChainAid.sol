// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract ChainAid {
    enum CampaignState { Pending, Active, Cancelled, Completed }

    struct Campaign {
        uint256 id;
        address creator;
        string title;
        string description;
        uint256 goalAmount;
        uint256 totalDonations;
        uint256 createdAt;
        uint256 deadline;
        string category;
        string ipfsHash;
        CampaignState state;
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public nextCampaignId;

    uint256 public constant CREATION_FEE = 0.0001 ether;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _goalAmount,
        uint256 _deadline,
        string memory _category,
        string memory _ipfsHash
    ) public payable {
        require(msg.value == CREATION_FEE, "Incorrect creation fee");

        // ✅ Optional IPFS handling — if empty, set default
        string memory finalIpfsHash = bytes(_ipfsHash).length > 0
            ? _ipfsHash
            : "none";

        Campaign storage newCampaign = campaigns[nextCampaignId];
        newCampaign.id = nextCampaignId;
        newCampaign.creator = msg.sender;
        newCampaign.title = _title;
        newCampaign.description = _description;
        newCampaign.goalAmount = _goalAmount;
        newCampaign.createdAt = block.timestamp;
        newCampaign.deadline = _deadline;
        newCampaign.category = _category;
        newCampaign.ipfsHash = finalIpfsHash;
        newCampaign.state = CampaignState.Pending;

        nextCampaignId++;
    }

    // Optional: allow owner to withdraw the fees
    function withdrawFees() external {
        require(msg.sender == owner, "Not authorized");
        payable(owner).transfer(address(this).balance);
    }

    // Donation struct and storage for donations per campaign
    struct Donation {
        uint256 id;
        address donor;
        uint256 amount;
        uint256 timestamp;
        string jsonCid; // IPFS CID for donation metadata JSON
    }

    // mapping from campaignId to list of donations
    mapping(uint256 => Donation[]) public donations;

    // Event emitted when a donation is received (includes pinned metadata CID)
    event DonationReceived(uint256 indexed campaignId, address indexed donor, uint256 amount, string jsonCid);

    // Allow anyone to donate to an existing campaign. The sent value is recorded as totalDonations.
    function donate(uint256 campaignId, string memory jsonCid) external payable {
        require(msg.value > 0, "Donation must be > 0");
        require(campaignId < nextCampaignId, "Invalid campaign");

        Campaign storage c = campaigns[campaignId];

        // update campaign totals
        c.totalDonations += msg.value;

        // record donation struct
        uint256 donationId = donations[campaignId].length;
        donations[campaignId].push(
            Donation({
                id: donationId,
                donor: msg.sender,
                amount: msg.value,
                timestamp: block.timestamp,
                jsonCid: jsonCid
            })
        );

        emit DonationReceived(campaignId, msg.sender, msg.value, jsonCid);
    }
}
