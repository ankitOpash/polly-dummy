import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import CartCheckBagIcon from '@/components/icons/cart-check-bag';
import EmptyCartIcon from '@/components/icons/empty-cart';
import { CloseIcon } from '@/components/icons/close-icon';
import CartItem from '@/components/cart/cart-item';
import { fadeInOut } from '@/lib/motion/fade-in-out';
import usePrice from '@/lib/use-price';
import { useCart } from '@/store/quick-cart/cart.context';
import { formatString } from '@/lib/format-string';
import { useAtom } from 'jotai';
import { drawerAtom } from '@/store/drawer-atom';
import { useModalAction } from '../ui/modal/modal.context';
import { useEffect, useState } from 'react';

const CartSidebarView = () => {

  const [cartItems, setCartItems] = useState([])

  const [_, closeSidebar] = useAtom(drawerAtom);

  const router = useRouter();

  function handleCheckout() {
    router.push('/selection');
    closeSidebar({ display: false, view: '' })
  }
  useEffect(() => {
    if (typeof window !== 'undefined') setCartItems(JSON?.parse(localStorage?.getItem('cartItems')));
  }, [typeof window !== 'undefined'])


  let totalPrice = 0;

  cartItems?.map((product) => {
    totalPrice += parseFloat(product?.price);
  })

  const clearItemFromCart = (sku: any) => {
    let filterCart = cartItems?.filter((d) => d?.sku !== sku);
    setCartItems(filterCart)
    localStorage?.setItem('cartItems', JSON?.stringify(filterCart));
  }

  return (
    <section className="relative flex h-full flex-col">
      <header className="fixed top-0 z-10 flex w-full max-w-md items-center justify-between border-b border-border-200 border-opacity-75 bg-light px-6 py-4">
        <div className="flex font-semibold text-accent">
          <CartCheckBagIcon className="shrink-0" width={24} height={22} />
          <span className="flex ml-2 rtl:mr-2">
            {cartItems?.length} Item
          </span>
        </div>
        <button
          onClick={() => closeSidebar({ display: false, view: '' })}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-muted transition-all duration-200 hover:bg-accent hover:text-light focus:bg-accent focus:text-light focus:outline-0 ml-3 -mr-2 rtl:mr-3 rtl:-ml-2"
        >
          <span className="sr-only">close</span>
          <CloseIcon className="h-3 w-3" />
        </button>
      </header>
      {/* End of cart header */}

      <motion.div layout className="grow pt-16 pb-20">
        {cartItems?.length > 0 ? (
          cartItems?.map((item: any) => <CartItem item={item} key={item?.sku} clearItemFromCart={clearItemFromCart} />)
        ) : (
          <motion.div
            layout
            initial="from"
            animate="to"
            exit="from"
            variants={fadeInOut(0.25)}
            className="flex h-full flex-col items-center justify-center"
          >
            <EmptyCartIcon width={140} height={176} />
            <h4 className="mt-6 text-base font-semibold">
              No products found
            </h4>
          </motion.div>
        )}
      </motion.div>
      {/* End of cart items */}

      <footer className="fixed bottom-0 z-10 w-full max-w-md bg-light px-6 py-5">
        <button
          className="flex h-12 w-full justify-between rounded-full bg-accent p-1 text-sm font-bold shadow-700 transition-colors hover:bg-accent-hover focus:bg-accent-hover focus:outline-0 md:h-14"
          onClick={handleCheckout}
          disabled={!cartItems}
        >
          <span className="flex h-full flex-1 items-center px-5 text-light">
            Checkout
          </span>
          <span className="flex h-full shrink-0 items-center rounded-full bg-light px-5 text-accent">
            ${totalPrice}.00
          </span>
        </button>
      </footer>
      {/* End of footer */}
    </section>
  );
};

export default CartSidebarView;
