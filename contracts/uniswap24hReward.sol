// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract uniswap24hReward is ERC721 {

    uint256 private ticketCounter;

    event RewardNftMinted(uint256 indexed tokenId, address Recipient);

    constructor() ERC721("uniswap24hReward", "UNIR") {
        ticketCounter = 1;
    }

    function mintRewardNft() external {
        _mint(msg.sender, ticketCounter);
        emit RewardNftMinted(ticketCounter, msg.sender);

        ticketCounter++;
    }
}