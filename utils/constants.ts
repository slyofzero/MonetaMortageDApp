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

export interface ICollateralTokensList {
  [key: string]: TokenInfo;
}
export const collateralTokensList: ICollateralTokensList = {
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
  "0x82d36570842fc1aC2a3B4DbE0e7c5c0e2E665090": {
    name: "nfinityAI",
    symbol: "NFNT",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/slyofzero/MonetaTokensList/main/assets/NFNT.webp",
  },
  "0xe9eccde9d26fcbb5e93f536cfc4510a7f46274f8": {
    name: "infraX",
    symbol: "INFRA",
    decimals: 9,
    logoURI:
      "https://raw.githubusercontent.com/slyofzero/MonetaTokensList/main/assets/INFRA.webp",
  },
  "0xc668695dcbCf682dE106Da94bDE65c9bc79362d3": {
    name: "Shadow Node",
    symbol: "SVPN",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/slyofzero/MonetaTokensList/main/assets/SVPN.webp",
  },
  "0x974D796E0Bea47038f39C3F98b1aA2c5240b5495": {
    name: "EaveAI",
    symbol: "EAVE",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/slyofzero/MonetaTokensList/main/assets/EAVE.webp",
  },
  "0x5138EBe7acaAE209d6F0B651E4D02a67EF61f436": {
    name: "Graffiti",
    symbol: "GRAF",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/slyofzero/MonetaTokensList/main/assets/GRAF.webp",
  },
  "0xbec771d15f7e67bc0bb4571c7eb409228cc6fef9": {
    name: "BribeAI",
    symbol: "BRAI",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/slyofzero/MonetaTokensList/main/assets/BRAI.webp",
  },
  "0x922D8563631B03C2c4cf817f4d18f6883AbA0109": {
    name: "Houdini Swap",
    symbol: "LOCK",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/slyofzero/MonetaTokensList/main/assets/LOCK.webp",
  },
  "0xa00453052A36D43A99Ac1ca145DFe4A952cA33B8": {
    name: "Cate",
    symbol: "CATE",
    decimals: 9,
    logoURI:
      "https://raw.githubusercontent.com/slyofzero/MonetaTokensList/main/assets/CATE.webp",
  },
  "0xed1aecc815c00073ba6707b1cd4bd7f833da7a38": {
    name: "Intel X",
    symbol: "INTX",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/slyofzero/MonetaTokensList/main/assets/INTX.webp",
  },
  "0x3f57c35633cb29834bb7577ba8052eab90f52a02": {
    name: "Defender Bot",
    symbol: "DFNDR",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/slyofzero/MonetaTokensList/main/assets/DFNDR.webp",
  },
  "0x92f419fb7a750aed295b0ddf536276bf5a40124f": {
    name: "Taτsu",
    symbol: "TATSU",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/slyofzero/MonetaTokensList/main/assets/TATSU.webp",
  },
  "0x41d06390b935356b46ad6750bda30148ad2044a4": {
    name: "Husby",
    symbol: "HUSBY",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/slyofzero/MonetaTokensList/main/assets/HUSBY.webp",
  },
  "0x516D339afA72f6959b8E06a31FBc32Da3E49348B": {
    name: "Connect",
    symbol: "CNCT",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/slyofzero/MonetaTokensList/main/assets/CNCT.webp",
  },
  "0x24EdDeD3f03abb2e9D047464294133378bddB596": {
    name: "Sect Bot",
    symbol: "SECT",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/slyofzero/MonetaTokensList/main/assets/SECT.jpg",
  },
  "0x0aa8a7d1fb4c64b3b1dcea9a7ade81c59c25b95b": {
    name: "AstraAI",
    symbol: "ASTRA",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/slyofzero/MonetaTokensList/main/assets/ASTRA.webp",
  },
  "0x5da151b95657e788076d04d56234bd93e409cb09": {
    name: "OTSea",
    symbol: "OTSea",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/slyofzero/MonetaTokensList/main/assets/OTSea.webp",
  },
  "0x80122c6a83c8202ea365233363d3f4837d13e888": {
    name: "Messier",
    symbol: "M87",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/slyofzero/MonetaTokensList/main/assets/M87.webp",
  },
  "0xcb76314c2540199f4b844d4ebbc7998c604880ca": {
    name: "Strawberry AI",
    symbol: "BERRY",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/slyofzero/MonetaTokensList/main/assets/BERRY.webp",
  },
  "0xE1C8d908f0e495Cf6D8459547d1d28B72bF04bf2": {
    name: "TesseractAI",
    symbol: "TSAI",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/slyofzero/MonetaTokensList/main/assets/TSAI.webp",
  },
  "0x048d07bd350ba516b84587e147284881b593eb86": {
    name: "Synk",
    symbol: "SYNC",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/slyofzero/MonetaTokensList/main/assets/SYNC.webp",
  },
  "0x289ff00235d2b98b0145ff5d4435d3e92f9540a6": {
    name: "Book of Ethereum",
    symbol: "BODE",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/slyofzero/MonetaTokensList/main/assets/BODE.webp",
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
