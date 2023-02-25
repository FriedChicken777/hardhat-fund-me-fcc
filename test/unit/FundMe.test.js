const { assert } = require("chai") //import assert object from chai
const { deployments, ethers, getNamedAccounts } = require("hardhat") //get deployment object from hardhat to

describe("FundMe", function () {
    let fundMe
    let deployer
    let mockV3Aggregator

    beforeEach(async function () {
        //deploy our fundMe contract using Hardhat-deploy
        //const accounts = await ethers.getSigners() //return accounts in the network section of hardhat.config

        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        //fundMe = await ethers.getContract("FundMe", deployer)
        fundMe = await ethers.getContract("FundMe", deployer)
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        )
    })

    describe("constructor", async function () {
        it("set the aggregator addresses correctly", async function () {
            const response = await fundMe.priceFeed()
            assert.equal(response, mockV3Aggregator.address)
        })
    })
})
