/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    reactStrictMode: true,
    swcMinify: true,
  }, publicRuntimeConfig: {
    eastAssetId: 'B3FAiTZDY8nBvE7Ztux1outecpUGD5F3z6rzcA5nmd6r',
    contractId: 'HUmCLhrvZdWqc35wWqybY86GouQBiseh56iG9RNCKJzP',
    nodeURL: 'https://hackathon.welocal.dev/node-0',
    contractVersion: 7
  }


}

module.exports = nextConfig
