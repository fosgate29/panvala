const ethers = require('ethers');

const { voting } = require('../../packages/panvala-utils');
const { SlateCategories: categories, ContestStatus } = voting;

const { getContracts } = require('../utils/eth');

const mnemonic = process.env.MNEMONIC;


const categoryName = {
  '0': 'GRANT',
  '1': 'GOVERNANCE',
};

async function tally(gatekeeper, ballotID, categoryID) {
  console.log(`Processing category ${categoryName[categoryID]}`);

  let status = await gatekeeper.functions.contestStatus(ballotID, categoryID);
  // console.log('status', status);

  if (status === ContestStatus.Started) {
    console.log('counting votes');
    await gatekeeper.functions.countVotes(ballotID, categoryID);

    status = await gatekeeper.functions.contestStatus(ballotID, categoryID);
    // console.log('status', status);
  }

  if (status === ContestStatus.RunoffPending) {
    await gatekeeper.functions.countRunoffVotes(ballotID, categoryID);
  }
}


async function run() {
  const { gatekeeper: ROGatekeeper } = getContracts();
  const provider = ROGatekeeper.provider;
  const mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);
  const wallet = new ethers.Wallet(mnemonicWallet.privateKey, provider);


  // get the contract interface for the Gatekeeper
  const gatekeeper = ROGatekeeper.connect(wallet);
  console.log('gatekeeper', gatekeeper.address);

  // TODO: pass in the batch number or get from the contract
  const batchNumber = '1';
  const contests = [categories.GRANT, categories.GOVERNANCE];

  try {
    console.log('Tallying votes for all categories...');
    const tallyAllCategories = contests.map(contest => tally(gatekeeper, batchNumber, contest));
    await tallyAllCategories;
    console.log('DONE');
  } catch (error) {
    console.error(error);
  }
}


run();
