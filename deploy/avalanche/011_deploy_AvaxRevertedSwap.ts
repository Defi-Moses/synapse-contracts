import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { CHAIN_ID } from "../../utils/network"


const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, getChainId } = hre
  const { deploy, get, read, execute, log } = deployments
  const { deployer } = await getNamedAccounts()

  if ((await getChainId()) === CHAIN_ID.AVALANCHE) {
        await deploy("AvaxJewelSwap", {
            from: deployer,
            log: true,
            skipIfAlreadyDeployed: true,
        })
}
}
export default func
func.tags = ["AvaxJewelMigration"]
