import ArrowNarrowLeft from '@/components/icons/arrow-narrow-left';
import { useRouter } from 'next/router';
import cn from 'classnames';



const BackButton = ({ color: color }: { color?: string }) => {
  const router = useRouter();

  return (
    <button
      className={cn("inline-flex items-center justify-center font-semibold text-accent transition-colors hover:text-accent-hover focus:text-accent-hover focus:outline-0", { 'text-light': color })}
      onClick={router.back}
    >
      <ArrowNarrowLeft
        className={cn('h-5 w-5 mr-2 rtl:ml-2', {
          'rotate-180 transform':
            router.locale === 'ar' || router.locale === 'he',
        })}
        strokeWidth={1.7}
      />
      Back
    </button>
  );
};

export default BackButton;
