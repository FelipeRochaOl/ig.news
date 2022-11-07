import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import Home, { getStaticProps } from '../../pages';
import { stripe } from '../../services/stripe';

jest.mock('next-auth/react')
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
jest.mock('../../services/stripe')

describe('Home page', () => {
  it('should to be able render correctly', () => {
    const useSessionMocked = jest.mocked(useSession)
    useSessionMocked.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    })
    render(<Home product={{ priceId: 'fake-price-id', amount: '$9.99'}}/>)
    expect(screen.getByText(/\$9.99/)).toBeInTheDocument()
  })

  it('should to be able load initial data', async () => {
    const retriveStripePricesMock = jest.mocked(stripe.prices.retrieve)
    retriveStripePricesMock.mockResolvedValueOnce({
      id: 'fake-price-id',
      unit_amount: 999
    } as any)
    const response = await getStaticProps({})

    expect(response).toEqual(expect.objectContaining({
      props: {
        product: {
          priceId: 'fake-price-id',
          amount: '$9.99'
        }
      }
    }))
  })
})