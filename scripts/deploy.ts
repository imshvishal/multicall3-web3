import hre, { ethers } from "hardhat";
import fs from "fs";

async function main() {
	const [owner] = await ethers.getSigners();
	const Muticall = await ethers.getContractFactory("Multicall3");
	const Token = await ethers.getContractFactory("ERC20Token");
	let multicall = await Muticall.deploy();
	let token = await Token.deploy(1000000);
	await multicall.waitForDeployment();
	await token.waitForDeployment();
	console.log("✅ Multicall deployed to:", multicall.target);
	console.log("✅ Token deployed to:", token.target);
	fs.mkdirSync("deployments", { recursive: true });
	fs.writeFileSync(
		`deployments/${hre.network.name}.json`,
		JSON.stringify({ MulticallAddr: multicall.target, TokenAddr: token.target, Owner: owner.address }, null, 2)
	);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
