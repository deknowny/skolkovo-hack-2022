import { ContractParam, ContractPayment } from "@wavesenterprise/transactions-factory";
import React from "react";
import { Button, Loader, Panel, Steps } from "rsuite";
import callContract from "@/components/callContract";
import getConfig from "next/config";

const config = getConfig();
const eastAssetId = config.publicRuntimeConfig.eastAssetId;
const nodeURL = config.publicRuntimeConfig.nodeURL;

const TXStalker = ({prepareParamsCb, preparePaymentsCb, ...props}: {
    prepareParamsCb: () => Array<ContractParam>,
    preparePaymentsCb: () => Array<ContractPayment>
}) => {
    const [txPanelOpened, setTxPanelOpened] = React.useState<string>("none");
    const [txStep, setTxStep] = React.useState<number>(0);
    const [txStepStatus, setTxStepStatus] = React.useState<"process" | "finish" | "wait" | "error">("process");
    const [txId, setTxId] = React.useState<string>("")
    const [callFailMsg, setCallFailMsg] = React.useState<string>("")

    return (
        <div>
            <hr />
            <Button onClick={
                async () => {
                    setTxPanelOpened("block")
                    setTxStep(0)
                    setTxStepStatus("process")
                    await callContract(
                        prepareParamsCb(),
                        preparePaymentsCb(),
                        (res) => {
                            setTxStep(2)
                            res.json().then((parsed) => {
                                let refreshId = setInterval(() => {
                                    let localTxId = parsed['id']
                                    fetch(
                                        `${nodeURL}/contracts/status/${localTxId}`, {
                                            method: 'GET'
                                        }
                                    ).then(
                                        res => res.json().then(
                                            (res) => {
                                                if ('error' in res && res['error'] == 605) {
                                                    null
                                                } else if (res[0]['status'] == 'Success') {
                                                    setTxStepStatus("finish")
                                                    clearInterval(refreshId)
                                                } else {
                                                    setCallFailMsg(res[0]["message"])
                                                    setTxStepStatus("error")
                                                    clearInterval(refreshId)
                                                }
                                            }
                                        ).catch(err => {
                                            console.error(err)
                                            setTxStepStatus("error")
                                            clearInterval(refreshId)
                                        })
                                    ).catch(err => {
                                        console.error(err)
                                        setTxStepStatus("error")
                                        clearInterval(refreshId)
                                    })
                                }, 2000)
                            })

                        },
                        (err) => setTxStepStatus("error"),
                        (res) => {
                            setTxStep(1)
                            setTxId(res["id"])
                        },
                        (err) => setTxStepStatus("error")
                    )
                }
            } block appearance="primary">
                Confirm
            </Button>
            <br />
            <br />
            <Panel style={{display: txPanelOpened}} header={<Loader style={{display: txStepStatus == "process" ? "block" : "none"}} size="md" speed="fast" content={<h3>&nbsp;Processing the TX</h3>} />} shaded bordered>
                <Steps current={txStep} vertical currentStatus={txStepStatus}>
                    <Steps.Item title={<span>Sign Transation { txId }</span>} />
                    <Steps.Item title="Broadcast Transaction" />
                    <Steps.Item title={<span>Executing call{ callFailMsg ? `: Reverted with '${callFailMsg}'` : '' }</span>} />
                </Steps>
            </Panel>
        </div>
    );
}

export default TXStalker
