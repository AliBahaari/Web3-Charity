// SPDX-License-Identifier: MIT
pragma solidity >0.8.0 <0.9.0;

contract Charity {
    address private owner;
    struct Donor {
        string fullName;
        uint amount;
    }
    mapping (address => Donor) public donors;
    event DonationReceived(address donor, string fullName,uint amount);

    constructor() {
        owner = msg.sender;
    }

    function donate(string memory _fullName) public payable{
        require(msg.value > 0, "No money sent");
        donors[msg.sender] = Donor(_fullName, msg.value);
        emit DonationReceived(msg.sender, _fullName, msg.value);
    }
}