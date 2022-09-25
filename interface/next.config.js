/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    reactStrictMode: true,
    swcMinify: true,
  }, publicRuntimeConfig: {
    eastAssetId: 'B3FAiTZDY8nBvE7Ztux1outecpUGD5F3z6rzcA5nmd6r',
    susdAssetId: 'D4PxpXPQcEm3hTg2YMQHPL9BkDhojTPDBJ7sjh2eYBWy',
    contractId: 'HUmCLhrvZdWqc35wWqybY86GouQBiseh56iG9RNCKJzP',
    nodeURL: 'https://hackathon.welocal.dev/node-0',
    contractVersion: 9,
  },
  target: "serverless",
  assetPrefix: 'https://syndex-sdx.github.io/'
}

module.exports = nextConfig
