import React from 'react'
import { useModalAction } from '../ui/modal/modal.context';
import { Image } from '@/components/ui/image';
import SmileIcon from "../../assets/icon/SmileIcon.png"
import PreviewImg from "../../assets/img/product.jpg"
import { CustomCheckIcon } from '../icons/custom-check-icon';
import { CloseIcon } from '../icons/close-icon';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Swiper, SwiperSlide, Navigation } from '@/components/ui/slider';
import { ArrowNext, ArrowPrev } from '../icons';

const ProjectSaved = () => {
  const { openModal, closeModal } = useModalAction();

  const router = useRouter();

  let Product = [];
  if (typeof window !== 'undefined') Product = JSON.parse(localStorage?.getItem('cartItems'));

  let fullUrl;
  if (typeof window !== 'undefined') fullUrl = window.location.origin;

  const breakpoints = {
    320: {
      slidesPerView: 1,
      spaceBetween: 0,
    },
    580: {
      slidesPerView: 1,
      spaceBetween: 16,
    },
    1024: {
      slidesPerView: 1,
      spaceBetween: 16,
    },
    1920: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
  };

  return (<div className="flex h-full min-h-screen w-screen flex-col justify-center bg-light md:h-auto md:min-h-0 md:max-w-[600px] md:rounded-xl">
    <div onClick={() => closeModal()} className='w-full lg:flex justify-end pt-4 pr-4 hidden'><CloseIcon width='20px' /></div>
    <div className="items-center px-7 py-10">

      <div className='text-center mb-5 items-center flex flex-col'>
        <Image src={SmileIcon} alt="SmileIcon" className='w-[120px]' />
        <h1 className='text-2xl font-semibold mb-1 mt-5'>Your Project Is Saved</h1>
        <p className='text-md text-[#6B7280]'>Use this link to access your project.</p>
      </div>

      <div className='my-7 grid grid-cols-12 gap-3'>
        <input
          id='name'
          type="text"
          autoComplete="off"
          value={`${fullUrl}/project-summary`}
          className='col-span-9 py-2 border-gray-300 item-center w-full overflow-hidden truncate rounded-md text-sm text-[#6B7280] placeholder-gray-500 transition duration-300 ease-in-out focus:border-accent focus:outline-0 focus:ring-0'
        />
        <button className='col-span-3 bg-accent w-full py-2 text-sm font-semibold shadow-700 transition-colors hover:bg-accent-hover focus:bg-accent-hover focus:outline-0 text-light rounded-md'>Copy</button>
      </div>

      <div className='text-center items-center flex flex-col'>
        <p className='text-lg text-accent font-medium border-b-2 border-accent cursor-pointer' onClick={() => { router?.push('/project-summary'); closeModal() }}>Hey ! Check your preview link</p>


        <div className="relative mt-2 w-3/4">
          <Swiper
            breakpoints={breakpoints}
            modules={[Navigation]}
            navigation={{
              nextEl: '.next',
              prevEl: '.prev',
            }}
          >
            {Product?.map((d) => (
              <SwiperSlide key={d?.sku}>
                {({ isActive }) => (
                  <img
                    className="border-2"
                    src={`${fullUrl}/${d?.images?.length > 0 && d?.images[0]}` || ""}
                    alt={d?.sku}
                    width={150}
                    height={150}
                  />
                )}
              </SwiperSlide>
            ))}
          </Swiper>

          <div
            className="prev absolute top-2/4 z-10 -mt-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border-200 border-opacity-70 bg-light text-heading shadow-xl transition-all duration-200 hover:border-accent hover:bg-accent hover:text-light ltr:-left-4 rtl:-right-4 md:-mt-5 md:h-9 md:w-9"
            role="button"
          >
            <span className="sr-only">Previous</span>
            <ArrowPrev width={18} height={18} />
          </div>
          <div
            className="next absolute top-2/4 right-0 z-10 -mt-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border-200 border-opacity-70 bg-light text-heading shadow-xl transition-all duration-200 hover:border-accent hover:bg-accent hover:text-light ltr:-right-4 rtl:-left-4 md:-mt-5 md:h-9 md:w-9"
            role="button"
          >
            <span className="sr-only">Next</span>
            <ArrowNext width={18} height={18} />
          </div>

        </div>
        <span className='text-[#6B7280] text-md'>Preview</span>
      </div>
      <div className='text-center items-center flex mt-7 justify-center'>
        <CustomCheckIcon /><span className='ml-2 text-[#6B7280] text-md font-medium'>Project saved successfully! Please check your mail.</span>
      </div>
    </div>
  </div>
  )
}

export default ProjectSaved