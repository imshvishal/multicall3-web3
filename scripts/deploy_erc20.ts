import hre, { ethers } from "hardhat";
import fs from "fs";

async function main() {
	const [owner] = await ethers.getSigners();
	const Token = await ethers.getContractFactory("ERC20Token");
	let token = await Token.deploy(ethers.parseEther("100000"));
	await token.waitForDeployment();
	console.log("✅ Token deployed to:", token.target);
	fs.mkdirSync("deployments", { recursive: true });
	fs.writeFileSync(`deployments/${hre.network.name}.erc20.json`, JSON.stringify({ TokenAddr: token.target, Owner: owner.address }, null, 2));
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
