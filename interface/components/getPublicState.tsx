export default function getPublicState() {
    const optionalPublicState = localStorage.getItem('publicState')
    if (optionalPublicState == null) {
        alert("Connect a wallet firstly.")
        throw new Error("Wallet connection is required")
    }
    return JSON.parse(optionalPublicState)
}
