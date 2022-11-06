
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { api } from '../../services/api';
import { getStripeJS } from '../../services/stripe-js';
import { ISubscriptionButtonProps } from './interfaces';
import styles from './styles.module.scss';

export function SubscribeButton({ text }: ISubscriptionButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubscribe = async () => {
    if (!session) {
      signIn('github');
      return;
    }

    if (session.activeSubscription) {
      router.push('/posts')
      return;
    }

    try {
     const response = await api.post('/subscribe')
     const {sessionId} = response.data;
     const stripeJS = await getStripeJS();

     await stripeJS?.redirectToCheckout({sessionId});
    } catch (error) {
      console.error(error);
    }
  }

  return (
  <button type="button" className={styles.subscribeButton} onClick={handleSubscribe}>
    {text}
  </button>
  )
}