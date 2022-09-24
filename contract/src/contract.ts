import {Action, Asset, Context, ContractState, Ctx, Param, Payments, State} from "@wavesenterprise/contract-core";
import {QueuePicker} from "@grpc/grpc-js/build/src/picker";

export interface BankToken {
    AssetID: string;
    Supply: number;
    Price: number;
}

export interface WEastPrice {
    WestPrice: number;
    EastPrice: number;
}

export interface UserPosition {
    WestBalance: number;
    EastBalance: number;
    DebtShare: number;
}

export interface Bank {
    Admin: string
    WestBalance: number;
    EastBalance: number;
    EastAssetId: string;
    DebtShare: number; //сумма всех шеров юзеров
    TokenList: Array<BankToken>;
}

export default class SyndexContract {
    @State() state: ContractState;
    @Ctx context: Context;

    @Action({onInit: true})
    async _contructor(
        @Param('eastAssetId') eastAssetId: string
    ) {
        let bank: Bank = {
            Admin: this.context.tx.senderPublicKey,
            WestBalance: 0,
            EastBalance: 0,
            EastAssetId: eastAssetId,
            DebtShare: 0,
            TokenList: new Array<BankToken>(),
        }
        const jsonBank = JSON.stringify(bank)

        let price: WEastPrice = {
            WestPrice: 0,
            EastPrice: 0
        }
        const jsonPrice = JSON.stringify(price)

        this.state.setString("susd_address", "")

        this.state.setString("bank", jsonBank)
        this.state.setString("weast_price", jsonPrice)
    }

    @Action
    async SetWEastPrice(
        @Param('west_price') westPrice: number,
        @Param('east_price') eastPrice: number,
    ) {
        const bankString = await this.state.getString("bank");
        let bank: Bank = JSON.parse(bankString)
        if (bank.Admin != this.context.tx.senderPublicKey) {
            throw new Error("Access denied!");
        }

        let price: WEastPrice = {
            WestPrice: westPrice,
            EastPrice: eastPrice,
        }
        const jsonPrice = JSON.stringify(price)
        this.state.setString("weast_price", jsonPrice)
    }

    @Action()
    async SetAssetPrice(
        @Param('assetId') assetId: string,
        @Param('newPrice') newPrice: number,
    ) {
        const bankString = await this.state.getString("bank");
        let bank:Bank = JSON.parse(bankString)
        if (bank.Admin != this.context.tx.senderPublicKey) {
            throw new Error("Access denied!");
        }
        bank.TokenList.push({
            AssetID: assetId,
            Supply: 0,
            Price: newPrice
        })
        const json = JSON.stringify(bank)
        this.state.setString("bank", json)
    }

    @Action()
    async UserDeposit(payments: Payments) {
        const assetWest = payments[0];
        const assetEast = payments[1];

        if (!assetWest && !assetEast) {
            throw new Error('One asset required!');
        }
        const bankString = await this.state.getString("bank");
        let bank:Bank = JSON.parse(bankString)

        bank.WestBalance += assetWest.amount
        bank.EastBalance += assetEast.amount

        const json = JSON.stringify(bank)
        this.state.setString("bank", json)
    }

    @Action()
    async MintSUSD(
        @Param('amount') amount: number
    ) {
        const valueOfCollateral = await this.valueOfCollateral(this.context.tx.senderPublicKey)
        if (valueOfCollateral / amount < 5) {
            throw new Error("Can't mint, CRatio will be under 500%")
        }
        const bankString = await this.state.getString("bank");
        let bank:Bank = JSON.parse(bankString)

        const userPosString = await this.state.getString("userpos_"+this.context.tx.senderPublicKey);
        const userPos:UserPosition = JSON.parse(userPosString)

        const sysDebt = await this.systemDebt()
        if (sysDebt == 0) {
            userPos.DebtShare = 1.0;
            bank.DebtShare = 1.0;
        } else {
            userPos.DebtShare += bank.DebtShare * amount / sysDebt;
            bank.DebtShare += bank.DebtShare * amount / sysDebt;
        }

        const susdAddress = await this.state.getString("susd_address")
        if (susdAddress == "") {
            const assetId = await Asset.calculateAssetId(1);
            new Asset(assetId).issue({
                description: "sUSD",
                name: "Syndex USD",
                decimals: 8,
                isReissuable: true,
                quantity: amount,
                assetId: assetId,
                nonce: 1
            });
            new Asset(assetId).transfer(this.context.sender, amount);
            bank.TokenList.push({
                Price: 1,
                AssetID: assetId,
                Supply: amount
            });
            this.state.setString("susd_address", assetId)
        } else {
            new Asset(susdAddress).reissue({
                quantity: amount,
                isReissuable: true
            })
            new Asset(susdAddress).transfer(this.context.sender, amount);
            for (const i in bank.TokenList) {
                if (bank.TokenList[i].AssetID == susdAddress) {
                    bank.TokenList[i].Supply += amount
                }
            }
        }
        const bankJson = JSON.stringify(bank)
        this.state.setString("bank", bankJson)

        const userPosJson = JSON.stringify(userPos)
        this.state.setString("userpos_"+this.context.tx.senderPublicKey, userPosJson)
    }

    private async systemDebt() {
        let sysDebt = 0

        const bankString = await this.state.getString("bank");
        let bank:Bank = JSON.parse(bankString)

        for (const i in bank.TokenList) {
            sysDebt += (bank.TokenList[i].Supply * bank.TokenList[i].Price)
        }

        return sysDebt
    }

    private async valueOfCollateral(publicKey: string) {
        const userPosString = await this.state.getString("userpos_"+publicKey);
        const userPos:UserPosition = JSON.parse(userPosString)

        const priceString = await this.state.getString("weast_price")
        const price: WEastPrice = JSON.parse(priceString)

        return userPos.WestBalance * price.WestPrice + userPos.EastBalance * price.EastPrice
    }
}
