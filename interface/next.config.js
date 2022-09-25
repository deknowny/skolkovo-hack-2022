/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    reactStrictMode: true,
    swcMinify: true,
  }, publicRuntimeConfig: {
    eastAssetId: 'B3FAiTZDY8nBvE7Ztux1outecpUGD5F3z6rzcA5nmd6r',
    susdAssetId: '12TPsq9xvVw24KWuf61ZAcJdFTV4rxqNeZ65cdHTVwPH',
    contractId: 'GK99AATRvvdNRQdoBJB6fkyS5vK6kGM2dievCzqtbbe7',
    sbtcAssetId: 'Ge9sTGHwPrMkUd193YtHCisad81Px3VTBecBUQwBM5B7',
    nodeURL: 'https://hackathon.welocal.dev/node-0',
    contractVersion: 9,
  },
  target: "serverless",
  assetPrefix: process.env.NEXT_DEV == '1' ? null: null// "https://raw.githubusercontent.com/Syndex-SDX/syndex-sdx.github.io/main"
}

module.exports = nextConfig
