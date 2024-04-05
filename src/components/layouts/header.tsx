import Logo from '@/components/ui/logo';
import cn from 'classnames';
import StaticMenu from '@/components/layouts/menu/static-menu';
import { useAtom } from 'jotai';
import { displayMobileHeaderSearchAtom } from '@/store/display-mobile-header-search-atom';

import dynamic from 'next/dynamic';
import { authorizationAtom } from '@/store/authorization-atom';
import { useIsHomePage } from '@/lib/use-is-homepage';
import { useMemo, useState } from 'react';
import GroupsDropdownMenu from '@/components/layouts/menu/groups-menu';
import { useHeaderSearch } from '@/layouts/headers/header-search-atom';
import { locationAtom } from '@/lib/use-location';
import { MapPin } from '@/components/icons/map-pin';
import Button from '@/components/ui/button';
import LocationBasedShopForm from '@/components/form/location-based-shop-form';
import { ArrowDownIcon } from '@/components/icons/arrow-down';
import Search from '../ui/search/search';
import Link from '../ui/link';

const AuthorizedMenu = dynamic(() => import('./menu/authorized-menu'), {
  ssr: false,
});
const JoinButton = dynamic(() => import('./menu/join-button'), { ssr: false });

const Header = ({ layout }: { layout?: string }) => {

  const { show, hideHeaderSearch } = useHeaderSearch();
  const [displayMobileHeaderSearch] = useAtom(displayMobileHeaderSearchAtom);
  const [isAuthorize] = useAtom(authorizationAtom);
  const [openDropdown, setOpenDropdown] = useState(false);
  const isHomePage = useIsHomePage();
  // useEffect(() => {
  //   if (!isHomePage) {
  //     hideHeaderSearch();
  //   }
  // }, [isHomePage]);
  const isFlattenHeader = useMemo(
    () => !show && isHomePage && layout !== 'modern',
    [show, isHomePage, layout]
  );

  const [location] = useAtom(locationAtom);
  const getLocation = location?.street_address
    ? location?.street_address
    : location?.formattedAddress;
  const closeLocation = () => setOpenDropdown(false);

  return (
    <header
      className={cn('site-header-with-search top-0 z-50 w-full lg:h-22 bg-white', {
        '': isFlattenHeader,
        'sticky lg:fixed': isHomePage,
        'sticky border-b border-border-200 shadow-sm': !isHomePage,
      })}
    >
      <div
        className={cn(
          'fixed inset-0 -z-10 h-[100vh] w-full bg-black/50',
          openDropdown === true ? '' : 'hidden'
        )}
      ></div>
      <div>
        <div
          className={cn(
            ' flex w-full transform-gpu items-center justify-between bg-light transition-transform duration-300 lg:h-22 lg:px-4 xl:px-8',
            {
              'lg:absolute lg:border-0 lg:bg-transparent lg:shadow-none':
                isFlattenHeader,
              'lg:!bg-light': openDropdown,
            }
          )}
        >
          <div className="flex w-full shrink-0 grow-0 basis-auto flex-col items-center lg:w-auto lg:flex-row">
            <Logo
              className={cn(
                'pt-2 pb-3',
                'ml-0 rtl:mr-0'
              )}
            />

          </div>

          {isHomePage ? (
            <>
              {displayMobileHeaderSearch && (
                <div className="absolute top-0 block h-full w-full bg-light px-5 pt-1.5 left-0 rtl:right-0 md:pt-2 lg:hidden">
                  <Search label={'grocery search at header'} variant="minimal" />
                </div>
              )}
            </>
          ) :
            <div className="mx-auto hidden w-full overflow-hidden px-10 lg:block xl:w-11/12 2xl:w-10/12">
              <Search label={'grocery search at header'} variant="minimal" />
            </div>}
          <ul className="hidden shrink-0 items-center space-x-7 rtl:space-x-reverse lg:flex 2xl:space-x-10">
            <StaticMenu />
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Link
                href="/profile"
                className="inline-flex h-9 shrink-0 items-center justify-center rounded border border-transparent bg-accent px-3 py-0 text-sm font-semibold leading-none text-light outline-none transition duration-300 ease-in-out hover:bg-accent-hover focus:shadow focus:outline-none focus:ring-1 focus:ring-accent-700"
              >
                Johne
              </Link>
            </div>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
