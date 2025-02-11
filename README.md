# Using Multicall3 for Batch Requests

## Overview

Multicall3 is a powerful smart contract that allows batching multiple contract calls into a single transaction, reducing gas costs and improving efficiency. This guide demonstrates how to use Multicall3 to:

-   **Batch ERC20 Token Transfers**
-   **Batch Native Token (5ire) Transfers**

## Prerequisites

Before using Multicall3, ensure that you have:

1. **Node.js and npm** installed.
2. **Clone the repository** (`git clone https://github.com/5irelabs/multicall3.git`).
3. **Install Packages** (`npm install`).
4. **Set Environment Variables** for private keys only in `.env` file.
5. **Multicall3 contract deployed** (or use an existing deployment).
    > `npx hardhat run scripts/deploy_multicall_contract.ts --network <network>` or use existing deployment at `0x1b25Ce9eE090f6d74A8b0C08211b7A6163a9c9c5`
6. **Set Environment Variables** for multicall contract address `.env` file.
7. **ERC20 token contract deployed** (for ERC20 batch transactions).
    > `npx hardhat run scripts/deploy_erc20.ts --network <network>`

## 1️⃣ Batch ERC20 Token Transfers [[Script](./scripts/multicall_contract_interaction.ts)]

-   ### Funtion to use `aggregate3`
    This function takes array of **Calls** and the call data consists of following parameters:
    | `param` | `dtype` | `use` |
    | :--- | :--- | :--- |
    | `target` | address | Recepeint contract address where the function is to be called. |
    | `callData` | bytes | Function call data encoded in the form of bytes. |
    | `allowFailure` | bool | If true, call will be skipped if the call fails. |

### **_Running the Script_**

```bash
npx hardhat run scripts/multicall_contract_interaction.ts --network <network>
```

### **Step 1: Approve Multicall Contract**

Before transferring tokens using Multicall3, the sender must approve the contract to spend tokens on their behalf.

```typescript
const Token = await ethers.getContractAt("ERC20Token", TokenAddr);
await Token.approve(MulticallCtrAddr, ethers.parseEther("600"));
```

### **Step 2: Execute Multicall3 Batch Request**

```typescript
const Multicall = await ethers.getContractAt("Multicall3", MulticallCtrAddr);

let result = await Multicall.aggregate3([
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
```

### **Step 3: Verify Balances**

After execution, check token balances to confirm successful transfers.

```typescript
console.log("USER1 BALANCE:", await Token.balanceOf(user1.address));
console.log("USER2 BALANCE:", await Token.balanceOf(user2.address));
console.log("USER3 BALANCE:", await Token.balanceOf(user3.address));
```

---

## 2️⃣ Batch Native Token (5ire) Transfers [[Script](./scripts/multicall_native_transfer.ts)]

-   ### Funtion to use `aggregate3Value`
    This function takes array of **Calls** and the call data consists of following parameters:
    | `param` | `dtype` | `use` |
    | :--- | :--- | :--- |
    | `target` | address | Recepeint contract address where the function is to be called. |
    | `value` | uint256 | Amount of native token to be sent to the target. |
    | `allowFailure` | bool | If true, call will be skipped if the call fails. |
    | `callData` | bytes | Function call data encoded in the form of bytes. Here it will be empty bytes as we are not calling any function.|

### **_Running the Script_**

```bash
npx hardhat run scripts/multicall_native_transfer.ts --network <network>
```

### **Step 1: Execute Transfers Using Multicall3**

```typescript
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
```

### **Step 2: Verify Balances**

After execution, check the new balances.

```typescript
console.log("USER1 BALANCE:", await ethers.provider.getBalance(user1.address));
console.log("USER2 BALANCE:", await ethers.provider.getBalance(user2.address));
console.log("USER3 BALANCE:", await ethers.provider.getBalance(user3.address));
```

---

## 🚀 Conclusion

Using **Multicall3**, you can significantly reduce gas fees and optimize smart contract interactions by batching multiple requests into a single transaction. Whether handling **ERC20 token transfers** or **Native token transfers**, this method ensures faster and more cost-efficient blockchain operations.

### ✅ **Advantages of Multicall3**

-   **Reduces Gas Fees**: Executes multiple operations in a single transaction.
-   **Improves Efficiency**: Allows batching various function calls at once.
-   **Supports Both ERC20 & Native token Transactions**: Can handle token transfers and native asset transfers seamlessly.

📌 **Next Steps:** Experiment with adding more transactions in a single batch or integrate batch calls into your dApps for better performance!
