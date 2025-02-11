import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const PRIVATE_KEYS = [
	process.env.OWNER_PRIVATE_KEY,
	process.env.USER1_PRIVATE_KEY,
	process.env.USER2_PRIVATE_KEY,
	process.env.USER3_PRIVATE_KEY,
] as string[];

const config: HardhatUserConfig = {
	solidity: "0.8.28",
	networks: {
		thunder: {
			url: "https://rpc.testnet.5ire.network",
			chainId: 997,
			accounts: PRIVATE_KEYS,
		},
		holesky: {
			url: "https://holesky.infura.io/v3/685b0bc877194e65bca1746a31e088ab",
			accounts: PRIVATE_KEYS,
		},
		amoy: {
			url: "https://rpc-amoy.polygon.technology/",
			chainId: 80002,
			accounts: PRIVATE_KEYS,
		},
	},
};

export default config;
