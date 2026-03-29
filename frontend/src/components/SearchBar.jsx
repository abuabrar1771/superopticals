import React, { useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import { useLocation } from 'react-router-dom'
import { useState } from 'react'

const SearchBar = () => {

    const {search,setSearch,showSearch, setShowSearch}=useContext(ShopContext)
    const location = useLocation();

  return (showSearch && location.pathname !== "/") ? (
    <div className='border-t border-b bg-gray-50 text-center'>
        <div className='inline-flex items-center justify-center border border-gray-800 px-5 py-2 mx-5 rounded-full w-3/4 sm:w-1/2'>
            <input  value={search} onChange={(e)=>setSearch(e.target.value)} className='flex-1 outline-none bg-inherit text-sm' type='text' placeholder='Search'/>
            <img className='w-4' src={assets.search_icon} alt='Search'/>
            </div>
            <img onClick = {()=> setShowSearch(false)} className='inline cursor-pointer w-3' src={assets.cross_icon} alt='Cross'/>

    </div>
  ): null }

export default SearchBar