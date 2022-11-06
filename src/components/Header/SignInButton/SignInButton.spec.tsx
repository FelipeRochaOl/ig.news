import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { SignInButton } from '.';

jest.mock('next-auth/react')

describe('SignInButton component', () => {
  it('should to be able renders correctly when user is not authenticated', () => {
    const useSessionMocked = jest.mocked(useSession)
    useSessionMocked.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    })
    render(<SignInButton />)
    expect(screen.getByText('Sign in with Github')).toBeInTheDocument()
  })

  it('should to be able renders correctly when user is authenticated', () => {
    const useSessionMocked = jest.mocked(useSession)
    useSessionMocked.mockReturnValue({
      data: {
          user: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            image: 'https://image.name.github.com/johndoe.jpg'
          },
          expires: String(new Date()),
          activeSubscription: null
      },
      status: 'authenticated',
    })
    render(<SignInButton />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })
})