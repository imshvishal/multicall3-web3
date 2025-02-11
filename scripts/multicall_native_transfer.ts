import hre, { ethers } from "hardhat";
import fs from "fs";

async function main() {
	const MulticallCtrAddr = process.env.MULTICALL_CONTRACT_ADDR as string;

	const [owner, user1, user2, user3] = await ethers.getSigners();
	const Multicall = await ethers.getContractAt("Multicall3", MulticallCtrAddr);

	console.log("\n🅱️  Before Batch Request: (Balance)");
	console.log("OWNER:", await ethers.provider.getBalance(owner.address));
	console.log("USER1:", await ethers.provider.getBalance(user1.address));
	console.log("USER2:", await ethers.provider.getBalance(user2.address));
	console.log("USER3:", await ethers.provider.getBalance(user3.address));

	// Batch Request (multicall)
	let result = await Multicall.aggregate3Value(
		[
			{
				target: user1.address,
				value: ethers.parseEther("1"),
				allowFailure: false,
				callData: "0x",
			},
			{
				target: user2.address,
				value: ethers.parseEther("2"),
				allowFailure: false,
				callData: "0x",
			},
			{
				target: user3.address,
				value: ethers.parseEther("3"),
				allowFailure: false,
				callData: "0x",
			},
		],
		{ value: ethers.parseEther("6") }
	);
	await result.wait();

	console.log("\n🚀 After Batch Request: (Balance)");
	console.log("OWNER:", await ethers.provider.getBalance(owner.address));
	console.log("USER1:", await ethers.provider.getBalance(user1.address));
	console.log("USER2:", await ethers.provider.getBalance(user2.address));
	console.log("USER3:", await ethers.provider.getBalance(user3.address));
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
