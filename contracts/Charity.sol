// SPDX-License-Identifier: MIT
pragma solidity >0.8.0 <0.9.0;

contract Charity {
    address payable private owner;
    struct Donor {
        string fullName;
        uint amount;
    }
    mapping (address => Donor[]) public donors;

    constructor(address _owner) {
        owner = payable(_owner);
    }

    function donate(string memory _fullName) public payable{
        require(msg.value > 0, "No money sent");
        donors[msg.sender].push(Donor(_fullName, msg.value));
        (bool success,) = owner.call{value: msg.value}("");
        require(success, "Transfer failed");
    }
}