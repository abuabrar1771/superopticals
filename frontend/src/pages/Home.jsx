import React from 'react'
import Hero from '../components/Hero'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import OurBrands from '../components/OurBrands'
import Footer from '../components/Footer'
import NewsletterBox from '../components/NewsletterBox'
import ShopByCategory from '../components/ShopByCategory'

const Home = () => {
  return (
    <div>
      <Hero/>
      <ShopByCategory />
      <OurBrands/>
      {/* <LatestCollections/>
      <BestSeller/> */}
      
      <NewsletterBox/>
    </div>
  )
}

export default Home