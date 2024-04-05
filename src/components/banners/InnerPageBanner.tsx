import React from 'react';
import cn from 'classnames';
import { Image } from '@/components/ui/image';
import BackButton from '../ui/back-button';
import { CloseIcon } from '../icons/close-icon';
import Banner from "../../assets/img/banners/configurator.jpg"
type InnerPageBannerProps = {
  title: string;
  isCartBanner?: Boolean;
};

const InnerPageBanner: React.FC<InnerPageBannerProps> = ({ title, isCartBanner }) => (
  <>
    <div className='relative home-banner'>

      <div>
        <Image src={Banner} className='w-full h-32 object-cover' alt='banner' />
      </div>

      <div className='absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 z-10'>
        <h1 className={cn('text-lg md:text-xl font-bold tracking-tight lg:text-2xl xl:text-3xl text-white', { "d-none": true })}>{title}</h1>
      </div>
      {isCartBanner &&
        <CloseIcon className='sm:w-[40px] w-[20px] text-light absolute sm:right-[10%] right-[1%] top-[50%] -translate-x-1/2 -translate-y-1/2 z-10' />
      }
      <div className="z-10 text-light absolute top-[10px] sm:left-[30px] left-[10px]">
        <BackButton color="text-light" />
      </div>
    </div>
  </>
);

export default InnerPageBanner;
