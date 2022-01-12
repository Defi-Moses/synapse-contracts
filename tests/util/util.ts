import "@nomiclabs/hardhat-ethers";
import "hardhat-deploy";


import {
    ethers,
} from "hardhat";

import {Done} from "mocha";

import {Contract, ContractReceipt, ContractTransaction} from "@ethersproject/contracts";
import {HardhatRuntimeEnvironment} from "hardhat/types";

export const ZeroAddress: string = "0x0000000000000000000000000000000000000000";

export namespace TestUtils {
    export function doneWithError(err: any, done: Done) {
        let e = err instanceof Error ? err : new Error(err);

        done(e);
    }

    export function catchError(done: Done): (err: any) => void { return (err: any) => doneWithError(err, done); }

    export async function waitForDeployment(name: string, hre: HardhatRuntimeEnvironment): Promise<string> {
        const {deployments} = hre;
        let d = await deployments.get(name);
        const contract = await ethers.getContractAt(name, d.address);

        const deployedContract = await contract.deployed();

        return d.address
    }

    export async function contractInstanceFromDeployment(name: string, hre: HardhatRuntimeEnvironment): Promise<Contract> {
        const
            {deployments: {get}, getNamedAccounts} = hre,
            {deployer} = await getNamedAccounts(),
            {address, abi} = await get(name),
            signer = await ethers.getSigner(deployer);

        return await ethers.getContractAt(abi, address, signer)
    }

    export function waitForConfirmations(confs?: number): (txn: ContractTransaction) => Promise<ContractReceipt> {
        return (txn: ContractTransaction): Promise<ContractReceipt> =>
            txn.wait(confs ?? 1)
                .then((r: ContractReceipt) => r)
    }
}