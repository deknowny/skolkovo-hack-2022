import { Button, IconButton, ButtonGroup, ButtonToolbar, Panel } from 'rsuite';
import DragableIcon from '@rsuite/icons/Dragable';


const ProcessSusdSuggestion = () => {
    return (
        <Panel header={
            <h3><DragableIcon /> Process sUSD</h3>
        } bordered shaded>
            Etiam non urna eget felis placerat pulvinar. Aliquam molestie nisl odio, vel interdum dui interdum scelerisque. Nulla ullamcorper massa quis elit facilisis, at sollicitudin nisl fermentum.
            <hr />

            <ButtonGroup justified>
                <Button color="green" appearance="ghost"><b>Mint</b></Button>
                <Button color="yellow" appearance="ghost"><b>Burn</b></Button>
            </ButtonGroup>
        </Panel>
    );

}

export default ProcessSusdSuggestion
