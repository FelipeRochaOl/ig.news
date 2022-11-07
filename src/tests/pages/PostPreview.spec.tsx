import { asHTML, asText } from '@prismicio/helpers';
import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import PostPreview, { getStaticProps } from '../../pages/posts/preview/[slug]';
import { createPrismicClient } from '../../services/prismic';

jest.mock('next-auth/react');
jest.mock('@prismicio/helpers')
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
jest.mock('../../services/prismic');
jest.mock('../../presenters', () => ({
  formatDateFull: jest.fn().mockReturnValue('31 de março de 2022')
}));

const post = {
  id: 'id-fake',
  slug: 'slug-fake',
  title: 'title-fake',
  content: '<p>Fake Post</p>',
  date: '31 de março de 2022',
}

describe('Post preview page', () => {
  it('should to be able render correctly', () => {
    const useSessionMocked = jest.mocked(useSession)
    useSessionMocked.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    })
    render(<PostPreview post={post}/>)
    expect(screen.getByText('title-fake')).toBeInTheDocument()
    expect(screen.getByText('Fake Post')).toBeInTheDocument()
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument()
  })

  it('should to be able redirect user to full post when user is subscribed', async () => {
    const getSessionMock = jest.mocked(useSession)
    const useRouterMock = jest.mocked(useRouter)
    const pushMock = jest.fn();
    getSessionMock.mockReturnValueOnce({
      data: {
        activeSubscription: {
          active: true
        }
      }
    } as any)
    useRouterMock.mockReturnValueOnce({
      push: pushMock
    } as any)
    render(<PostPreview post={post}/>)
    expect(pushMock).toHaveBeenCalledWith('/posts/slug-fake')
  })

  it('should to be able load initial data', async () => {
    const prismicClientMock = jest.mocked(createPrismicClient)
    const asHTMLMock = jest.mocked(asHTML)
    const asTextMock = jest.mocked(asText)
    asHTMLMock.mockReturnValue('<p>content-fake</p>')
    asTextMock.mockReturnValue('title-fake')
    prismicClientMock.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{
            type: 'heading',
            text: 'title-fake'
          }],
          content: [{
            type: 'paragraph',
            text: 'content-fake'
          }]
        },
        last_publication_date: '31 de março de 2022'
      })
    } as any)
    const response = await getStaticProps({ params: { slug: 'slug-fake'}} as any)
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'slug-fake',
            title: 'title-fake',
            content: '<p>content-fake</p>',
            date: '31 de março de 2022'
          }
        }
      })
    )
  })
})