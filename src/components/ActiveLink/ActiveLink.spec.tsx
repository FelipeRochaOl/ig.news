import { render, screen } from '@testing-library/react';
import { ActiveLink } from '.';

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/'
      }
    }
  }
})

describe('ActiveLink component', () => {
  it('should to be able renders correctly', () => {
    // or const {getByText} = render(<Component />)
    render(
      <ActiveLink href={'/'} activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    )
    
    expect(screen.getByText('Home')).toBeInTheDocument()
  })
  
  it('should to be able is receiving active class', () => {
    render(
      <ActiveLink href={'/'} activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    )
    
    expect(screen.getByText('Home')).toHaveClass('active')
  })
})