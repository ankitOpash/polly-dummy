import InnerPageBanner from '@/components/banners/InnerPageBanner'
import { getLayout } from '@/components/layouts/layout';
import { Swiper, SwiperSlide, Navigation } from '@/components/ui/slider';
import { Image } from '@/components/ui/image';
import { ArrowNext, ArrowPrev } from '@/components/icons';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const ProjectSummary = () => {

  const [cartItems, setCartItems] = useState([]);
  const [displayProduct, setDisplayProduct] = useState({});

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') { let items = JSON?.parse(localStorage?.getItem('cartItems')); setCartItems(items); setDisplayProduct(items?.length && items[0]) };
  }, [typeof window !== 'undefined'])

  let fullUrl;
  if (typeof window !== 'undefined') fullUrl = window.location.origin;

  const breakpoints = {
    320: {
      slidesPerView: 2,
      spaceBetween: 0,
    },
    580: {
      slidesPerView: 3,
      spaceBetween: 16,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 16,
    },
    1920: {
      slidesPerView: 5,
      spaceBetween: 10,
    },
  };
  return (
    <>
      <InnerPageBanner title="Project Summary" />

      {/* ALL PRODUCT SLIDER */}
      <div className="bg-light px-6 py-5 md:py-8 md:px-12">
        <div className='text-center mb-3'>
          <h1 className='sm:text-2xl text-lg font-semibold'>jhone</h1>
          <span className='text-[#747B88] text-md'>jhone@gmail.com</span>
        </div>
        <div className="relative">
          <Swiper
            id="projectSummary"
            breakpoints={breakpoints}
            modules={[Navigation]}
            navigation={{
              nextEl: '.next',
              prevEl: '.prev',
            }}
          >
            {cartItems?.map((d) => (
              <SwiperSlide key={d?.sku}>
                {({ isActive }) => (
                  <img
                    onClick={() => setDisplayProduct(d)}
                    className="border-2 cursor-pointer"
                    src={`${fullUrl}/${d?.images?.length > 0 && d?.images[0]}` || ""}
                    alt={d?.sku}
                    width={250}
                    height={250}
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
      </div>

      {/* SINGLE PRODUCT DETAILS */}
      <div className="mt-7 bg-light px-6 py-5 md:py-8 lg:px-20">
        <div className='xl:w-3/4 w-full grid grid-cols-12 lg:gap-20 gap-5 mx-auto'>

          <div className='md:col-span-5 col-span-12 text-center flex flex-col items-center'>
            <img
              src={`${fullUrl}/${displayProduct?.images?.length > 0 && displayProduct?.images[0]}` || ""}
              className='md:w-full border-2 mb-2 sm:w-[400px] w-[250px]'
            />
            <span className='text-[#6B7280] font-md font-medium'>View in AR</span>
          </div>

          <div className='md:col-span-7 col-span-12'>
            <div className="flex w-full items-start justify-between space-x-8 rtl:space-x-reverse">
              <h1
                className={classNames(
                  `text-lg font-semibold tracking-tight text-heading md:text-xl xl:text-3xl`
                )}
              >{displayProduct?.name}</h1>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="block text-sm font-normal text-body">
                SKU: {displayProduct?.sku}
              </span>
            </div>

            <span className="my-3 flex items-center">
              <ins className="text-2xl font-semibold text-accent no-underline md:text-3xl">
                ${displayProduct?.price}
              </ins>
            </span>

            <div className='border-b border-border-200 border-opacity-60 py-1'>
              <h5 className='font-medium'>Product Attributes</h5>
            </div>


            <div className='my-5'>
              <h5 className='font-medium'>Overview</h5>
              <span className='text-md leading-7 text-body'>{displayProduct?.description}</span>
            </div>
            <div className='my-5'>
              <h5 className='font-medium'>Height</h5>
              <span className='text-md leading-7 text-body'>{displayProduct?.height}</span>
            </div>
            <div className='my-5'>
              <h5 className='font-medium'>Width</h5>
              <span className='text-md leading-7 text-body'>{displayProduct?.width}</span>
            </div>
            <div className='my-5'>
              <h5 className='font-medium'>Depth</h5>
              <span className='text-md leading-7 text-body'>{displayProduct?.depth}</span>
            </div>
            <div className='mt-5 mb-10'>
              <h5 className='font-medium'>Dimension</h5>
              <span className='text-md leading-7 text-body'>{displayProduct?.dimensions}</span>
            </div>
            <button className='border-accent border-[1.7px] rounded-md py-3 md:w-3/5 w-full text-accent bg-transparent hover:bg-accent hover:text-light transition duration-300 ease-in-out'>Download Specification</button>
          </div>
        </div>
      </div>
    </>
  )
}
ProjectSummary.getLayout = getLayout;
export default ProjectSummary