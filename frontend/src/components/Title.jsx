
import React from 'react'

const Title = ({text1,text2}) => {
  return (
    <div className='inline-flex gap-2 items-center mb-3'>
    <p className='text-blue-400 '>{text1} <span className='text-blue-600 font-medium'>{text2}</span></p>
    <p className='w-8 md:w-12 h-[1px] sm:h-[2px] bg-cyan-700'></p>    
    </div>
  )
}

export default Title