import { useMemo, useRef, useState } from 'react';
import BackButton from '@/components/ui/back-button';
import { ThumbsCarousel } from '@/components/ui/thumb-carousel';

import Truncate from '@/components/ui/truncate';
import { scroller } from 'react-scroll';
import CategoryBadges from './category-badges';
import { useRouter } from 'next/router';
import type { Product } from '@/types';
import { useAtom } from 'jotai';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { stickyShortDetailsAtom } from '@/store/sticky-short-details-atom';
import classNames from 'classnames';
import { displayImage } from '@/lib/display-product-preview-images';
import Link from 'next/link';
import { AddToCart } from '../add-to-cart/add-to-cart';
import { selectedItems } from '@/lib/constants/allProducts';
import { drawerAtom } from '@/store/drawer-atom';
import { toast } from 'react-hot-toast';

type Props = {
  product: Product;
  backBtn?: boolean;
  isModal?: boolean;
};
const Details: React.FC<Props> = ({
  product,
  backBtn = true,
  isModal = false,
}) => {
  const {
    sku,
    name,
    images,
    description,
    Options,
    designedBy,
    price,
    dimensions,
    category,
    height,
    width,
    depth,
  } = product ?? {};

  const router = useRouter();
  const { closeModal } = useModalAction();
  const [_, setDisplayCart] = useAtom(drawerAtom);
  const intersectionRef = useRef(null);

  let selectedVariation: any = {};

  const scrollDetails = () => {
    scroller.scrollTo('details', {
      smooth: true,
      offset: -80,
    });
  };

  const onSelection = () => {
    let selectedProductArray;
    if (typeof window !== 'undefined')
      selectedProductArray =
        JSON.parse(localStorage.getItem('selectedProduct')) || [];

    selectedProductArray.push(product);

    let updatedSelectedProductJSON = JSON.stringify(selectedProductArray);

    localStorage.setItem('selectedProduct', updatedSelectedProductJSON);

    router?.push('/selection ');

  };
  const onAddToCart = () => {
    let cartArray;
    if (typeof window !== 'undefined')
      cartArray = JSON.parse(localStorage.getItem('cartItems')) || [];

    let allSku = cartArray?.map((d: any) => d.sku);
    if (allSku?.includes(product?.sku)) {
      toast?.error('Product is already in cart');
    } else {
      cartArray.push(product);
      let updatedCart = JSON.stringify(cartArray);
      localStorage.setItem('cartItems', updatedCart);
      setDisplayCart({ display: true, view: 'cart' });
    }
  };

  //for tab

  const [activeTab, setActiveTab] = useState('productAttributes');

  const handleTabChange = (tabId: any) => {
    setActiveTab(tabId);
  };

  const tabButtonStyles =
    'inline-block rounded-t-lg border-b-2 border-transparent px-4 py-4 text-center text-sm font-medium';
  const activeTabStyles =
    'text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 border-b-5 border-solid  border-[#007562]';

  const inactiveTabStyles = 'text-gray-300 dark:text-gray-600';

  const renderTabContent = (tabId, content) => (
    <div className="pl-10" id={tabId} role="tabpanel">
      <div className="my-5 flex flex-col items-start justify-start gap-3">
        {content}
      </div>
    </div>
  );
  //end for tab


  console.log("product", product);

  return (
    <article className="rounded-lg bg-light">
      <div className="mb-0 ml-8 mt-5 flex items-center justify-between">
        <BackButton />
      </div>

      <div className="flex flex-col border-b border-border-200 border-opacity-70 md:flex-row">
        <div className="p-3 pt-10 md:w-1/2 lg:p-14 xl:p-16">
          <div className="product-gallery h-full">
            <ThumbsCarousel gallery={images} />
          </div>
        </div>

        <div className="flex flex-col items-start p-3 pt-10 md:w-1/2 lg:p-14 xl:p-16">
          <div className="w-full" ref={intersectionRef}>
            <div className="flex w-full items-start justify-between space-x-8 rtl:space-x-reverse">
              <h1
                className={classNames(
                  `text-lg font-semibold tracking-tight text-heading md:text-xl xl:text-3xl`
                )}
              >
                {name}
              </h1>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="block text-sm font-normal text-body">{sku}</span>
            </div>

            <div>
              <h6 className="mt-3 font-medium">As Shown</h6>
              <div className="text-md leading-7 text-body">
                <Truncate
                  character={150}
                  {...(!isModal && {
                    onClick: () => scrollDetails(),
                    compressText: 'common:text-see-more',
                  })}
                >
                  {description}
                </Truncate>
              </div>
            </div>

            <div>
              <h6 className="mt-3 font-medium">Designed By</h6>
              <div className="text-md leading-7 text-body">
                <span>{designedBy}</span>
              </div>
            </div>

            {/* <span className="my-3 flex items-center md:my-5">
              <ins className="text-2xl font-semibold text-accent no-underline md:text-3xl">
                ${price}
              </ins>
            </span> */}

            <CategoryBadges categories={category} onClose={closeModal} />

            <div className="mt-10 flex gap-x-5">
              <div className="mb-3 md:w-2/3 lg:mb-0">
                {/* <button onClick={onSelection} className='flex w-full items-center justify-center rounded bg-accent py-4 px-5 text-sm font-light text-light transition-colors duration-300 hover:bg-accent-hover focus:bg-accent-hover focus:outline-0 lg:text-base'>Add to Selection</button> */}
                <button
                  onClick={onAddToCart}
                  className="flex w-full items-center justify-center rounded bg-accent px-5 py-4 text-sm font-light text-light transition-colors duration-300 hover:bg-accent-hover focus:bg-accent-hover focus:outline-0 lg:text-base"
                >
                  Add to Selection
                </button>
              </div>
              <div className="md:w-1/3">
                <Link href="https://design.rarefurnish.com/">
                  <button className="flex w-full items-center justify-center rounded border-2 border-accent px-5 py-3.5 text-sm font-light text-accent transition-colors duration-300 hover:bg-accent-hover hover:text-white focus:bg-accent-hover focus:outline-0 lg:text-base">
                    Configurator
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-start gap-5 border-b border-t border-border-200 border-opacity-60 px-7">
        <button
          className={`${tabButtonStyles} ${activeTab === 'productAttributes'
            ? activeTabStyles
            : inactiveTabStyles
            }`}
          onClick={() => handleTabChange('productAttributes')}
          role="tab"
          aria-controls="productAttributes"
          aria-selected={activeTab === 'productAttributes'}
        >
          Product Attributes
        </button>
        <button
          className={`${tabButtonStyles} ${activeTab === 'productDescription'
            ? activeTabStyles
            : inactiveTabStyles
            }`}
          onClick={() => handleTabChange('productDescription')}
          role="tab"
          aria-controls="productDescription"
          aria-selected={activeTab === 'productDescription'}
        >
          Product Description
        </button>
      </div>

      {activeTab === 'productAttributes' &&
        renderTabContent(
          'productAttributes',
          <>
            <div className="w-[40%]">
              <table className="min-w-full bg-white border border-gray-300">

                <tbody>
                  <tr>
                    <td className="py-2 px-4 border border-b border-gray-300 bg-[#f4f4f4] font-medium">Product ID</td>
                    <td className="py-2 px-4 border border-b border-gray-300">{sku}</td>

                  </tr>

                  <tr>
                    <td className="py-2 px-4 border border-b border-gray-300 bg-[#f4f4f4] font-medium">Sold By</td>
                    <td className="py-2 px-4 border border-b border-gray-300">Rohan</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border border-b border-gray-300 bg-[#f4f4f4] font-medium">Manufactured By</td>
                    <td className="py-2 px-4 border border-b border-gray-300">{designedBy}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border border-b border-gray-300 bg-[#f4f4f4] font-medium">Size/Weight</td>
                    <td className="py-2 px-4 border border-b border-gray-300 ">{dimensions}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border border-b border-gray-300 bg-[#f4f4f4] font-medium">Color</td>
                    <td className="py-2 px-4 border border-b border-gray-300">Light Gray/Dark Brown</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border border-b border-gray-300 bg-[#f4f4f4] font-medium">Materials</td>
                    <td className="py-2 px-4 border border-b border-gray-300">Fabric/Rubberwood</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border border-b border-gray-300 bg-[#f4f4f4] font-medium">Assembly Required</td>
                    <td className="py-2 px-4 border border-b border-gray-300">Yes</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border border-b border-gray-300 bg-[#f4f4f4] font-medium">Category</td>
                    <td className="py-2 px-4 border border-b border-gray-300">{category}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border border-b border-gray-300 bg-[#f4f4f4] font-medium">Style</td>
                    <td className="py-2 px-4 border border-b border-gray-300">Midcentury</td>
                  </tr>

                </tbody>
              </table>
            </div>
          </>
        )}

      {activeTab === 'productDescription' &&
        renderTabContent(
          'productDescription',
          <>
            <div className="my-5 flex flex-col items-start justify-start gap-3 w-[50%]">
              <h5 className="text-lg font-semibold">Overview</h5>
              <p className='text-body'>Style your living room in absolute sophistication with a charming sofa that
                will bring out the best of your interior space. Our mid-century modern three-seater sofa
                offers cozy tufted waffle stitching and beautifully tapered legs to bring your decor both classic
                style and ultimate comfort. Featuring a low profile design, this sofa stands as a streamlined
                statement piece that can change the whole flow of your interior decor, creating an open, clean space
                for you and your guests to enjoy.
              </p>
              <div className="flex items-start justify-start gap-2">

                <span className="text-md leading-7 text-body">
                  {description}
                </span>
              </div>
            </div>
          </>
        )}
    </article>
  );
};

export default Details;
