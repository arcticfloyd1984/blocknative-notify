const Notify = require('bnc-notify');
var Tx = require('ethereumjs-tx').Transaction;
const Web3 = require('web3');
const web3 = new Web3('https://rinkeby.infura.io/v3/0c9ee86cdadf410abb4d6eb1f134a97b');

const account1 = '0xc180F90Ff4bc68E9Af90a5F933eE08dee3d50C99';
const account2 = '0xA880b18574e51d6A56486F6Dce28ef91a8A9a778';
const privateKey1 = Buffer.from(process.env.PRIVATE_KEY_1, 'hex');

var notify = Notify({
  dappId: '5faf9ea3-b2d4-4123-84f8-1dc3014acf92',       
  networkId: 4
});

function getBalance(account){
	web3.eth.getBalance(account, (err, bal) => {
		console.log(web3.utils.fromWei(bal, 'ether'));
	})
}

function sendSignedTransactionViaWeb3(account1, account2, privateKey1) {
	web3.eth.getTransactionCount(account1, (err, txCount) => {

		// Build the transaction
		const txObject = {
			nonce: web3.utils.toHex(txCount),
			to: account2,
			value: web3.utils.toHex(web3.utils.toWei('0.5', 'ether')),
			gasLimit: web3.utils.toHex(21000),
			gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei'))
		}

		// Sign the transaction
		const tx = new Tx(txObject, {'chain': 'rinkeby'});
		tx.sign(privateKey1);
		const serializedTransaction = tx.serialize();
		const raw = '0x' + serializedTransaction.toString('hex');

		// Broadcast the transaction
		web3.eth.sendSignedTransaction(raw).on('transactionHash', console.log);

	})
}

// getBalance(account1);
// sendSignedTransactionViaWeb3(account1, account2, privateKey1);
// getBalance(account2);






