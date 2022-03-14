var TDErc20 = artifacts.require("ERC20TD.sol");
var ERC20Claimable = artifacts.require("ERC20Claimable.sol");
var evaluator = artifacts.require("Evaluator.sol");
var exerciceSolution = artifacts.require("ExerciceSolution.sol");
var exerciceSolutionToken = artifacts.require("ExerciceSolutionToken.sol");

module.exports = (deployer, network, accounts) => {
  deployer.then(async () => {
    await deployTDToken(deployer, network, accounts);
    await deployEvaluator(deployer, network, accounts);
    await setPermissionsAndRandomValues(deployer, network, accounts);
    await deployRecap(deployer, network, accounts);
    await DoTd(deployer, network, accounts);
  });
};

async function deployTDToken(deployer, network, accounts) {
  TDToken = await TDErc20.new(
    "TD-ERC20-101",
    "TD-ERC20-101",
    web3.utils.toBN("20000000000000000000000000000")
  );
  ClaimableToken = await ERC20Claimable.new(
    "ClaimableToken",
    "CLTK",
    web3.utils.toBN("20000000000000000000000000000")
  );
}

async function deployEvaluator(deployer, network, accounts) {
  Evaluator = await evaluator.new(TDToken.address, ClaimableToken.address);
}

async function setPermissionsAndRandomValues(deployer, network, accounts) {
  await TDToken.setTeacher(Evaluator.address, true);
}

async function deployRecap(deployer, network, accounts) {
  console.log("TDToken " + TDToken.address);
  console.log("ClaimableToken " + ClaimableToken.address);
  console.log("Evaluator " + Evaluator.address);
}
//take another address from the deploy's address
account = "0x88E95624f03251970501Da6e3fA6f93F93B06890";

async function deployExerciceSolution(deployer, network, accounts) {
  ExerciceSolutionToken = await exerciceSolutionToken.new();
  ExerciceSolution = await exerciceSolution.new(
    ClaimableToken.address,
    ExerciceSolutionToken.address
  );
}

async function getBalanceTdToken(deployer, network, accounts) {
  let Balance = await TDToken.balanceOf(account);
  console.log(" Balance : " + Balance);
}

async function DoTd(deployer, network, accounts) {
  console.log("-------DoTd-------");

  await getBalanceTdToken(deployer, network, accounts);

  await deployExerciceSolution(deployer, network, accounts);
  console.log("ExerciceSolution " + ExerciceSolution.address);

  console.log("-------submitExercice---------");
  await Evaluator.submitExercice(ExerciceSolution.address, {
    from: account,
  });
  await getBalanceTdToken(deployer, network, accounts);

  console.log("-------Exercice1---------");
  await ClaimableToken.claimTokens({ from: account });
  await Evaluator.ex1_claimedPoints({ from: account });
  await getBalanceTdToken(deployer, network, accounts);

  console.log("-------Exercice2---------");
  await Evaluator.ex2_claimedFromContract({ from: account, gas: 800000 });
  await getBalanceTdToken(deployer, network, accounts);

  console.log("-------Exercice3---------");
  await Evaluator.ex3_withdrawFromContract({ from: account });
  await getBalanceTdToken(deployer, network, accounts);

  console.log("-------Exercice4---------");
  await ClaimableToken.approve(ExerciceSolution.address, 555555555, {
    from: account,
  });
  await Evaluator.ex4_approvedExerciceSolution({ from: account });
  await getBalanceTdToken(deployer, network, accounts);

  console.log("-------Exercice5---------");
  await ClaimableToken.approve(ExerciceSolution.address, 0, {
    from: account,
  });
  await Evaluator.ex5_revokedExerciceSolution({ from: account });
  await getBalanceTdToken(deployer, network, accounts);

  console.log("-------Exercice6---------");
  await Evaluator.ex6_depositTokens({ from: account });
  await getBalanceTdToken(deployer, network, accounts);

  console.log("-------Exercice7---------");
  // await Evaluator.ex7_createERC20({ from: account });
  await getBalanceTdToken(deployer, network, accounts);
}
