import type { NextPageWithLayout } from '@/types';
import { getLayout } from '@/components/layouts/layout';
import InnerPageBanner from '@/components/banners/InnerPageBanner';
import Counter from '@/components/ui/counter';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { selectedItems } from '@/lib/constants/allProducts';

// NEED TO CHANGE //
const SelectedItems: NextPageWithLayout = () => {

  const { openModal } = useModalAction();
  let Product = [];

  if (typeof window !== 'undefined') Product = JSON.parse(localStorage?.getItem('cartItems'));

  let totalPrice = 0;

  Product?.map((product) => {
    totalPrice += parseFloat(product?.price);
  })

  return (
    <div className='bg-light'>
      <InnerPageBanner title="Your Selected Items" isCartBanner={true} />

      {/* HEADER */}
      <div className='mt-7 border-b-[1.5px] pb-1 sm:block hidden'>
        <ul className='grid grid-cols-6 gap-3 md:w-3/4 w-full px-3 md:px-0 mx-auto'>
          <li className='col-span-3'><span>Item</span></li>
          <li className='col-span-1'><span>Price</span></li>
          <li className='sm:col-span-1 col-span-2'><span>Quantity</span></li>
          <li className='col-span-1'><span>Total</span></li>
        </ul>
      </div>

      {/* ALL PRODUCT */}
      <div>
        {Product?.map((product: any) => (
          <div key={product.id} className='border-b-[1.5px] grid grid-cols-6 gap-3 md:w-3/4 w-full px-3 md:px-0 mx-auto py-5 items-center'>

            <div className='sm:col-span-3 col-span-6 grid sm:grid-cols-3 grid-cols-6 sm:gap-5 gap:3'>
              <div className='sm:col-span-1 col-span-2'>
                <img className='sm:w-[170px] w-[100px] border-[1.5px] border-gray-250' src={product?.images[0] || ""} alt="" />
              </div>
              <div className='sm:col-span-2 col-span-3 flex flex-col justify-center'>
                <span className='text-[#6B7280] text-sm'>{product?.sku}</span>
                <span className='mt-1 mb-2 text-md font-semibold'>{product?.name}</span>
                <span className='text-[#6B7280] md:text-md text-sm'>1 X 1 pc(s)</span>
              </div>
            </div>
            <div className='sm:col-span-1 col-span-6 sm:block flex'>
              <span className='font-[15px] sm:hidden block mr-2'>Price: </span> <span className='font-semibold font-[15px]'>${product?.price}</span>
            </div>
            <div className='sm:col-span-1 col-span-6 sm:block flex'>
              <span className='font-[15px] sm:hidden block mr-2'>Quantity: </span>
              <Counter
                value={0}
                onDecrement={() => { }}
                onIncrement={() => { }}
                disabled={false}
                variant="cart"
              />
            </div>
            <div className='sm:col-span-1 col-span-6 sm:block flex'>
              <span className='font-[15px] sm:hidden block mr-2'>Total: </span><span className='font-semibold font-[15px]'>${product?.price}</span>
            </div>
          </div>
        ))}

        {/* SUBTOTAL */}
        <div className='grid grid-cols-6 gap-3 md:w-3/4 w-full px-3 md:px-0 mx-auto py-5 items-center'>

          <div className='sm:col-span-3 col-span-0 hidden sm:block'></div>
          <div className='sm:col-span-1 col-span-0 hidden sm:block'></div>
          <div className='sm:col-span-1 col-span-1 text-right'><span className='font-semibold text-md text-[#7C7F90]'>Subtotal:</span></div>
          <div className='sm:col-span-1 col-span-2 text-left'>
            <span className='font-semibold font-[15px] ml-2'>${totalPrice}</span>
          </div>
        </div>

        <div className='grid grid-cols-6 gap-3 md:w-3/4 w-full px-3 md:px-0 mx-auto py-5 items-center'>
          <div className='sm:col-span-3 col-span-0 hidden sm:block'></div>
          <div className='sm:col-span-1 col-span-0 hidden sm:block'></div>
          <div className='sm:col-span-2 col-span-3 flex justify-end'><button className='bg-accent rounded-md py-2.5 w-80 text-light' onClick={() => openModal('FINALIZE_SELECTION')}>Finalize Selection</button></div>
        </div>

      </div>
    </div>
  );
};
SelectedItems.getLayout = getLayout;
export default SelectedItems;
