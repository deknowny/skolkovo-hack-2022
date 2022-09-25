import getWeWallet from "@/components/getWeWallet";
import { TRANSACTION_VERSIONS } from '@wavesenterprise/js-sdk';
import { ContractParam, ContractPayment, TRANSACTIONS, TRANSACTION_TYPES } from "@wavesenterprise/transactions-factory";
import getPublicState from "@/components/getPublicState";
import getConfig from "next/config";


const config = getConfig();
const contractId = config.publicRuntimeConfig.contractId;
const contractVersion = config.publicRuntimeConfig.contractVersion;
const nodeURL = config.publicRuntimeConfig.nodeURL;

export default async function callContract(
    params: Array<ContractParam>,
    payments: Array<ContractPayment>,
    successfulCb: (_: Response) => void,
    errorCb: (_: any) => void,
    successfulSignCb: (_: any) => void,
    errorSignCb: (_: any) => void,
) {
    const WEWallet = getWeWallet();
    try {
        const signedTx = await WEWallet.signTx(
            TRANSACTIONS.CallContract.V5({
                tx_type: TRANSACTION_TYPES.CallContract,
                version: 5,
                senderPublicKey: getPublicState()['account']['publicKey'],
                contractId: contractId,
                params: params,
                payments: payments,
                fee: 10000000,
                contractVersion: contractVersion,
            })
        )
        successfulSignCb(signedTx)
        fetch(
            `${nodeURL}/transactions/broadcast`, {
                method: "POST",
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify(signedTx)
            }
        )
            .then(successfulCb)
            .catch(errorCb)

    } catch(error) {
        errorSignCb(error)
        throw new Error("Cannot sign the tx")
    }
}
