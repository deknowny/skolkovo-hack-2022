const {We} = require('@wavesenterprise/sdk');
const {TRANSACTIONS} = require('@wavesenterprise/transactions-factory');
const {Keypair} = require("@wavesenterprise/signer");

//local
// const SEED = 'cube craft word category chat wine fault high series more mule absorb bracket marine correct'
const SEED = 'purse pave impact cement soon motion client reveal combine myth believe price check monkey primary'

// const NODE_URL = 'http://localhost/node-0';
const NODE_URL = 'https://hackathon.welocal.dev/node-0';

const sdk = new We(NODE_URL);

const CONTRACT_ID = 'HUmCLhrvZdWqc35wWqybY86GouQBiseh56iG9RNCKJzP'

async function create() {
    const config = await sdk.node.config()
    const fee = config.minimumFee[104]

    const keypair = await Keypair.fromExistingSeedPhrase(SEED);

    const tx = TRANSACTIONS.CallContract.V5({
        fee: fee,
        contractId: CONTRACT_ID,
        contractVersion: 1,
        payments: [],
        validationPolicy: {type: "any"},
        senderPublicKey: await keypair.publicKey(),
        params: [{
            key: 'action',
            type: 'string',
            value: 'SwapSynth'
        }, {
            key: 'token1_address',
            type: 'string',
            value: 'D4PxpXPQcEm3hTg2YMQHPL9BkDhojTPDBJ7sjh2eYBWy'
        }, {
            key: 'amount_of_token1',
            type: 'string',
            value: '1'
        }, {
            key: 'token2_address',
            type: 'string',
            value: '36WnBs8Usf2UuZVbKDRVo8RMrB9s1dYZNeBSj4ATZLir'
        }],
    })

    const signedTx = await sdk.signer.getSignedTx(tx, SEED);

    const res = await sdk.broadcast(signedTx);


    console.log(res)

}

create()
    .then(() => {
        console.log('Successfully executed')
    })
    .catch(console.error)