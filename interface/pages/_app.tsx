import { AppProps } from 'next/app';
import { CustomProvider } from 'rsuite';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CustomProvider theme="dark">
      <Component {...pageProps} />
    </CustomProvider>
  );
}

export default MyApp
