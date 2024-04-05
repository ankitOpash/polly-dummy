import type { AppProps } from 'next/app';
import '@/assets/css/main.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { NextPageWithLayout } from '@/types';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../apollo/client/client'
import { ModalProvider } from '@/components/ui/modal/modal.context';
import { SearchProvider } from '@/components/ui/search/search.context';
import { CartProvider } from '@/store/quick-cart/cart.context';
import ManagedModal from '@/components/ui/modal/managed-modal';
import ManagedDrawer from '@/components/ui/drawer/managed-drawer';
import { Toaster } from 'react-hot-toast';
import "react-responsive-carousel/lib/styles/carousel.min.css";
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({
  Component,
  pageProps: {
    session,
    ...pageProps
  },
}: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page)
  const apolloClient = useApollo(pageProps.initialApolloState)

  return (

    <ApolloProvider client={apolloClient}>
      <SearchProvider>
        <ModalProvider>
          <CartProvider>
            <>
              {getLayout(<Component {...pageProps} />)}
              <Toaster
                position="top-center"
                reverseOrder={false}
                gutter={8}
                containerClassName=""
                containerStyle={{}}
                toastOptions={{
                  className: '',
                  duration: 5000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },

                  success: {
                    duration: 3000,
                    theme: {
                      primary: 'green',
                      secondary: 'black',
                    },
                  },
                }}
              />
              <ManagedModal />
              <ManagedDrawer />
            </>
          </CartProvider>
        </ModalProvider>
      </SearchProvider>
    </ApolloProvider>
  );
}

export default MyApp;