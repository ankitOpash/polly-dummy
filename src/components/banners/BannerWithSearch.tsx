import cn from 'classnames';
import { Image } from '@/components/ui/image';
import Search from '@/components/ui/search/search';
import type { Banner } from '@/types';
import HomeBanner from "../../assets/img/banners/home.jpg"

interface BannerProps {
  banners: Banner[] | undefined;
  layout?: string;
}

const BannerWithSearch = () => {

  return (
    <div
      className={cn('textClass relative hidden lg:block')}
    >
      <div className="-z-1 overflow-hidden">
        <div className="relative">
          <div
            className={cn('relative h-[60vh] w-full home-banner')}
          >
            <Image
              className="h-full min-h-140 w-full object-cover"
              src={HomeBanner}
              alt="banner"
              fill
              sizes="(max-width: 768px) 30vw"
            />
            <div
              className={cn('absolute inset-0 mt-8 flex w-full flex-col items-center justify-center p-5 text-center md:px-20 lg:space-y-10 z-10')}
            >
              <h1
                className={cn(
                  'text-2xl font-bold tracking-tight text-heading lg:text-4xl xl:text-5xl text-white')}
              >
                Exclusive Designs Made Only For You
              </h1>
              <p className="text-sm text-heading lg:text-base xl:text-lg text-white">
                Make your house a home with our wide collection of beautiful furniture
              </p>
              <div className="w-full max-w-3xl">
                <Search label="search" isScanIcon={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerWithSearch;
