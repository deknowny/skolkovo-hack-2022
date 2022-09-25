const {We} = require('@wavesenterprise/sdk');
const {TRANSACTIONS} = require('@wavesenterprise/transactions-factory');
const {Keypair} = require("@wavesenterprise/signer");

//local
// const SEED = 'cube craft word category chat wine fault high series more mule absorb bracket marine correct'
const SEED = 'purse pave impact cement soon motion client reveal combine myth believe price check monkey primary'

// const NODE_URL = 'http://localhost/node-0';
const NODE_URL = 'https://hackathon.welocal.dev/node-0';

const sdk = new We(NODE_URL);

const CONTRACT_ID = 'GK99AATRvvdNRQdoBJB6fkyS5vK6kGM2dievCzqtbbe7'

async function create() {
    const config = await sdk.node.config()
    const fee = config.minimumFee[104]

    const keypair = await Keypair.fromExistingSeedPhrase(SEED);

    const tx = TRANSACTIONS.CallContract.V5({
        fee: fee,
        contractId: CONTRACT_ID,
        contractVersion: 2,
        payments: [],
        validationPolicy: {type: "any"},
        senderPublicKey: await keypair.publicKey(),
        params: [{
            key: 'action',
            type: 'string',
            value: 'WithdrawCollateral'
        },{
            key: 'amount_of_west',
            type: 'string',
            value: '30000'
        },{
            key: 'amount_of_east',
            type: 'string',
            value: '100000'
        },],
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