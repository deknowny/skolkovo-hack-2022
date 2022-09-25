
const {We} = require('@wavesenterprise/sdk');
const {TRANSACTIONS, Byte} = require('@wavesenterprise/transactions-factory');
const {Keypair} = require("@wavesenterprise/signer");


const SEED = 'purse pave impact cement soon motion client reveal combine myth believe price check monkey primary'
const NODE_URL = 'https://hackathon.welocal.dev/node-0/';
const sdk = new We(NODE_URL)

async function create() {
    const keypair = await Keypair.fromExistingSeedPhrase(SEED);

    const quantity = 1000000000000
    const issueBody = {
        assetId: "B3FAiTZDY8nBvE7Ztux1outecpUGD5F3z6rzcA5nmd6r",
        quantity,
        chainId: 86,
        senderPublicKey: await keypair.publicKey(),
        reissuable: true,
        fee: 100000000,
        timestamp: Date.now(),
    }

    const tx = TRANSACTIONS.Reissue.V2(issueBody)

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