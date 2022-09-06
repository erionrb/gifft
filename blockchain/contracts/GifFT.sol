// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title GifFT NFT Contract
 * @notice The base contract to create gifts as NFT
 */
contract GifFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("GifFT", "GIFFT") {}

    modifier onlyGiftOwner(uint256 _tokenId) {
        require(
            super.ownerOf(_tokenId) == msg.sender,
            "You are not the owner of this GifFT Token"
        );
        _;
    }

    /**
     * @dev Mint a new token to the contract.
     */
    function sendGift(address _recipient, string memory _tokenURI)
        public
        returns (uint256)
    {
        uint256 newGiftId = _tokenIds.current();
        _mint(_recipient, newGiftId);
        _setTokenURI(newGiftId, _tokenURI);

        _tokenIds.increment();
        return newGiftId;
    }

    /**
     * @dev Returns the tokenURI of the token id, if the sender is the owner of the token.
     * @notice It is a must that only the sender can get his token uri for security.
     */
    function tokenURI(uint256 _gifFTId)
        public
        view
        override
        onlyGiftOwner(_gifFTId)
        returns (string memory)
    {
        return super.tokenURI(_gifFTId);
    }
}
