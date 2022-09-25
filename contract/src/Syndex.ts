import {Action, Asset, Context, ContractState, Ctx, Param, Payments, State} from "@wavesenterprise/contract-core";

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
    TokenList: Array<BankToken>; // тут саплай личный
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
        await this.onlyAdmin()

        let price: WEastPrice = {
            WestPrice: Number.parseInt(String(westPrice)),
            EastPrice: Number.parseInt(String(eastPrice)),
        }
        const jsonPrice = JSON.stringify(price)
        this.state.setString("weast_price", jsonPrice)
    }

    @Action()
    async SetAssetPrice(
        @Param('assetId') assetId: string,
        @Param('newPrice') newPrice: number,
    ) {
        await this.onlyAdmin()

        const bankString = await this.state.getString("bank");
        let bank:Bank = JSON.parse(bankString)

        for (const i in bank.TokenList) {
            if (bank.TokenList[i].AssetID == assetId) {
                bank.TokenList[i].Price = newPrice;
            }
        }

        const json = JSON.stringify(bank)
        this.state.setString("bank", json)
    }

    @Action()
    async DepositCollateral(payments: Payments) {

        //TODO checking
        const assetWest = payments[0];
        const assetEast = payments[1];

        if (!assetWest && !assetEast) {
            throw new Error('One asset required!');
        }

        const bankString = await this.state.getString("bank");
        let bank:Bank = JSON.parse(bankString);

        bank.WestBalance += assetWest.amount.toNumber();
        bank.EastBalance += assetEast.amount.toNumber();

        const json = JSON.stringify(bank);
        this.state.setString("bank", json);

        try {
            const userPosString = await this.state.tryGetString("userpos_"+this.context.tx.senderPublicKey);
            const userPos:UserPosition = JSON.parse(userPosString);

            userPos.WestBalance += assetWest.amount.toNumber();
            userPos.EastBalance += assetEast.amount.toNumber();

            const userPosJson = JSON.stringify(userPos);
            this.state.setString("userpos_"+this.context.tx.senderPublicKey, userPosJson);
        } catch(e) {
            const userPos: UserPosition = {
                WestBalance: assetWest.amount.toNumber(),
                EastBalance: assetEast.amount.toNumber(),
                DebtShare: 0,
                TokenList: []
            }
            const userPosJson = JSON.stringify(userPos);
            this.state.setString("userpos_"+this.context.tx.senderPublicKey, userPosJson);
        }
    }

    @Action()
    async MintSUSD(
        @Param('amount') amountParam: number
    ) {
        let amount = Number.parseInt(String(amountParam))
        const valueOfCollateral = await this.valueOfCollateral(this.context.tx.senderPublicKey);
        if (valueOfCollateral / amount < 3) {
            throw new Error("Can't mint, CRatio will be under 300%. valueOfCollateral: "+valueOfCollateral+" amount: "+amount);
        }
        const bankString = await this.state.getString("bank");
        let bank:Bank = JSON.parse(bankString);

        const userPosString = await this.state.getString("userpos_"+this.context.tx.senderPublicKey);
        const userPos:UserPosition = JSON.parse(userPosString);

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
                Supply: amount.valueOf()
            });
            userPos.TokenList.push({
                Price: 1,
                AssetID: assetId,
                Supply: amount.valueOf()
            })
            this.state.setString("susd_address", assetId);
        } else {
            new Asset(susdAddress).reissue({
                quantity: amount,
                isReissuable: true
            })
            new Asset(susdAddress).transfer(this.context.sender, amount);
            for (const i in bank.TokenList) {
                if (bank.TokenList[i].AssetID == susdAddress) {
                    bank.TokenList[i].Supply += amount.valueOf();
                }
            }
            for (const i in userPos.TokenList) {
                if (userPos.TokenList[i].AssetID == susdAddress) {
                    userPos.TokenList[i].Supply += amount.valueOf();
                }
            }
        }
        const bankJson = JSON.stringify(bank);
        this.state.setString("bank", bankJson);

        const userPosJson = JSON.stringify(userPos);
        this.state.setString("userpos_"+this.context.tx.senderPublicKey, userPosJson);
    }

    @Action()
    async BurnSUSD(
        payments: Payments
    ) {
        const bankString = await this.state.getString("bank");
        let bank:Bank = JSON.parse(bankString);

        const userPosString = await this.state.getString("userpos_"+this.context.tx.senderPublicKey);
        const userPos:UserPosition = JSON.parse(userPosString);

        const susdAddress = await this.state.getString("susd_address");

        const asset = payments[0];
        if (asset.assetId != susdAddress) {
            throw new Error("Passed incorrect token");
        }

        for (const i in userPos.TokenList) {
            if (userPos.TokenList[i].AssetID == susdAddress) {
                if (userPos.TokenList[i].Supply < asset.amount.toNumber()) {
                    throw new Error("Not enough sUSD in wallet");
                } else {
                    const sysDebt = await this.systemDebt()
                    let removedDebt = bank.DebtShare * asset.amount.toNumber() / sysDebt
                    userPos.DebtShare -= removedDebt
                    bank.DebtShare -= removedDebt
                }
            }
        }
        new Asset(susdAddress).burn({amount: asset.amount.toNumber()})

        const bankJson = JSON.stringify(bank);
        this.state.setString("bank", bankJson);

        const userPosJson = JSON.stringify(userPos);
        this.state.setString("userpos_"+this.context.tx.senderPublicKey, userPosJson);
    }

    @Action()
    async WithdrawCollateral(
        @Param('amount_of_west') amountOfWest: number,
        @Param('amount_of_east') amountOfEast: number
    ) {
        if (amountOfWest == 0 || amountOfEast == 0) {
            throw new Error('One asset required!')
        }
        const bankString = await this.state.getString("bank");
        let bank:Bank = JSON.parse(bankString);

        const priceString = await this.state.getString("weast_price");
        const price: WEastPrice = JSON.parse(priceString);

        const userPosString = await this.state.getString("userpos_"+this.context.tx.senderPublicKey);
        const userPos:UserPosition = JSON.parse(userPosString);

        if (userPos.DebtShare == 0 || ((userPos.WestBalance - amountOfWest) * price.WestPrice * 0.75 + (userPos.EastBalance - amountOfEast) * price.EastPrice) / userPos.DebtShare >= 3) {
            userPos.WestBalance -= amountOfWest;
            userPos.EastBalance -= amountOfEast;
            bank.WestBalance -= amountOfWest;
            bank.EastBalance -= amountOfEast;

            new Asset(null).transfer(this.context.tx.sender, amountOfWest);
            new Asset(bank.EastAssetId).transfer(this.context.tx.sender, amountOfEast);
        } else {
            throw new Error("Can't withdraw this much, CRatio will be under 300%");
        }
        const bankJson = JSON.stringify(bank);
        this.state.setString("bank", bankJson);

        const userPosJson = JSON.stringify(userPos);
        this.state.setString("userpos_"+this.context.tx.senderPublicKey, userPosJson);

    }

    @Action()
    async SwapSynth(
        @Param('token1_address') token1address: string,
        @Param('amount_of_token1') amountOfToken1Param: number,
        @Param('token2_address') token2address: string,
        payment: Payments
    ) {
        if (token1address != payment[0].assetId) {
            throw new Error("passed incorrect token1address")
        }

        let amountOfToken1 = Number.parseInt(String(amountOfToken1Param))

        const bankString = await this.state.getString("bank");
        let bank:Bank = JSON.parse(bankString);

        const userPosString = await this.state.getString("userpos_"+this.context.tx.senderPublicKey);
        const userPos:UserPosition = JSON.parse(userPosString);

        let userIndex1, userIndex2;
        userIndex2 = -1
        for (const i in userPos.TokenList) {
            if (userPos.TokenList[i].AssetID == token1address) {
                userIndex1 = i;
            }
            if (userPos.TokenList[i].AssetID == token2address) {
                userIndex2 = i;
            }
        }

        let index1, index2;
        for (const i in bank.TokenList) {
            if (bank.TokenList[i].AssetID == token1address) {
                index1 = i;
            }
            if (bank.TokenList[i].AssetID == token2address) {
                index2 = i;
            }
        }

        for (const i in userPos.TokenList) {
            if (userPos.TokenList[i].AssetID == token1address) {
                if (userPos.TokenList[i].Supply >= amountOfToken1) {
                    let boughtAmount = amountOfToken1 * bank.TokenList[index1].Price / bank.TokenList[index2].Price;
                    bank.TokenList[index1].Supply -= amountOfToken1;
                    bank.TokenList[index2].Supply += boughtAmount;
                    userPos.TokenList[userIndex1].Supply -= amountOfToken1;

                    new Asset(token1address).burn({amount: amountOfToken1})
                    new Asset(token2address).reissue({
                        quantity: boughtAmount,
                        isReissuable: true
                    })
                    new Asset(token2address).transfer(this.context.tx.sender, boughtAmount)
                    if (userIndex2 == -1) {
                        userPos.TokenList.push({
                            Price: 0,
                            AssetID: token2address,
                            Supply: boughtAmount
                        })
                        userPos.TokenList[userPos.TokenList.length-1].Supply += boughtAmount;
                        break;
                    }
                    userPos.TokenList[userIndex2].Supply += boughtAmount;
                } else {
                    throw new Error("Not enough tokens");
                }
            }
        }
        const bankJson = JSON.stringify(bank);
        this.state.setString("bank", bankJson);

        const userPosJson = JSON.stringify(userPos);
        this.state.setString("userpos_"+this.context.tx.senderPublicKey, userPosJson);
    }

    @Action()
    async CreateSynth(
        @Param('name') name: string,
        @Param('description') description: string,
        @Param('price') priceParam: number
    ) {
        await this.onlyAdmin()

        let price = Number.parseInt(String(priceParam))

        const assetId = await Asset.calculateAssetId(1);
        new Asset(assetId).issue({
            description: description,
            name: name,
            decimals: 8,
            isReissuable: true,
            quantity: 0,
            assetId: assetId,
            nonce: 1
        });

        const bankString = await this.state.getString("bank");
        let bank:Bank = JSON.parse(bankString);

        bank.TokenList.push({
            Price: price,
            AssetID: assetId,
            Supply: 0
        });

        const bankJson = JSON.stringify(bank);
        this.state.setString("bank", bankJson);
        //new Asset(assetId).transfer(this.context.sender, 0)
    }

    @Action()
    async DataChange(
        @Param('key') key: string,
        @Param('value') value: string,
    ) {
        await this.onlyAdmin();
        this.state.setString(key, value);
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

        return userPos.WestBalance * price.WestPrice * 0.75 + userPos.EastBalance * price.EastPrice
    }

    private async onlyAdmin() {
        const bankString = await this.state.getString("bank");
        let bank:Bank = JSON.parse(bankString)
        if (bank.Admin != this.context.tx.senderPublicKey) {
            throw new Error("Access denied!");
        }
    }
}