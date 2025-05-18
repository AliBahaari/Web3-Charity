// SPDX-License-Identifier: MIT
pragma solidity >0.8.0 <0.9.0;

contract Charity {
    address payable public owner = payable(0xA7bB896ca8099FB385FF312b0c06E5714FeA2667);
    struct Donor {
        string fullName;
        uint amount;
    }
    mapping (address => Donor) public donors;

    function donate(string memory _fullName) public payable{
        require(msg.value > 0, "No money sent");
        donors[msg.sender] = Donor(_fullName, msg.value);
        (bool success,) = owner.call{value: msg.value}("");
        require(success, "Transfer failed");
    }
}