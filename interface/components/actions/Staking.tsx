import getConfig from 'next/config'
import {ContractPayment, TRANSACTIONS, TRANSACTION_TYPES} from "@wavesenterprise/transactions-factory";
import { Panel, Button, Form, ButtonGroup, InputNumber, Drawer, Loader, Steps, Progress } from 'rsuite';
import PieChartIcon from '@rsuite/icons/PieChart';
import React from 'react';

import CallContractTx from '@/components/CallContractTx'
import getPublicState from '@/components/getPublicState'
import getWeWallet from '../getWeWallet';
import { TRANSACTION_VERSIONS } from '@wavesenterprise/js-sdk';
import callContract from '@/components/callContract';
import TXStalker from '@/components/TXStalker';


const config = getConfig();
const eastAssetId = config.publicRuntimeConfig.eastAssetId;
const nodeURL = config.publicRuntimeConfig.nodeURL;
const contractId = config.publicRuntimeConfig.contractId;


const StakeDrawer = ({opened, setOpened, eastBalance, westBalance, allDoneCb, ...props}: {
    opened: boolean,
    setOpened: (_: boolean) => void,
    eastBalance: number,
    westBalance: number,
    allDoneCb: () => void
}) => {

    const [westAmount, setWestAmount] = React.useState<number>(.0);
    const [eastAmount, setEastAmount] = React.useState<number>(.0);

    return (
        <Drawer size='full' placement='bottom' open={opened} onClose={() => setOpened(false)}>
            <Drawer.Header>
                <Drawer.Title><h3>Stake assets</h3></Drawer.Title>
            </Drawer.Header>
            <Drawer.Body style={{padding: 20}}>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut metus varius, malesuada elit sed, venenatis metus.</p>
                <br />

                <Form>
                    <Form.Group controlId="WEST amount">
                        <Form.ControlLabel>WEST amount</Form.ControlLabel>
                        <InputNumber
                            step={100}
                            defaultValue={westAmount}
                            value={westAmount}
                            onChange={(val: string | number, _) => {
                                if (typeof val == 'string') {
                                    setWestAmount(parseFloat(val))
                                } else {
                                    setWestAmount(val)
                                }
                            }}
                            placeholder='Enter how much WEST do you want to stakeT'
                            style={{width: "100%"}}
                        />
                        <Form.HelpText>Available: {westBalance}</Form.HelpText>
                    </Form.Group>
                    <Form.Group controlId="EAST amount">
                        <Form.ControlLabel>EAST amount</Form.ControlLabel>
                        <InputNumber
                            step={100}
                            defaultValue={eastAmount}
                            value={eastAmount}
                            onChange={(val: string | number, _) => {
                                if (typeof val == 'string') {
                                    setEastAmount(parseFloat(val))
                                } else {
                                    setEastAmount(val)
                                }
                            }}
                            placeholder='Enter how much EAST do you want to stake'
                            style={{width: "100%"}}
                        />
                        <Form.HelpText>Available: {eastBalance}</Form.HelpText>
                    </Form.Group>
                </Form>
                <TXStalker
                    prepareParamsCb={
                        () => [{
                            key: 'action',
                            type: 'string',
                            value: 'DepositCollateral'
                        }]
                    }
                    preparePaymentsCb={
                        () => {
                            let payments: Array<ContractPayment> = [];
                            // TODO: check both != 0
                            if (westAmount != 0) {
                                payments.push({
                                    amount: westAmount * Math.pow(10, 8)
                                })
                            }
                            if (eastAmount != 0) {
                                payments.push({
                                    amount: eastAmount * Math.pow(10, 8),
                                    assetId: eastAssetId
                                })
                            }
                            return payments
                        }
                    }
                    allDoneCb={allDoneCb}
                />
            </Drawer.Body>
        </Drawer>
    );
}


