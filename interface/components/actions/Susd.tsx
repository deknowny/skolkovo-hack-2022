import { Button, Form, ButtonGroup, Drawer, Panel, InputNumber, Progress } from 'rsuite';
import DragableIcon from '@rsuite/icons/Dragable';
import React from 'react'
import TXStalker from '@/components/TXStalker';
import getConfig from 'next/config';


const config = getConfig();
const susdAssetId = config.publicRuntimeConfig.susdAssetId;
const nodeURL = config.publicRuntimeConfig.nodeURL;
const contractId = config.publicRuntimeConfig.contractId;

const BurnSusdDrawer = ({opened, setOpened, susdBalance, allDoneCb, ...props}: {
    opened: boolean,
    setOpened: (_: boolean) => void,
    susdBalance: number,
    allDoneCb: () => void
}) => {

    const [susdAmount, setSusdAmount] = React.useState<number>(.0);

    return (
        <Drawer size='full' placement='bottom' open={opened} onClose={() => setOpened(false)}>
            <Drawer.Header>
                <Drawer.Title><h3>Burn sUSD</h3></Drawer.Title>
            </Drawer.Header>
            <Drawer.Body style={{padding: 20}}>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut metus varius, malesuada elit sed, venenatis metus.</p>
                <br />

                <Form>
                    <Form.Group controlId="sUSD amount">
                        <Form.ControlLabel>sUSD to burn</Form.ControlLabel>
                        <InputNumber
                            step={100}
                            defaultValue={susdAmount}
                            value={susdAmount}
                            onChange={(val: string | number, _) => {
                                if (typeof val == 'string') {
                                    setSusdAmount(parseFloat(val))
                                } else {
                                    setSusdAmount(val)
                                }
                            }}
                            placeholder='Enter how much sUSD you want to burn'
                            style={{width: "100%"}}
                        />
                        <Form.HelpText>Available: {susdBalance}</Form.HelpText>
                    </Form.Group>
                </Form>
                <TXStalker
                    prepareParamsCb={
                        () => [{
                            key: 'action',
                            type: 'string',
                            value: 'BurnSUSD'
                        }]
                    }
                    preparePaymentsCb={() => {
                        // TODO: check != 0
                        return [{
                            amount: susdAmount * Math.pow(10, 8),
                            assetId: susdAssetId
                        }]

                    }}
                    allDoneCb={allDoneCb}
                />
            </Drawer.Body>
        </Drawer>
    );
}


const MintSusdDrawer = ({opened, setOpened, susdBalance, allDoneCb, ...props}: {
    opened: boolean,
    setOpened: (_: boolean) => void,
    susdBalance: number,
    allDoneCb: () => void
}) => {

    const [susdAmount, setSusdAmount] = React.useState<number>(.0);

    return (
        <Drawer size='full' placement='bottom' open={opened} onClose={() => setOpened(false)}>
            <Drawer.Header>
                <Drawer.Title><h3>Mint sUSD</h3></Drawer.Title>
            </Drawer.Header>
            <Drawer.Body style={{padding: 20}}>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut metus varius, malesuada elit sed, venenatis metus.</p>
                <br />

                <Form>
                    <Form.Group controlId="WEST amount">
                        <Form.ControlLabel>sUSD to mint</Form.ControlLabel>
                        <InputNumber
                            step={100}
                            defaultValue={susdAmount}
                            value={susdAmount}
                            onChange={(val: string | number, _) => {
                                if (typeof val == 'string') {
                                    setSusdAmount(parseFloat(val))
                                } else {
                                    setSusdAmount(val)
                                }
                            }}
                            placeholder='Enter how much sUSD you want to mint'
                            style={{width: "100%"}}
                        />
                        <Form.HelpText>Available: {susdBalance}</Form.HelpText>
                    </Form.Group>
                </Form>
                <TXStalker
                    prepareParamsCb={
                        () => [
                            {
                                key: 'action',
                                type: 'string',
                                value: 'MintSUSD'
                            },
                            {
                                key: 'amount',
                                type: 'integer',
                                value: susdAmount * Math.pow(10, 8)
                            }
                        ]
                    }
                    preparePaymentsCb={() => []}
                    allDoneCb={allDoneCb}
                />
            </Drawer.Body>
        </Drawer>
    );
}


const ProcessSusdSuggestion = () => {

    const [mintSusdDrawerOpened, setMintSusdDrawerOpened] = React.useState<boolean>(false);
    const [burnSusdDrawerOpened, setBurnSusdDrawerOpened] = React.useState<boolean>(false);

    const [susdBalance, setSusdBalance] = React.useState<number>(0);


    const updateBalance = () => {
        const optionalPublicState = localStorage.getItem('publicState')
        if (optionalPublicState != null) {
            const publicState = JSON.parse(optionalPublicState)
            console.log(`${nodeURL}/assets/balance/${publicState['account']['address']}/${susdAssetId}`)
            fetch(`${nodeURL}/assets/balance/${publicState['account']['address']}/${susdAssetId}`, {
                method: 'GET'
            }).then((response) => {
                response.json().then(content => {
                    const balance = Math.round(content['balance'] / Math.pow(10, 8) * 100) / 100
                    setSusdBalance(balance)
                })
            })
        }
    }

    React.useEffect(updateBalance)

    return (
        <Panel header={
            <h3><DragableIcon /> Process sUSD</h3>
        } bordered shaded>
            Etiam non urna eget felis placerat pulvinar. Aliquam molestie nisl odio, vel interdum dui interdum scelerisque. Nulla ullamcorper massa quis elit facilisis, at sollicitudin nisl fermentum.
            <hr />
            <div style={{
                // display: "flex",
                // justifyContent: "space-around"
            }}>
                Total sUSD balance: {susdBalance}
                {/* <Progress.Line percent={Math.round(westStaked / westBalance * 100 * 1000) / 1000} strokeColor="#ffc107" /> */}
            </div>
            <hr />

            <ButtonGroup justified>
                <Button color="green" appearance="ghost" onClick={() => setMintSusdDrawerOpened(true)}><b>Mint</b></Button>
                <Button color="yellow" appearance="ghost" onClick={() => setBurnSusdDrawerOpened(true)}><b>Burn</b></Button>
            </ButtonGroup>
            <MintSusdDrawer allDoneCb={updateBalance} opened={mintSusdDrawerOpened} setOpened={setMintSusdDrawerOpened} susdBalance={susdBalance} />
            <BurnSusdDrawer allDoneCb={updateBalance} opened={burnSusdDrawerOpened} setOpened={setBurnSusdDrawerOpened} susdBalance={susdBalance} />
        </Panel>
    );

}

export default ProcessSusdSuggestion
