import hre, { ethers } from "hardhat";
import fs from "fs";

async function main() {
	const [owner] = await ethers.getSigners();
	const Muticall = await ethers.getContractFactory("Multicall3");
	let multicall = await Muticall.deploy();
	await multicall.waitForDeployment();
	console.log("✅ Multicall deployed to:", multicall.target);
	fs.mkdirSync("deployments", { recursive: true });
	fs.writeFileSync(
		`deployments/${hre.network.name}.multicall.json`,
		JSON.stringify({ MulticallAddr: multicall.target, Owner: owner.address }, null, 2)
	);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
