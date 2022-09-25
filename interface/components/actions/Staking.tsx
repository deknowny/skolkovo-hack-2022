import getConfig from 'next/config'
import {ContractPayment, TRANSACTIONS, TRANSACTION_TYPES} from "@wavesenterprise/transactions-factory";
import { Panel, Button, Form, ButtonGroup, InputNumber, Drawer, Loader, Steps } from 'rsuite';
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


const StakeDrawer = ({opened, setOpened, ...props}: {
    opened: boolean,
    setOpened: (_: boolean) => void
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
                        <Form.HelpText>Available: TODO</Form.HelpText>
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
                        <Form.HelpText>Available: TODO</Form.HelpText>
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
                />
            </Drawer.Body>
        </Drawer>
    );
}


const UnstakeDrawer = ({opened, setOpened, ...props}: {
    opened: boolean,
    setOpened: (_: boolean) => void
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
                        <Form.HelpText>Available: TODO</Form.HelpText>
                    </Form.Group>
                    <Form.Group controlId="EAST amount">
                        <Form.ControlLabel>WEST amount</Form.ControlLabel>
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
                        <Form.HelpText>Available: TODO</Form.HelpText>
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
                            console.log(payments)
                            return payments
                        }
                    }
                />
            </Drawer.Body>
        </Drawer>
    );
}


const StakingSuggestion = () => {

    const [stakeDrawerOpened, setStakeDrawerOpened] = React.useState(false);
    const [unstakeDrawerOpened, setUnstakeDrawerOpened] = React.useState(false);

    return (
        <Panel header={
            <h3><PieChartIcon /> Staking</h3>
        } bordered shaded>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut metus varius, malesuada elit sed, venenatis metus.
            <hr />

            <ButtonGroup justified>
                <Button color="green" appearance="ghost" onClick={() => setStakeDrawerOpened(true)}><b>Stake</b></Button>
                <Button color="yellow" appearance="ghost" onClick={() => setUnstakeDrawerOpened(true)}><b>Unstake</b></Button>
            </ButtonGroup>
            <StakeDrawer opened={stakeDrawerOpened} setOpened={setStakeDrawerOpened} />
            <UnstakeDrawer opened={unstakeDrawerOpened} setOpened={setUnstakeDrawerOpened} />
        </Panel>
    );
}

export default StakingSuggestion;
