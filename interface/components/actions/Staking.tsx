import { Panel, Button, IconButton, ButtonGroup, ButtonToolbar } from 'rsuite';
import PieChartIcon from '@rsuite/icons/PieChart';


const StakingSuggestion = () => {
    return (
        <Panel header={
            <h3><PieChartIcon /> Staking</h3>
        } bordered shaded>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut metus varius, malesuada elit sed, venenatis metus.
            <hr />

            <ButtonGroup justified>
                <Button color="green" appearance="ghost"><b>Stake</b></Button>
                <Button color="yellow" appearance="ghost"><b>Unstake</b></Button>
            </ButtonGroup>
        </Panel>
    );
}

export default StakingSuggestion;
