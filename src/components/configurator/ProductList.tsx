import React from 'react'
import { Image } from '@/components/ui/image';
import sofa from "../../assets/img/categories/sofa.jpg"

const ProductList = () => {
  return (
    <>
      <div className='w-1/2 mx-auto mt-10 gap-1'>
        <div className='grid grid-cols-5 gap-0'>
          <div className='flex justify-center flex-col items-center'>
            <Image
              className="w-[170px] rounded border-2 hover:border-[#00A698] duration-200 transform"
              src={sofa}
              alt="all"
            />
            <h6 className='text-center mt-2 text-sm font-semibold	hover:text-[#00A698]'>Ava Studio Sofa</h6>
          </div>
          <div className='flex justify-center flex-col items-center'>
            <Image
              className="w-[170px] rounded border-2 hover:border-[#00A698] duration-200 transform"
              src={sofa}
              alt="sofa"
            />
            <h6 className='text-center mt-2 text-sm font-semibold	hover:text-[#00A698]'>Nathan Accent Chair</h6>
          </div>
          <div className='flex justify-center flex-col items-center'>
            <Image
              className="w-[170px] rounded border-2 hover:border-[#00A698] duration-200 transform"
              src={sofa}
              alt="swivels"
            />
            <h6 className='text-center mt-2 text-sm font-semibold	hover:text-[#00A698]'>Gina Curved Sofa</h6>
          </div>
          <div className='flex justify-center flex-col items-center'>
            <Image
              className="w-[170px] rounded border-2 hover:border-[#00A698] duration-200 transform"
              src={sofa}
              alt="swivels"
            />
            <h6 className='text-center mt-2 text-sm font-semibold	hover:text-[#00A698]'>Basalto Low Arm Sofa</h6>
          </div>
          <div className='flex justify-center flex-col items-center'>
            <Image
              className="w-[170px] rounded border-2 hover:border-[#00A698] duration-200 transform"
              src={sofa}
              alt="chair"
            />
            <h6 className='text-center mt-2 text-sm font-semibold	hover:text-[#00A698]'>Belize Sofa</h6>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductList