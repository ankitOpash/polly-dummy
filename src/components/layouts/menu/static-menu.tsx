import Link from '@/components/ui/link';
import { Routes } from '@/config/routes';


const headerLinks = [
  { href: Routes.shops, icon: null, label: 'Brand' },
  { href: Routes.coupons, icon: null, label: 'About' },
  { href: Routes.help, label: 'Contact us' },
];

const StaticMenu = () => {


  return (
    <>
      {headerLinks.map(({ href, label, icon }) => (
        <li key={`${href}${label}`}>
          <Link
            href={href}
            className="flex items-center font-normal text-heading no-underline transition duration-200 hover:text-accent focus:text-accent"
          >
            {icon && <span className="mr-2 rtl:ml-2">{icon}</span>}
            {label}
          </Link>
        </li>
      ))}
    </>
  );
};

export default StaticMenu;
