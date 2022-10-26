
import { ISubscriptionButtonProps } from './interfaces';
import styles from './styles.module.scss';

export function SubscribeButton({priceId}: ISubscriptionButtonProps) {
  return (
  <button type="button" className={styles.subscribeButton}>
    Subscribe now
  </button>
  )
}