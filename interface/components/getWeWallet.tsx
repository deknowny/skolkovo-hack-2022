export default function getWeWallet() {
    const WEWallet = window.WEWallet
    if (!WEWallet) {
        alert("Can use only with WE Wallet browser extension.")
        throw new Error("Wallet extension is required")
    }
    return WEWallet
}
