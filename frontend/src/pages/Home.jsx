import React from 'react'
import Hero from '../components/Hero'
import LatestCollections from '../components/LatestCollections'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import OurBrands from '../components/OurBrands'
import Footer from '../components/Footer'
import NewsletterBox from '../components/NewsletterBox'

const Home = () => {
  return (
    <div>
      <Hero/>
      <LatestCollections/>
      <BestSeller/>
      <OurBrands/>
      <NewsletterBox/>
      <Footer/>
    </div>
  )
}

export default Home