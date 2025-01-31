import { InputHTMLAttributes } from 'react';
import cn from 'classnames';
import { SearchIcon } from '@/components/icons/search-icon';
import { CloseIcon } from '@/components/icons/close-icon';
import { ScanIcon } from '@/components/icons/scan-icon';


export interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label: string;
  isScanIcon: Boolean;
  variant?: 'minimal' | 'normal' | 'with-shadow' | 'flat';
  onSubmit: (e: any) => void;
  onClearSearch: (e: any) => void;
}

const classes = {
  normal:
    'bg-light pl-6 rtl:pr-6 pr-14 rtl:pl-14 rounded-tr-none rtl:rounded-tl-none rounded-br-none rtl:rounded-bl-none  border border-r-0 rtl:border-l-0 border-transparent focus:border-accent',
  minimal:
    'search-minimal bg-gray-100 pl-10 rtl:pr-10 pr-4 rtl:pl-4 md:pl-14 rtl:md:pr-14 border border-transparent focus:border-accent focus:bg-light',
  flat: 'bg-white pl-10 rtl:pr-10 pr-4 rtl:pl-4 md:pl-14 rtl:md:pr-14 border-0',
  'with-shadow':
    'search-with-shadow bg-light pl-10 rtl:pr-10 pr-12 rtl:pl-12 md:pl-14 rtl:md:pr-14 focus:bg-light border-0',
};

const SearchBox: React.FC<Props> = ({
  className,
  label,
  onSubmit,
  onClearSearch,
  variant = 'normal',
  value,
  isScanIcon,
  ...rest
}) => {

  return (
    <form onSubmit={onSubmit} className={cn('w-full', className)}>
      <div
        className={cn('relative flex rounded md:rounded-lg', {
          'h-14 shadow-900': variant === 'normal',
          'h-11 md:h-12': variant === 'minimal',
          'h-auto !rounded-none': variant === 'flat',
          'h-16 shadow-downfall': variant === 'with-shadow',
        })}
      >
        <label htmlFor={label} className="sr-only">
          {label}
        </label>

        <input
          id={label}
          type="text"
          value={value}
          autoComplete="off"
          className={cn(
            'search item-center flex h-full w-full appearance-none overflow-hidden truncate rounded-lg text-sm text-heading placeholder-gray-500 transition duration-300 ease-in-out focus:outline-0 focus:ring-0',
            {
              'placeholder:text-slate-400': variant === 'flat',
            },
            classes[variant]
          )}
          {...rest}
        />

        {value && (
          <button
            type="button"
            onClick={onClearSearch}
            className={cn(
              'absolute flex h-full w-10 cursor-pointer items-center justify-center text-body transition-colors duration-200 hover:text-accent-hover focus:text-accent-hover focus:outline-0 md:w-14',
              {
                'right-36 rtl:left-36': variant === 'normal',
                'right-0 rtl:left-0': variant !== 'normal',
              }
            )}
            style={{ right: '160px' }}
          >
            <span className="sr-only">close</span>
            <CloseIcon className="h-3.5 w-3.5 md:h-3 md:w-3" />
          </button>
        )}

        {isScanIcon && <div style={{
          position: 'absolute',
          right: '150px',
          top: '50%',
          transform: 'translateY(-50%)'
        }}>
          <ScanIcon className="h-5 w-5 mr-2.5 rtl:ml-2.5" />
        </div>}

        {variant === 'normal' ? (
          <button className="flex h-full min-w-[143px] items-center justify-center rounded-lg bg-accent px-8 font-semibold text-light transition-colors duration-200 hover:bg-accent-hover focus:bg-accent-hover focus:outline-0 rounded-tl-none rounded-bl-none rtl:rounded-tr-none rtl:rounded-br-none">
            <SearchIcon className="h-4 w-4 mr-2.5 rtl:ml-2.5" />
            Search
          </button>
        ) : (
          <button className="absolute flex h-full w-10 items-center justify-center text-body transition-colors duration-200 hover:text-accent-hover focus:text-accent-hover focus:outline-0 left-0 rtl:right-0 md:w-14">
            <span className="sr-only">Search</span>
            <SearchIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBox;
