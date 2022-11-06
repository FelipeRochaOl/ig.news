import { fireEvent, render, screen } from '@testing-library/react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { SubscribeButton } from '.';

jest.mock('next-auth/react');
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('SubscribeButton component', () => {
  it('should to be able renders correctly', () => {
    const useSessionMock = jest.mocked(useSession)
    useSessionMock.mockReturnValue({
      data: null,
      status: 'unauthenticated'
    })
    render(<SubscribeButton text='Subscribe now' />)
    
    expect(screen.getByText('Subscribe now')).toBeInTheDocument()
  })

  it('should to be able redirect user to sign in when not authrnticated', () => {
    const useSessionMock = jest.mocked(useSession)
    useSessionMock.mockReturnValue({
      data: null,
      status: 'unauthenticated'
    })
    const signInMock = jest.mocked(signIn)
    render(<SubscribeButton text='Subscribe now' />)
    const subscribeButton = screen.getByText('Subscribe now')
    fireEvent.click(subscribeButton)

    expect(signInMock).toHaveBeenCalled()
  })

  it('should to be able redirect to posts page when user already has a subscription', () => {
    const useSessionMock = jest.mocked(useSession)
    useSessionMock.mockReturnValueOnce({
      data: {
        user: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          image: 'https://image.name.github.com/johndoe.jpg'
        },
        expires: String(new Date()),
        activeSubscription: {
          active: true
        },
      },
      status: 'authenticated',
    })
    const useRouterMocked = jest.mocked(useRouter)
    const pushMock = jest.fn();
    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any)
    render(<SubscribeButton text='Ignews posts' />)
    const subscribeButton = screen.getByText('Ignews posts')
    fireEvent.click(subscribeButton)
    expect(pushMock).toHaveBeenCalled()
  })
})