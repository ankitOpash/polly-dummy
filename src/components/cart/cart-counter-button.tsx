import CartCheckBagIcon from '@/components/icons/cart-check-bag';
import { formatString } from '@/lib/format-string';
import usePrice from '@/lib/use-price';
import { drawerAtom } from '@/store/drawer-atom';
import { useCart } from '@/store/quick-cart/cart.context';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';

const CartCounterButton = () => {
  const [_, setDisplayCart] = useAtom(drawerAtom);
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    if (typeof window !== 'undefined' || localStorage?.getItem('cartItems')) setCartItems(JSON?.parse(localStorage?.getItem('cartItems')));
  }, [typeof window !== 'undefined', localStorage?.getItem('cartItems')])

  function handleCartSidebar() {
    setDisplayCart({ display: true, view: 'cart' });
  }
  return (
    <button
      className="product-cart fixed top-1/2 z-40 -mt-12 hidden flex-col items-center justify-center rounded bg-accent p-3 pt-3.5 text-sm font-semibold text-light shadow-900 transition-colors duration-200 hover:bg-accent-hover focus:outline-0 right-0 rounded-tr-none rounded-br-none rtl:left-0 rtl:rounded-tl-none rtl:rounded-bl-none lg:flex"
      onClick={handleCartSidebar}
    >
      <span className="flex pb-0.5">
        <CartCheckBagIcon className="shrink-0" width={14} height={16} />
        <span className="flex ml-2 rtl:mr-2">
          Item
        </span>
      </span>
      <span className="mt-3 w-full rounded bg-light px-2 py-2 text-accent">
        {cartItems ? cartItems?.length : 0}
      </span>
    </button>
  );
};

export default CartCounterButton;
