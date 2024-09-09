import { TokenInfo } from "@/types";

export const firebaseCollectionPrefix = "_moneta";
export const JWTKeyName = "moneta-mortgage";
export const monetaCA = "0x5b342F03D126314d925Fa57A45654f92905e6451";
export const goldEligibleThreshold = 0.2;
export const vaultMinimumBalance = 0.1;
export const platformCharge = 0.05;

export const erc20Abi = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_spender",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_from",
        type: "address",
      },
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [
      {
        name: "",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
      {
        name: "_spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    payable: true,
    stateMutability: "payable",
    type: "fallback",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
];

export const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
export const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
export const loanPercentage = 0.4;
export const pastDuePenalty = 5;

export const collateralTokensList: { [key: string]: TokenInfo } = {
  "0x5b342F03D126314d925Fa57A45654f92905e6451": {
    name: "Moneta",
    symbol: "MNTA",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/slyofzero/MonetaTokensList/main/assets/0x5b342f03d126314d925fa57a45654f92905e6451.webp",
  },
  "0xb39A0Dae3C2aFd1F3C55AD47D1c7A0Bb6C1CA260": {
    name: "UNREAL AI",
    symbol: "UNREAL",
    decimals: 9,
    logoURI:
      "https://raw.githubusercontent.com/slyofzero/MonetaTokensList/main/assets/Unreal.webp",
  },
  "0xba00357fd9348da1adbae9b2867b6b596eba4f24": {
    name: "LaunchR",
    symbol: "LCR",
    decimals: 9,
    logoURI:
      "https://raw.githubusercontent.com/slyofzero/MonetaTokensList/main/assets/LCR.webp",
  },
  "0x38E68A37E401F7271568CecaAc63c6B1e19130B4": {
    name: "Banana",
    symbol: "BANANA",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/slyofzero/MonetaTokensList/main/assets/Banana.webp",
  },
  "0x6019Dcb2d0b3E0d1D8B0cE8D16191b3A4f93703d": {
    name: "QuantumFusion",
    symbol: "QF",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/slyofzero/MonetaTokensList/main/assets/QF.webp",
  },
  "0x14feE680690900BA0ccCfC76AD70Fd1b95D10e16": {
    name: "PAAL AI",
    symbol: "PAAL",
    decimals: 9,
    logoURI:
      "https://raw.githubusercontent.com/slyofzero/MonetaTokensList/main/assets/PAAL.webp",
  },
  "0xc0CfBe1602dD586349f60e4681bf4BADCA584eC9": {
    name: "Etheism",
    symbol: "E",
    decimals: 9,
    logoURI:
      "https://raw.githubusercontent.com/slyofzero/MonetaTokensList/main/assets/E.webp",
  },
  "0xee2a03aa6dacf51c18679c516ad5283d8e7c2637": {
    name: "Neiro",
    symbol: "NEIRO",
    decimals: 9,
    logoURI:
      "https://raw.githubusercontent.com/slyofzero/MonetaTokensList/main/assets/Neiro.webp",
  },
  "0x1121acc14c63f3c872bfca497d10926a6098aac5": {
    name: "Department Of Government Efficiency",
    symbol: "DOGE",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/slyofzero/MonetaTokensList/main/assets/DOGE.webp",
  },
  "0x423f4e6138e475d85cf7ea071ac92097ed631eea": {
    name: "Pond Coin",
    symbol: "PNDC",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/slyofzero/MonetaTokensList/main/assets/PNDC.webp",
  },
  "0x872ced6dc80f0e556948444d4749decd39aa86de": {
    name: "SunWukong",
    symbol: "SunWukong",
    decimals: 9,
    logoURI:
      "https://raw.githubusercontent.com/slyofzero/MonetaTokensList/main/assets/empty-token.webp",
  },
  "0x6982508145454ce325ddbe47a25d4ec3d2311933": {
    name: "Pepe",
    symbol: "PEPE",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/slyofzero/MonetaTokensList/main/assets/PEPE.webp",
  },
  "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce": {
    name: "SHIBA INU",
    symbol: "SHIB",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/slyofzero/MonetaTokensList/main/assets/SHIB.webp",
  },
};

export const tokensList: { [key: string]: TokenInfo } = {
  "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2": {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
  },
  ...collateralTokensList,
};
