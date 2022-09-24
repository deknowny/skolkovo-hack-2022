/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    reactStrictMode: true,
    swcMinify: true,
  }, publicRuntimeConfig: {
    eastAssetId: 'B3FAiTZDY8nBvE7Ztux1outecpUGD5F3z6rzcA5nmd6r',
    contractId: '4WvWaQCQX813wesau4BwdMDstMLapJFA61GUXCXn6uyp',
    nodeURL: 'https://hackathon.welocal.dev/node-0'
  }


}

module.exports = nextConfig
