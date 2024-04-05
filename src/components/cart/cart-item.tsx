import { Image } from '@/components/ui/image';
import { motion } from 'framer-motion';
import { siteSettings } from '@/config/site';
import Counter from '@/components/ui/counter';
import { CloseIcon } from '@/components/icons/close-icon';
import { fadeInOut } from '@/lib/motion/fade-in-out';
import usePrice from '@/lib/use-price';
import { useCart } from '@/store/quick-cart/cart.context';

interface CartItemProps {
  item: any;
  clearItemFromCart: any
}

const CartItem = ({ item, clearItemFromCart }: CartItemProps) => {

  let fullUrl;
  if (typeof window !== 'undefined') fullUrl = window.location.origin;

  return (
    <motion.div
      layout
      initial="from"
      animate="to"
      exit="from"
      variants={fadeInOut(0.25)}
      className="flex items-center border-b border-solid border-border-200 border-opacity-75 px-4 py-4 text-sm sm:px-6"
    >
      <div className="flex-shrink-0">
        <Counter
          value={1}
          onDecrement={() => { }}
          onIncrement={() => { }}
          variant="pillVertical"
        />
      </div>

      <div className="relative mx-4 flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden bg-gray-100 sm:h-16 sm:w-16">
        <img
          src={`${fullUrl}/${item?.images?.length > 0 && item?.images[0]}` || ''}
          alt={item?.name}
          // fill
          sizes="(max-width: 768px) 100vw"
          className="object-contain"
        />
      </div>
      <div>
        {/* <h3 className="font-bold text-heading">{item.name}</h3> */}
        <h3 className="font-bold text-heading">{item.name} </h3>
        <p className="my-2.5 font-semibold text-accent">${item?.price}</p>
        {/* <span className="text-xs text-body">
          {item?.quantity} X {item?.unit}
        </span> */}
      </div>
      <span className="font-bold text-heading ml-auto rtl:mr-auto">
        ${item?.price}
      </span>
      <button
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted transition-all duration-200 hover:bg-gray-100 hover:text-red-600 focus:bg-gray-100 focus:text-red-600 focus:outline-0 ml-3 -mr-2 rtl:mr-3 rtl:-ml-2"
        onClick={() => clearItemFromCart(item?.sku)}
      >
        <span className="sr-only">close</span>
        <CloseIcon className="h-3 w-3" />
      </button>
    </motion.div>
  );
};

export default CartItem;