const UnstakeDrawer = ({opened, setOpened, eastBalance, westBalance, allDoneCb, ...props}: {
    opened: boolean,
    setOpened: (_: boolean) => void,
    eastBalance: number,
    westBalance: number,
    allDoneCb: () => void
}) => {


    const [westAmount, setWestAmount] = React.useState<number>(.0);
    const [eastAmount, setEastAmount] = React.useState<number>(.0)

    return (
        <Drawer size='full' placement='bottom' open={opened} onClose={() => setOpened(false)}>
            <Drawer.Header>
                <Drawer.Title><h3>Unstake assets</h3></Drawer.Title>
            </Drawer.Header>
            <Drawer.Body style={{padding: 20}}>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut metus varius, malesuada elit sed, venenatis metus.</p>
                <br />

                <Form>
                    <Form.Group controlId="WEST amount">
                        <Form.ControlLabel>WEST amount</Form.ControlLabel>
                        <InputNumber
                            step={100}
                            defaultValue={westAmount}
                            value={westAmount}
                            onChange={(val: string | number, _) => {
                                if (typeof val == 'string') {
                                    setWestAmount(parseFloat(val))
                                } else {
                                    setWestAmount(val)
                                }
                            }}
                            placeholder='Enter how much WEST do you want to unstake'
                            style={{width: "100%"}}
                        />
                        <Form.HelpText>Available: {westBalance}</Form.HelpText>
                    </Form.Group>
                    <Form.Group controlId="EAST amount">
                        <Form.ControlLabel>EAST amount</Form.ControlLabel>
                        <InputNumber
                            step={100}
                            defaultValue={eastAmount}
                            value={eastAmount}
                            onChange={(val: string | number, _) => {
                                if (typeof val == 'string') {
                                    setEastAmount(parseFloat(val))
                                } else {
                                    setEastAmount(val)
                                }
                            }}
                            placeholder='Enter how much EAST do you want to unstake'
                            style={{width: "100%"}}
                        />
                        <Form.HelpText>Available: {eastBalance}</Form.HelpText>
                    </Form.Group>
                </Form>
                <TXStalker
                    prepareParamsCb={
                        () => [{
                            key: 'action',
                            type: 'string',
                            value: 'WithdrawCollateral'
                        }]
                    }
                    preparePaymentsCb={
                        () => {
                            let payments: Array<ContractPayment> = [];
                            // TODO: check both != 0
                            if (westAmount != 0) {
                                payments.push({
                                    amount: westAmount * Math.pow(10, 8)
                                })
                            }
                            if (eastAmount != 0) {
                                payments.push({
                                    amount: eastAmount * Math.pow(10, 8),
                                    assetId: eastAssetId
                                })
                            }
                            console.log(payments)
                            return payments
                        }
                    }
                    allDoneCb={allDoneCb}
                />
            </Drawer.Body>
        </Drawer>
    );
}


const StakingSuggestion = () => {

    const [stakeDrawerOpened, setStakeDrawerOpened] = React.useState(false);
    const [unstakeDrawerOpened, setUnstakeDrawerOpened] = React.useState(false);

    const [westStaked, setWestStaked] = React.useState<number>(0);
    const [eastStaked, setEastStaked] = React.useState<number>(0);

    const [westBalance, setWestBalance] = React.useState<number>(1);
    const [eastBalance, setEastBalance] = React.useState<number>(1);

    const updateBalance = () => {
        const optionalPublicState = localStorage.getItem('publicState')
        if (optionalPublicState != null) {
            const publicState = JSON.parse(optionalPublicState)
            fetch(
                `${nodeURL}/contracts/${contractId}/userpos_${publicState['account']['publicKey']}`, {
                    method: "GET"
                }
            ).then(res => res.json().then(res => {
                const balance = JSON.parse(res['value'])
                console.log(balance)
                setWestStaked(
                    (balance['WestBalance'] / Math.pow(10, 8) * 100) / 100
                )
                setEastStaked(
                    (balance['EastBalance'] / Math.pow(10, 8) * 100) / 100
                )
            }))

            Promise.all([
                fetch(`${nodeURL}/addresses/balance/${publicState['account']['address']}`, {
                    method: 'GET'
                }),
                fetch(`${nodeURL}/assets/balance/${publicState['account']['address']}/${eastAssetId}`, {
                    method: 'GET'
                })
            ]).then((responses) => {
                Promise.all([
                    responses[0].json(), responses[1].json()
                ]).then((contents) => {
                    setWestBalance(Math.round((contents[0]['balance'] / Math.pow(10, 8)) * 100) / 100)
                    setEastBalance(Math.round((contents[1]['balance'] / Math.pow(10, 8)) * 100) / 100)
                })
            })
        }
    }

    React.useEffect(updateBalance)

    return (
        <Panel header={
            <h3><PieChartIcon /> Staking</h3>
        } bordered shaded>
            Deposit WEST or EAST tokens as collateral. Price of WEST is counted as 0.75 of its real price, because of its volatility. It&apos;s better and safer to deposit EAST, because it is stable.

            <hr />
            <div style={{
                display: "flex",
                justifyContent: "space-around"
            }}>
                Total WEST Staked: {westStaked}
                <Progress.Line percent={Math.round(westStaked / (westBalance + westStaked)* 100 * 100) / 100} strokeColor="#ffc107" />
            </div>
            <br />
            <div style={{
                display: "flex",
                justifyContent: "space-around"
            }}>
                Total EAST Staked: {eastStaked}
                <Progress.Line  percent={Math.round(eastStaked / (eastBalance + eastStaked) * 100 * 100) / 100} strokeColor="#ffc107" />
            </div>

            <hr />
            <ButtonGroup justified>
                <Button color="green" appearance="ghost" onClick={() => setStakeDrawerOpened(true)}><b>Stake</b></Button>
                <Button color="yellow" appearance="ghost" onClick={() => setUnstakeDrawerOpened(true)}><b>Unstake</b></Button>
            </ButtonGroup>
            <StakeDrawer allDoneCb={updateBalance} opened={stakeDrawerOpened} setOpened={setStakeDrawerOpened} eastBalance={eastBalance} westBalance={westBalance} />
            <UnstakeDrawer allDoneCb={updateBalance} opened={unstakeDrawerOpened} setOpened={setUnstakeDrawerOpened} eastBalance={eastStaked} westBalance={westStaked} />
        </Panel>
    );
}

export default StakingSuggestion;
