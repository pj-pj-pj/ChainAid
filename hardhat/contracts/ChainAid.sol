// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract ChainAid {
    enum CampaignState { Pending, Active, Cancelled, Completed }

    struct Campaign {
        uint256 id;
        address creator;
        string title;
        string organization;
        string description;
        uint256 goalAmount;
        uint256 totalDonations;
        uint256 createdAt;
        uint256 deadline;
        string category;
        string ipfsHash;
        CampaignState state;
        uint256 supportCount; // 🆕 number of supporters
    }

    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(address => bool)) public hasSupported; // 🆕 track if address already supported

    uint256 public nextCampaignId;
    uint256[] public campaignIds;

    uint256 public constant CREATION_FEE = 0.0001 ether;
    uint256 public constant ACTIVATION_THRESHOLD = 1; // 🆕 required supporters
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function createCampaign(
        string memory _title,
        string memory _organization,
        string memory _description,
        uint256 _goalAmount,
        uint256 _deadline,
        string memory _category,
        string memory _ipfsHash
    ) public payable {
        require(msg.value == CREATION_FEE, "Incorrect creation fee");

        string memory finalIpfsHash = bytes(_ipfsHash).length > 0
            ? _ipfsHash
            : "none";

        Campaign storage newCampaign = campaigns[nextCampaignId];
        newCampaign.id = nextCampaignId;
        newCampaign.creator = msg.sender;
        newCampaign.title = _title;
        newCampaign.organization = _organization;
        newCampaign.description = _description;
        newCampaign.goalAmount = _goalAmount;
        newCampaign.createdAt = block.timestamp;
        newCampaign.deadline = block.timestamp + _deadline;
        newCampaign.category = _category;
        newCampaign.ipfsHash = finalIpfsHash;
        newCampaign.state = CampaignState.Pending;
        newCampaign.supportCount = 0;

        campaignIds.push(nextCampaignId);
        nextCampaignId++;
    }

    // 🆕 Support a campaign
    function supportCampaign(uint256 campaignId) external {
        Campaign storage campaign = campaigns[campaignId];
        require(campaign.creator != address(0), "Campaign does not exist");
        require(campaign.state == CampaignState.Pending, "Campaign not in pending state");
        require(!hasSupported[campaignId][msg.sender], "Already supported");

        hasSupported[campaignId][msg.sender] = true;
        campaign.supportCount++;

        // 🆕 Auto-activate when threshold reached
        if (campaign.supportCount >= ACTIVATION_THRESHOLD) {
            campaign.state = CampaignState.Active;
        }
    }

    function donateToCampaign(uint256 campaignId) external payable {
        Campaign storage campaign = campaigns[campaignId];
        require(campaign.creator != address(0), "Campaign does not exist");
        require(campaign.state == CampaignState.Active, "Campaign is not active");
        require(msg.value > 0, "Must send ETH to donate");
        require(block.timestamp < campaign.deadline, "Campaign has ended");

        campaign.totalDonations += msg.value;
    }

    function getAllCampaigns() external view returns (Campaign[] memory) {
        uint256 count = campaignIds.length;
        Campaign[] memory result = new Campaign[](count);

        for (uint256 i = 0; i < count; i++) {
            result[i] = campaigns[campaignIds[i]];
        }

        return result;
    }

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
