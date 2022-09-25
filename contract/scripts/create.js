const {We} = require('@wavesenterprise/sdk');
const {TRANSACTIONS} = require('@wavesenterprise/transactions-factory');
const {Keypair} = require("@wavesenterprise/signer");


// const SEED = 'cube craft word category chat wine fault high series more mule absorb bracket marine correct'
const SEED = 'purse pave impact cement soon motion client reveal combine myth believe price check monkey primary'
// const NODE_URL = 'http://localhost/node-0';
const NODE_URL = 'https://hackathon.welocal.dev/node-0';
const sdk = new We(NODE_URL)

async function create() {
    const config = await sdk.node.config()
    const fee = config.minimumFee[103]

    const keypair = await Keypair.fromExistingSeedPhrase(SEED);

    const tx = TRANSACTIONS.CreateContract.V5({
        fee: fee,
        imageHash: 'cef019761967b2948568c84d449cb6312b428639dfc397ca317ba8e3123dfcc4',
        image: 'registry.hub.docker.com/binaryarchaism/syndex_contact_test_v10:1.0.5',
        validationPolicy: {type: "any"},
        senderPublicKey: await keypair.publicKey(),
        params: [
            {
                key: 'eastAssetId',
                type: 'string',
                value: 'B3FAiTZDY8nBvE7Ztux1outecpUGD5F3z6rzcA5nmd6r'
            }
        ],
        payments: [],
        contractName: 'SyndexContractTestV5',
        apiVersion: '1.0'
    })

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