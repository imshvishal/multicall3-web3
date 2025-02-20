import hre, { ethers } from "hardhat";
import fs from "fs";

async function main() {
	if (!fs.existsSync(`deployments/${hre.network.name}.erc20.json`)) {
		throw new Error(`No deployment file found, run \`npx hardhat run scripts/deploy_erc20.ts --network ${hre.network.name}\` first.`);
	}
	const { TokenAddr, Owner } = JSON.parse(fs.readFileSync(`deployments/${hre.network.name}.erc20.json`).toString());
	const MulticallCtrAddr = process.env.MULTICALL_CONTRACT_ADDR as string;

	const [owner, user1, user2, user3] = await ethers.getSigners();
	const Token = await ethers.getContractAt("ERC20Token", TokenAddr);
	const Multicall = await ethers.getContractAt("Multicall3", MulticallCtrAddr);

	console.log("\n🅱️  Before Batch Request: (Balance)");
	console.log("OWNER:", await Token.balanceOf(owner.address));
	console.log("USER1:", await Token.balanceOf(user1.address));
	console.log("USER2:", await Token.balanceOf(user2.address));
	console.log("USER3:", await Token.balanceOf(user3.address));
	let result = await Token.approve(Multicall.target, ethers.parseEther("600"));
	await result.wait();

	// Batch Request (multicall)
	result = await Multicall.aggregate3([
		{
			target: TokenAddr,
			callData: Token.interface.encodeFunctionData("transferFrom", [Owner, user1.address, ethers.parseEther("100")]),
			allowFailure: false,
		},
		{
			target: TokenAddr,
			callData: Token.interface.encodeFunctionData("transferFrom", [Owner, user2.address, ethers.parseEther("200")]),
			allowFailure: false,
		},
		{
			target: TokenAddr,
			callData: Token.interface.encodeFunctionData("transferFrom", [Owner, user3.address, ethers.parseEther("300")]),
			allowFailure: false,
		},
	]);
	await result.wait();
	console.log("\n🚀 After Batch Request: (Balance)");
	console.log("OWNER:", await Token.balanceOf(owner.address));
	console.log("USER1:", await Token.balanceOf(user1.address));
	console.log("USER2:", await Token.balanceOf(user2.address));
	console.log("USER3:", await Token.balanceOf(user3.address));
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
