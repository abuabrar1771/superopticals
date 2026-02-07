import React from 'react'
import { assets } from "../assets/assets";

const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around sm:gap-2 text-center py-20 text-md sm:text-md md:text-base text-cyan-600'>
        <div className='border-1 shadow-3xl justify-end p-6 relative overflow-hidden rounded-3xl'>
            <img src={assets.exchange_icon} alt='Exchange' className='w-12 m-auto mb-5'/>
            <h3 className='font-semibold'>Easy Excahnge Policy</h3>
            <ul>
                <li className='text-wrap'>“Frames may be returned within 7 days if unused and with tags.”</li>
                <li>“Prescription lenses, custom lenses, and personalized orders are non-returnable.”</li>
                <li>“Return shipping is paid by the customer unless the product was defective.”</li>
            </ul>
        </div>
        <div className='border-1 shadow-3xl justify-end p-6 relative overflow-hidden rounded-3xl'>
            <img src={assets.quality_icon} alt='Exchange' className='w-12 m-auto mb-5'/>
            <h2 className='font-semibold'>After Sales & Services</h2>
               <ul>
                <li>Free minor adjustments (nose pads, frame fitting, screw tightening).</li>
                <li>Repair services available for eligible products.</li>
                <li>Customers may be asked to ship the product to our service center.</li>
                </ul> 
        </div>
        <div className='border-1 shadow-3xl justify-end p-6 relative overflow-hidden rounded-3xl'>
            <img src={assets.support_img} alt='Exchange' className='w-12 m-auto mb-5'/>
            <p className='font-semibold'>Customer Support Every Day 9am to 9pm</p>
            <p>“Frames may be returned within 7 days if unused and with tags.”</p>
           <p>“Prescription lenses, custom lenses, and personalized orders are non-returnable.”</p>
            <p>“Return shipping is paid by the customer unless the product was defective.”</p>
        </div>

    </div>
  )
}

export default OurPolicy