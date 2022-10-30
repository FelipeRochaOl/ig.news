import { Session } from "next-auth";
import { AppProps } from "next/app";

export interface IAppProps extends AppProps {
  pageProps: {
    session: Session;
  };
}

export interface IHomeProps {
  product: {
    priceId: string;
    amount: string;
  };
}
