import { Button, Form, ButtonGroup, Drawer, Panel, InputNumber } from 'rsuite';
import DragableIcon from '@rsuite/icons/Dragable';
import React from 'react'
import TXStalker from '@/components/TXStalker';
import getConfig from 'next/config';


const config = getConfig();
const susdAssetId = config.publicRuntimeConfig.susdAssetId;

const BurnSusdDrawer = ({opened, setOpened, ...props}: {
    opened: boolean,
    setOpened: (_: boolean) => void
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
                        <Form.ControlLabel>SUSD</Form.ControlLabel>
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
                        <Form.HelpText>Available: TODO</Form.HelpText>
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
                />
            </Drawer.Body>
        </Drawer>
    );
}


const MintSusdDrawer = ({opened, setOpened, ...props}: {
    opened: boolean,
    setOpened: (_: boolean) => void
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
                        <Form.ControlLabel>SUSD</Form.ControlLabel>
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
                        <Form.HelpText>Available: TODO</Form.HelpText>
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
                />
            </Drawer.Body>
        </Drawer>
    );
}


const ProcessSusdSuggestion = () => {

    const [mintSusdDrawerOpened, setMintSusdDrawerOpened] = React.useState<boolean>(false);
    const [burnSusdDrawerOpened, setBurnSusdDrawerOpened] = React.useState<boolean>(false);

    return (
        <Panel header={
            <h3><DragableIcon /> Process sUSD</h3>
        } bordered shaded>
            Etiam non urna eget felis placerat pulvinar. Aliquam molestie nisl odio, vel interdum dui interdum scelerisque. Nulla ullamcorper massa quis elit facilisis, at sollicitudin nisl fermentum.
            <hr />

            <ButtonGroup justified>
                <Button color="green" appearance="ghost" onClick={() => setMintSusdDrawerOpened(true)}><b>Mint</b></Button>
                <Button color="yellow" appearance="ghost" onClick={() => setBurnSusdDrawerOpened(true)}><b>Burn</b></Button>
            </ButtonGroup>
            <MintSusdDrawer opened={mintSusdDrawerOpened} setOpened={setMintSusdDrawerOpened} />
            <BurnSusdDrawer opened={burnSusdDrawerOpened} setOpened={setBurnSusdDrawerOpened} />
        </Panel>
    );

}

export default ProcessSusdSuggestion
