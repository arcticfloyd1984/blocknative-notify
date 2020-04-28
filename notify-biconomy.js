const BlocknativeSDK = require('bnc-sdk');
var Tx = require('ethereumjs-tx').Transaction;
const WebSocket = require('ws');
const Web3 = require('web3');
const web3 = new Web3('https://rinkeby.infura.io/v3/0c9ee86cdadf410abb4d6eb1f134a97b');

const account1 = '0xc180F90Ff4bc68E9Af90a5F933eE08dee3d50C99';
const account2 = '0xA880b18574e51d6A56486F6Dce28ef91a8A9a778';
const privateKey1 = Buffer.from(process.env.PRIVATE_KEY_1, 'hex');


// options object that contains necessary information to create the blocknative object
const options = {
  dappId: '5faf9ea3-b2d4-4123-84f8-1dc3014acf92',       
  networkId: 4,
  transactionHandlers: [event => console.log(event.transaction)],
  ws: WebSocket,
  name: 'Instance 1'
}

// Blocknative object creation using the BlocknativeSDK
const blocknative = new BlocknativeSDK(options);


// Function to check balance of an account
function getBalance(account){
	web3.eth.getBalance(account, (err, bal) => {
		console.log(web3.utils.fromWei(bal, 'ether'));
	})
}



// Function to send signed transaction via Web3.js
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
		web3.eth.sendSignedTransaction(raw).on('transactionHash', (transactionHash) => {
			console.log(transactionHash);

			// Destructure the object to get the emitter. The emitter is corresponding to a particular transaction hash
			const { emitter } = blocknative.transaction(transactionHash);

			// Emitter listens to 'all' types of events related to a transaction hash
			emitter.on('all', transaction => {
				console.log(transaction);
			})
		});

	})
}


// function to monitor all types of trnasactions corresponding a particular function
function monitorAccount(account) {
	const { emitter, details } = blocknative.account(account);

	emitter.on('all', transaction => {
		console.log(transaction);
	})
}

// getBalance(account1);
// sendSignedTransactionViaWeb3(account1, account2, privateKey1);
// getBalance(account2);
monitorAccount(account1);






