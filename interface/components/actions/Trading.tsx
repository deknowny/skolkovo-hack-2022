import { Button, IconButton, ButtonGroup, ButtonToolbar, Panel } from 'rsuite';
import TrendIcon from '@rsuite/icons/Trend';


const TradingSuggestion = () => {
        return (
        <Panel header={
            <h3><TrendIcon /> Trading</h3>
        } bordered shaded>
            Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Pellentesque sed posuere mauris, ut eleifend elit. Fusce id nibh nisi. Etiam sit amet vehicula sem. Aenean a facilisis ex, et sagittis enim.
            <hr />
            <ButtonGroup justified>
                <Button color="green" appearance="ghost"><b>Trade your assets</b></Button>
            </ButtonGroup>
        </Panel>
    );

}

export default TradingSuggestion
