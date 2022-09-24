import { Steps } from 'rsuite';


const HowItWorks = () => {
    return (
        <div style={{margin: 20}}>
            <h4>How it works</h4>
            <br />
            <Steps vertical>
                <Steps.Item title="Freeze WEST/EAST firstly to fill the debt" description="" status='process'/>
                <Steps.Item title="Mint an amount of synthetic USD (sUSD)" status='process'/>
                <Steps.Item title="Trade your sUSD in synthetic pairs" status='process'/>
            </Steps>
        </div>
    );
}

export default HowItWorks
