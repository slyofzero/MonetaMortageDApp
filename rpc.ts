import { ethers } from "ethers";
import Web3 from "web3";

export const provider = new ethers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_RPC_URL
);
export const web3: Web3 = new Web3(process.env.NEXT_PUBLIC_RPC_URL);
