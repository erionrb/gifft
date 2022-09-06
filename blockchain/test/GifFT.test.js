const { expect } = require("chai");
const { ethers } = require("hardhat");

const errorEvaluation = (_error, _expectedError) =>
    ("" + _error).includes(_expectedError);

describe("GifFT", () => {
    let owner, recipient1, recipient2, nftContract;

    const tokenURI = "http://gifft.co/95867487564876548754.json";

    before("Test Starting...", async () => {
        const GifFT = await ethers.getContractFactory("GifFT");
        [owner, recipient1, recipient2] = await ethers.getSigners();

        nftContract = await GifFT.deploy();
    });

    describe("Deployment", () => {
        it("Should track name and symbol of the NFT Contract", async () => {
            expect(await nftContract.name()).to.equal("GifFT");
            expect(await nftContract.symbol()).to.equal("GIFFT");
        });
    });

    describe("Minting NFTs", () => {
        it("Should mint NFT to recipient1", async () => {
            await nftContract.connect(recipient2).sendGift(recipient1.address, tokenURI);
            expect(await nftContract.balanceOf(recipient1.address)).to.equal(1);
        });

        it("Should not have minted NFT to recipient2", async () => {
            expect(await nftContract.balanceOf(recipient2.address)).to.equal(0);
        });

        it("Should mint NFT to recipient2", async () => {
            await nftContract.connect(recipient1).sendGift(recipient2.address, tokenURI);
            expect(await nftContract.balanceOf(recipient2.address)).to.equal(1);
        });

        it("Should not get tokenURI for recipient1", async () => {
            const tokenId = 0;
            const expectedError = "You are not the owner of this GifFT Token";

            await nftContract.connect(recipient2)
                .tokenURI(tokenId)
                .then(
                    (result) => { },
                    (error) => expect(errorEvaluation(error, expectedError)).to.equal(true)
                );
        });

        it("Should not get tokenURI for recipient2", async () => {
            const tokenId = 1;
            const expectedError = "You are not the owner of this GifFT Token";

            await nftContract.connect(recipient1)
                .tokenURI(tokenId)
                .then(
                    (result) => { },
                    (error) => expect(errorEvaluation(error, expectedError)).to.equal(true)
                );
        });

        it("Should get tokenURI for recipient1", async () => {
            const tokenId = 0;

            const _tokenURI = await nftContract.connect(recipient1).tokenURI(tokenId);
            expect(_tokenURI).to.equal(tokenURI);
        });

        it("Should get tokenURI for recipient2", async () => {
            const tokenId = 1;

            const _tokenURI = await nftContract.connect(recipient2).tokenURI(tokenId);
            expect(_tokenURI).to.equal(tokenURI);
        });
    });
});
