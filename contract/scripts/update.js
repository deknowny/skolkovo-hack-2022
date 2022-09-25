const {We} = require('@wavesenterprise/sdk');
const {TRANSACTIONS} = require('@wavesenterprise/transactions-factory');
const {Keypair} = require("@wavesenterprise/signer");

const SEED = 'cube craft word category chat wine fault high series more mule absorb bracket marine correct'
const NODE_URL = 'http://localhost/node-0';
const sdk = new We(NODE_URL);

const CONTRACT_ID = 'BSwUo4CyganahycaHiMcq9zKueGFvgH3DA92GXUW1f6c'

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
        contractName: 'SyndexContractTestV2',
        apiVersion: '1.0',
        params: [{
            key: 'action',
            type: 'string',
            value: 'SetWEastPrice'
        }, {
            key: 'west_price',
            type: 'string',
            value: '100'
        }, {
            key: 'east_price',
            type: 'string',
            value: '1'
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