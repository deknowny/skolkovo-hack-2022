import type { NextComponentType } from 'next'
import useSWR from 'swr'

import { Navbar, Nav, Button, Modal } from 'rsuite';
import CodeIcon from '@rsuite/icons/Code';
import InfoRoundIcon from '@rsuite/icons/InfoRound'
import React from 'react';



async function accessPublicState(openAlert: Function) {
    if (!window.WEWallet) {
        openAlert()
    } else {
        const WEWallet = window.WEWallet
        const getPublicState = async () => {
            try {
                const state = await WEWallet.publicState();
                localStorage.setItem('publicState', JSON.stringify(state));
                console.log(state.account); // displaying the result in the console
            } catch(error) {
                console.error(error); // displaying the result in the console
            }
        }
        await getPublicState();
    }

}

function getAuthLabel() {
    const optionalPublicState = localStorage.getItem('publicState')
    if (optionalPublicState != null) {
        const publicState = JSON.parse(optionalPublicState);
        console.log(publicState);
        return `Account ${publicState.account.name}: ${publicState.account.address.slice(0, 7)}...`;
    } else {
        return "Connect wallet"
    }
}


const Navigation: NextComponentType = ({ ...props }) => {

    const [authLabel, setAuthLabel] = React.useState<string>(
    )
    React.useEffect(() => {
        setAuthLabel(getAuthLabel())
    })
    const [modalState, setModalState] = React.useState<boolean>(false)

    return (
        <Navbar style={{backgroundColor: "#282c34"}}>
            <Nav>
                {/* <Nav.Item icon={<InfoRoundIcon />} active>
                    &nbsp;About
                </Nav.Item> */}
                <Nav.Item icon={<CodeIcon />} active>
                    &nbsp;Source code
                </Nav.Item>
            </Nav>
            <Nav pullRight>
                <Nav.Item>
                    <Button appearance='primary' onClick={async () => {
                        await accessPublicState(() => setModalState(true))
                        setAuthLabel(getAuthLabel())
                    }}>{authLabel}</Button>
                </Nav.Item>
            </Nav>
            <Modal size='md' open={modalState} onClose={() => setModalState(false)}>
                <Modal.Header>
                    <Modal.Title>Cannot auth with WE wallet</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    To continue using the website, please, enable WE wallet extension for Chrome
                </Modal.Body>
                <Modal.Footer>
                <Button onClick={() => setModalState(false)} appearance='primary'>
                    Ok
                </Button>
                </Modal.Footer>
            </Modal>
        </Navbar>

    );
}

export default Navigation;
