//import
//main function
//call main function

//in Hardhat
// function deployFunc() {
//     console.log("Hi!")
// }

// module.exports.default = deployFunc

//use annoynumous function

// module.exports = async (hre) => {
//     const{getNamedAccounts, deployments} = hre //pull getNamedAccounts and deployments from HRE. similar as hre.getNamedAccounts and hre.deployments
// }

//same as above

const { networkConfig, developmentChains } = require("../helper-hardhat-config")
//similar to below
// const helperConfig = = require("../helper-hardhat-config")
// const networkConfig = helperConfig.networkConfig

const { network } = require("hardhat")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments //deploy and log functions from deployments object
    const { deployer } = await getNamedAccounts() //get deployer account from getNamedAccounts function.
    const chainId = network.config.chainId

    // const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    let ethUsdPriceFeedAddress

    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    //contract don't exist we deploy a minimal version

    //when going for localhost or hardhat network we want to use a mock
    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args, //put Price feed address
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        //then verify
        await verify(fundMe.address, args)
    }

    log(
        "---------------------------------------------------------------------------"
    )
}

module.exports.tags = ["all", "fundme"]
