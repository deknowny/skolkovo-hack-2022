import { Button, InputNumber, ButtonGroup, Form, Panel, Drawer, SelectPicker } from 'rsuite';
import React from 'react'
import TrendIcon from '@rsuite/icons/Trend';
import TXStalker from '../TXStalker';
import { ContractPayment } from '@wavesenterprise/transactions-factory';
import getConfig from 'next/config';


const config = getConfig();
const eastAssetId = config.publicRuntimeConfig.eastAssetId;
const nodeURL = config.publicRuntimeConfig.nodeURL;
const contractId = config.publicRuntimeConfig.contractId;
const susdAssetId = config.publicRuntimeConfig.susdAssetId;
const sbtcAssetId = config.publicRuntimeConfig.sbtcAssetId;

const pickerData = [
    {
        label: "sUSD",
        value: susdAssetId
    },
    {
        label: "sBTC (long)",
        value: sbtcAssetId
    }
]

const TradingDrawer = ({opened, setOpened, ...props}: {
    opened: boolean,
    setOpened: (_: boolean) => void
}) => {

    const [token1Amount, setToken1Amount] = React.useState<number>(.0);
    const [token1AssetId, setToken1AssetId] = React.useState(null);
    const [token2AssetId, setToken2AssetId] = React.useState(null);

    const [token1AssetBalance, setToken1AssetBalance] = React.useState<number>(0);

    const updateBalance = () => {
        const optionalPublicState = localStorage.getItem('publicState')
        if (optionalPublicState != null) {
            const publicState = JSON.parse(optionalPublicState)

            fetch(`${nodeURL}/assets/balance/${publicState['account']['address']}/${token1AssetId}`, {
                method: 'GET'
            }).then((response) => {
                response.json().then(content => {
                    const balance: number = Math.round(content['balance'] / Math.pow(10, 8) * 100) / 100
                    setToken1AssetBalance(balance)
                })
            })
        }
    }

    React.useEffect(updateBalance)

    return (
        <Drawer size='full' placement='bottom' open={opened} onClose={() => setOpened(false)}>
            <Drawer.Header>
                <Drawer.Title><h3>Trade assets</h3></Drawer.Title>
            </Drawer.Header>
            <Drawer.Body style={{padding: 20}}>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut metus varius, malesuada elit sed, venenatis metus.</p>
                <br />

                <Form>
                    <Form.Group controlId="WEST amount">
                        <Form.ControlLabel>TOKEN1 kind</Form.ControlLabel>
                        <SelectPicker
                            data={pickerData}
                            onChange={(val, _) => {
                                updateBalance()
                                setToken1AssetId(val)
                            }}
                        />
                    </Form.Group>
                    <Form.Group controlId="WEST amount">
                        <Form.ControlLabel>TOKEN1 amount</Form.ControlLabel>
                        <InputNumber
                            step={100}
                            defaultValue={token1Amount}
                            value={token1Amount}
                            onChange={(val: string | number, _) => {
                                if (typeof val == 'string') {
                                    setToken1Amount(parseFloat(val))
                                } else {
                                    setToken1Amount(val)
                                }
                            }}
                            placeholder='Enter how much WEST do you want to unstake'
                            style={{width: "100%"}}
                        />
                        <Form.HelpText>Available: {token1AssetBalance}</Form.HelpText>
                    </Form.Group>
                    <Form.Group controlId="WEST amount">
                        <Form.ControlLabel>TOKEN1 kind</Form.ControlLabel>
                        <SelectPicker
                            data={pickerData}
                            onChange={setToken2AssetId}
                        />
                    </Form.Group>
                </Form>

                <TXStalker
                // @ts-ignore
                    prepareParamsCb={
                        () => {
                            if (token2AssetId == null) {
                                throw new Error("Select a token")
                            }
                            if (token1AssetId == null) {
                                throw new Error("Select a token")
                            }
                            return [
                                {
                                    key: 'action',
                                    type: 'string',
                                    value: 'SwapSynth'
                                },
                                {
                                    key: 'token2_address',
                                    type: 'string',
                                    value: token2AssetId
                                },
                                {
                                    key: 'token1_addresss',
                                    type: 'string',
                                    value: token1AssetId
                                },
                                {
                                    key: 'amount_of_token1',
                                    type: 'integer',
                                    value: token1Amount * Math.pow(10, 8)
                                }
                            ]
                        }
                    }
                    preparePaymentsCb={
                        () => {
                            if (token1AssetId == null) {
                                throw new Error("Select a token")
                            }
                            return [{
                                assetId: token1AssetId,
                                amount: token1Amount * Math.pow(10, 8)
                            }]
                        }
                    }
                    allDoneCb={updateBalance}
                />
            </Drawer.Body>
        </Drawer>
    );
}


const TradingSuggestion = () => {

    const [tradingDrawerOpened, setTradingViewOpened] = React.useState<boolean>(false)

    return (
        <Panel header={
            <h3><TrendIcon /> Trading</h3>
        } bordered shaded>
            Swap your sUSD to any other synthetic asset (sBTC, iBTC) or the other way round. This uses oracles and will incur no slippage.
            <hr />
            <ButtonGroup justified>
                <Button color="green" appearance="ghost" onClick={() => setTradingViewOpened(true)}><b>Trade your assets</b></Button>
            </ButtonGroup>
            <TradingDrawer opened={tradingDrawerOpened} setOpened={setTradingViewOpened} />
        </Panel>
    );

}

export default TradingSuggestion
