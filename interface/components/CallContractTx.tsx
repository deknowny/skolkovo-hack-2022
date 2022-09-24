export default interface CallContractTx {
    fee: number,
    contractId: string,
    sender: string,
    type: 104,
    version: 3,
    contractVersion: 1,
    params: Array<{key: string, type: string, value: any}>,
    payments: Array<{amount: number, assetId?: string}>
}
