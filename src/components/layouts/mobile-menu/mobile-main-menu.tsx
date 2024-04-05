import { useRouter } from 'next/router';
import { Routes } from '@/config/routes';

import DrawerWrapper from '@/components/ui/drawer/drawer-wrapper';
import { useAtom } from 'jotai';
import { drawerAtom } from '@/store/drawer-atom';

const headerLinks = [
  { href: Routes.shops, icon: null, label: 'Brand' },
  { href: Routes.coupons, icon: null, label: 'About' },
  { href: Routes.help, label: 'Contact us' },
];

export default function MobileMainMenu() {

  const router = useRouter();
  const [_, closeSidebar] = useAtom(drawerAtom);

  function handleClick(path: string) {
    router.push(path);
    closeSidebar({ display: false, view: '' });
  }

  return (
    <DrawerWrapper>
      <ul className="grow">
        {headerLinks.map(({ href, label }) => (
          <li key={`${href}${label}`}>
            <button
              onClick={() => handleClick(href)}
              className="flex cursor-pointer items-center py-3 px-5 text-sm font-semibold capitalize text-heading transition duration-200 hover:text-accent md:px-8"
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </DrawerWrapper>
  );
}
