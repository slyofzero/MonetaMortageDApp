import { web3 } from "@/rpc";
import { erc20Abi } from "./constants";
import { ethers } from "ethers";

export async function getTokenBalance(
  address: string,
  token: string
): Promise<number> {
  try {
    const contract = new web3.eth.Contract(erc20Abi, token);
    const balance = (await contract.methods
      .balanceOf(address)
      .call()) as bigint;

    const decimals = (await contract.methods.decimals().call()) as bigint;
    const tokenBalance = balance / 10n ** decimals;

    return Number(tokenBalance);
  } catch (error) {
    return 0;
  }
}

export async function getEthBalance(address: string): Promise<number> {
  try {
    const weiBalance = await web3.eth.getBalance(address);
    const ethBalance = Number(
      parseFloat(Number(ethers.formatEther(weiBalance)).toFixed(6))
    );
    return ethBalance;
  } catch (error) {
    return 0;
  }
}
