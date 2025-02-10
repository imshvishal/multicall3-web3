// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

contract Multicall3 {
    struct CallData {
        address target;
        bytes callData;
    }

    struct Result {
        bool success;
        bytes returnData;
    }

    function _callCallData(address target, bytes calldata callData)
        public
        returns (bool success, bytes memory returnData)
    {
        return target.call(callData);
    }

    function aggregate3(CallData[] calldata calls) payable external returns (Result[] memory results) {
        results = new Result[](calls.length);
        for (uint256 i = 0; i < calls.length; i++) {
            Result memory result = Result({success: false, returnData: new bytes(0)});
            (result.success, result.returnData) = _callCallData(calls[i].target, calls[i].callData);
            require(result.success, "Multicall: call failed");
            results[i] = result;
        }
    }
}
