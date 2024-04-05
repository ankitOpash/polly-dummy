import { Image } from '@/components/ui/image';
import cn from 'classnames';
import Link from '@/components/ui/link';
import LogoImg from "../../assets/logo.png"

const Logo: React.FC<React.AnchorHTMLAttributes<{}>> = ({
  className,
  ...props
}) => {
  // const {
  //   settings: { logo, siteTitle },
  // }: any = useSettings();
  return (
    <Link href="/" className={cn('inline-flex', className)} {...props}>
      <span className="relative h-10 w-32 overflow-hidden md:w-40">
        <Image
          src={LogoImg}
          alt='Logo'
          fill
          sizes="(max-width: 768px) 100vw"
          loading="eager"
          className="object-contain"
        />
      </span>
    </Link>
  );
};

export default Logo;
