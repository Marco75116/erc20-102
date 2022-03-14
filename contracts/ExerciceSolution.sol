pragma solidity ^0.6.0;

import "./ERC20Claimable.sol";
import "./ExerciceSolutionToken.sol";

contract ExerciceSolution {
    ERC20Claimable claimableERC20;
    ExerciceSolutionToken exerciceSolutionToken;
    mapping(address => uint256) PersonnalAmountToken;

    constructor(
        ERC20Claimable _claimableERC20,
        ExerciceSolutionToken _exerciceSolutionToken
    ) public {
        exerciceSolutionToken = _exerciceSolutionToken;
        claimableERC20 = _claimableERC20;
        // exerciceSolutionToken.setMinter(address(this), true);
    }

    function claimTokensOnBehalf() external {
        claimableERC20.claimTokens();
        PersonnalAmountToken[msg.sender] += claimableERC20.distributedAmount();
    }

    function tokensInCustody(address callerAddress) external returns (uint256) {
        return PersonnalAmountToken[callerAddress];
    }

    function withdrawTokens(uint256 amountToWithdraw)
        external
        returns (uint256)
    {
        require(
            PersonnalAmountToken[msg.sender] >= amountToWithdraw,
            "You don't have enougth token in this contract"
        );
        claimableERC20.transfer(msg.sender, amountToWithdraw);
        PersonnalAmountToken[msg.sender] -= amountToWithdraw;
        return 1;
    }

    function depositTokens(uint256 amountToWithdraw)
        external
        returns (uint256)
    {
        claimableERC20.transferFrom(
            msg.sender,
            address(this),
            amountToWithdraw
        );
        PersonnalAmountToken[msg.sender] += amountToWithdraw;
    }

    function getERC20DepositAddress() external returns (address) {
        return address(exerciceSolutionToken);
    }
}
