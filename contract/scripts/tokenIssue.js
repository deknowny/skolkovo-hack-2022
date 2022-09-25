
const {We} = require('@wavesenterprise/sdk');
const {TRANSACTIONS, Byte} = require('@wavesenterprise/transactions-factory');
const {Keypair} = require("@wavesenterprise/signer");


const SEED = 'cube craft word category chat wine fault high series more mule absorb bracket marine correct'
const NODE_URL = 'https://localhost/node-0/';
const sdk = new We(NODE_URL)

async function create() {
    const keypair = await Keypair.fromExistingSeedPhrase(SEED);

    const quantity = 1000000
    const issueBody = {
        name: 'sUSD',
        description: 'syndex USD',
        quantity,
        decimals: 8,
        chainId: 86,
        senderPublicKey: await keypair.publicKey(),
        reissuable: true,
        fee: 100000000,
        timestamp: Date.now(),
        script: null
    }

    const tx = TRANSACTIONS.Issue.V2(issueBody)

    const signedTx = await sdk.signer.getSignedTx(tx, SEED);

    console.log(signedTx.getRawBody())

    const res = await sdk.broadcast(signedTx);

    console.log(res)

}

create()
    .then(() => {
        console.log('Successfully executed')
    })
    .catch(console.error)