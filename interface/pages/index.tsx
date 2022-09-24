import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import { Divider } from 'rsuite'

import Navigation from '@/components/Navigation'
import StakingSuggestion from '@/components/actions/Staking'
import TradingSuggestion from '@/components/actions/Trading'
import LandingPreview from '@/components/LandingPreview'
import ProcessSusdSuggestion from '@/components/actions/Susd'
import HowItWorks from '@/components/HowItWokrs'

const Index: NextPage = () => {
    return (
    <div>
        <Navigation />
        <LandingPreview />
        <HowItWorks />
        <div style={{
            display: "flex",
            gap: 10,
            justifyContent: "space-around",
            flexFlow: "column",
            padding: 10,

        }}>
            <StakingSuggestion />
            <ProcessSusdSuggestion />
            <TradingSuggestion />
        </div>
    </div>
  )
}

export default Index
