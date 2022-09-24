import {Action, Context, ContractState, Ctx, Param, State} from "@wavesenterprise/contract-core";

/**
 * CPMM to swap WEST to custom asset
 */
export default class TestContract {
    @State() state: ContractState;
    @Ctx context: Context;

    @Action({onInit: true})
    async _contructor(
    ) {
    }

    @Action()
    async addState(
        @Param('info') info: string,
    ) {
        this.state.setString("tx_"+this.context.tx.id, info)
    }
}