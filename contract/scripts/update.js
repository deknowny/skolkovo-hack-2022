const {We} = require('@wavesenterprise/sdk');
const {TRANSACTIONS} = require('@wavesenterprise/transactions-factory');
const {Keypair} = require("@wavesenterprise/signer");

const SEED = 'cube craft word category chat wine fault high series more mule absorb bracket marine correct'
const NODE_URL = 'http://localhost/node-0';
const sdk = new We(NODE_URL);

const CONTRACT_ID = '4GY5aEqafwqq5WPxdr5Kgx2Mw2RjvoVt95eQuF4EbsTm'

async function create() {
    const config = await sdk.node.config()
    const fee = config.minimumFee[104]

    const keypair = await Keypair.fromExistingSeedPhrase(SEED);

    const tx = TRANSACTIONS.CallContract.V5({
        fee: fee,
        contractId: CONTRACT_ID,
        contractVersion: 1,
        payments: [],
        imageHash: '7cab813ab691e7a09c5aa3b0fcfb5e787fcd688a0e9a755ba8fd13dc83dc5ae1',
        image: 'registry.hub.docker.com/binaryarchaism/test-contract_v2:latest',
        validationPolicy: {type: "any"},
        senderPublicKey: await keypair.publicKey(),
        contractName: 'TestContractV2',
        apiVersion: '1.0',
        params: [{
            key: 'action',
            type: 'string',
            value: 'addState'
        },
            {
            key: 'info',
            type: 'string',
            value: 'kek-test'
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