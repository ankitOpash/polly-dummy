import React, { useState } from 'react';
import Link from 'next/link';
import { Carousel } from 'react-responsive-carousel';
import { useAtom } from 'jotai';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import type { Product } from '@/types';
import cn from 'classnames';
import { allProduct } from '@/lib/constants/allProducts';
import { ThumbsCarousel } from '@/components/ui/thumb-carousel';
import { drawerAtom } from '@/store/drawer-atom';
import FeaturedProductsSlider from './thub-oo/FeaturedProductsSlider';
import ProductImageGallery from './thub-oo/FeaturedProductsSlider';
import ReactStars from 'react-rating-star-with-type'
interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsShow, setIsDetailsShow] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [_, setDisplayCart] = useAtom(drawerAtom);

  const handleProductQuickView = () => {
    const foundProduct = allProduct.find((p) => p.sku === product.sku);
    if (foundProduct) {
      setIsModalOpen(true);
      setCurrentProduct(foundProduct);
    }
  };

  const handleDetailsShow = () => {
    setIsDetailsShow((prevIsDetailsShow) => !prevIsDetailsShow);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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

  const productImageSrc = images?.[0] || productPlaceholder;

  const onAddToCart = () => {
    let cartArray;
    if (typeof window !== 'undefined')
      cartArray = JSON.parse(localStorage.getItem('cartItems')) || [];

    let allSku = cartArray?.map((d: any) => d.sku);
    if (allSku?.includes(product?.sku)) {
      toast && toast.error('Product is already in cart');
    } else {
      cartArray.push(product);
      let updatedCart = JSON.stringify(cartArray);
      localStorage.setItem('cartItems', updatedCart);
      setDisplayCart({ display: true, view: 'cart' });
    }
  };

  const handleNextProduct = () => {
    setCurrentProduct((prevProduct) => {
      const currentIndex = allProduct.findIndex((p) => p.sku === prevProduct?.sku);
      const nextIndex = (currentIndex + 1) % allProduct.length;
      return allProduct[nextIndex];
    });
  };

  const handlePreviousProduct = () => {
    setCurrentProduct((prevProduct) => {
      const currentIndex = allProduct.findIndex((p) => p.sku === prevProduct?.sku);
      const prevIndex = (currentIndex - 1 + allProduct.length) % allProduct.length;
      return allProduct[prevIndex];
    });
  };
  const [star, setStar] = useState(5);

  const onChange = (nextValue) => {
    setStar(nextValue)
  }

  return (
    <>
      <article
        className={cn(
          'product-card cart-type-neon h-full transform overflow-hidden rounded border border-border-200 bg-light shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow neon'
        )}
      >
        <div
          className="relative flex h-48 w-auto cursor-pointer items-center justify-center sm:h-64"
          onClick={handleProductQuickView}
        >
          <span className="sr-only">Product Image</span>
          <img
            src={productImageSrc}
            alt={name}
            sizes="(max-width: 768px) 100vw"
            className="product-image object-contain"
            style={{
              position: 'absolute',
              height: '100%',
              width: '100%',
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              color: 'transparent',
            }}
          />
          {category && (
            <span className="absolute left-2 top-2 bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">{category}</span>
          )}
        </div>

        <header className="p-3 md:p-6">
          <h3
            className="mb-2 cursor-pointer truncate text-xs text-body md:text-sm"
          >
            {sku}
          </h3>
          <div className="mb-2 flex">
            <span className="text-sm font-semibold text-heading md:text-base">
              {name}
            </span>
          </div>
        </header>
      </article>

      {isModalOpen && (
        <div
          id="authentication-modal"
          tabIndex={-1}
          aria-hidden="true"
          className="fixed inset-0 backdrop-blur-sm overflow-y-auto overflow-x-hidden z-50 flex items-center justify-center"
        >
          <div className="relative p-4">
            <div className="relative bg-[#FFFFFF] rounded-lg shadow h-[60rem] lg:w-[60rem] xl:w-[95rem]">
              <div className="flex items-center justify-between p-1 md:p-5 border-b rounded-t lg:p-7">
                <h3 className="text-xl font-semibold text-gray-900">
                  Product Information
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  onClick={closeModal}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex flex-col gap-2 justify-start items-start ">
                <div className="flex justify-end items-end gap-3 w-full lg:p-2">
                  <button
                    onClick={handleDetailsShow}
                    className={cn(
                      'text-white focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none',
                      isDetailsShow ? 'bg-red-500' : 'bg-[#009F7F]'
                    )}
                  >
                    {isDetailsShow ? 'Hide Deatils' : 'View Deatils'}
                  </button>
                  <button
                    onClick={onAddToCart}
                    className="text-white bg-[#009F7F] focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none"
                  >
                    Add To Cart
                  </button>
                </div>

                <div className=" flex justify-center items-start relative w-full h-full p-1 gap-2">
                  {!isDetailsShow && (<div className='flex justify-center items-center '>
                    <img
                      src={currentProduct.images[0]}
                      alt={name}
                      className="w-[96%] h-[48rem] object-cover"
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                  </div>)}



                  {isDetailsShow && (<ProductImageGallery images={currentProduct?.images || []} />)}

                  <FaChevronLeft onClick={handlePreviousProduct} className='text-4xl cursor-pointer text-[#009F7F] absolute left-4 top-72' />
                  <FaChevronRight onClick={handleNextProduct} className='text-4xl cursor-pointer text-[#009F7F] absolute right-4 top-72' />

                  {category && (
                    <span className="absolute left-3 top-2 bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">{currentProduct?.category}</span>
                  )}
                  {isDetailsShow && (
                    <>
                      <div className="flex flex-col justify-start items-start  lg:w-1/2 lg:h-[38.5rem] gap-2 px-11 py-9 border border-solid">


                        <div className="flex items-start justify-start gap-2 px-2">
                          <h1
                            className="text-lg font-semibold tracking-tight text-heading md:text-xl xl:text-3xl"
                          >
                            {currentProduct?.name}
                          </h1>

                        </div>

                        <div className='px-2'>
                          <ReactStars
                            onChange={onChange}
                            value={4}
                            edit={true}
                            activeColors={["#9177FF", "#8568FC",]}
                          />
                        </div>
                        <div className='px-2 flex justify-center items-end gap-2'>
                          <h1 className="text-lg font-semibold tracking-tight text-heading md:text-xl xl:text-3xl">
                            <span>&#8377;{currentProduct?.price}</span>

                          </h1>
                          <small><del>&#8377;6000</del> </small>
                          <span className="text-green-800 font-medium">40% Off</span>
                        </div>
                        <div className='flex '>
                          <span className="bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Sale</span>
                          <label className='text-body'>Lowest Price in 30 Days</label>
                        </div>
                        <div className="flex flex-col items-start justify-start gap-3">
                          <h1 className="text-lg font-semibold tracking-tight text-heading md:text-xl xl:text-2xl cursor-pointer transition-colors hover:text-accent">Dimensions</h1>
                          <div className="flex items-start justify-start gap-2 px-2">
                            <h4>Height -</h4>
                            <span className="text-md leading-7 text-body">
                              {currentProduct?.height}
                            </span>
                          </div>
                          <div className="flex items-start justify-start gap-2 px-2">
                            <h4>Width uuuuuu-</h4>
                            <span className="text-md leading-7 text-body">
                              {currentProduct?.width}
                            </span>
                          </div>
                          <div className="flex items-start justify-start gap-2 px-2">
                            <h4>Depth -</h4>
                            <span className="text-md leading-7 text-body">
                              {currentProduct?.depth}
                            </span>
                          </div>
                          <div className="flex items-start justify-start gap-2 px-2">
                            <h4>Dimension -</h4>
                            <span className="text-md leading-7 text-body">
                              {currentProduct?.dimensions}
                            </span>
                          </div>
                        </div>
                        <Link
                          href={`/product/${sku}`}
                          className="text-white bg-[#009F7F] focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none"
                        >
                          Read more
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div >
      )}
    </>
  );
};

export default ProductCard;
