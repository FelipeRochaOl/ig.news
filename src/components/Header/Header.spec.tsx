import { render } from '@testing-library/react';
import Header from '.';

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/'
      }
    }
  }
})

jest.mock('next-auth/react', () => {
  return {
    useSession() {
      return {
        data: null
      }
    }
  }
})

describe('Header component', () => {
  it('should to be able renders correctly', () => {
    const { getByText } = render(
      <Header />
    )
    
    expect(getByText('Home')).toBeInTheDocument()
    expect(getByText('Posts')).toBeInTheDocument()
  })
})