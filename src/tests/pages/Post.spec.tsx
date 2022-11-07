import { asHTML, asText } from '@prismicio/helpers';
import { render, screen } from '@testing-library/react';
import { getSession, useSession } from 'next-auth/react';
import Post, { getServerSideProps } from '../../pages/posts/[slug]';
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

describe('Post page', () => {
  it('should to be able render correctly', () => {
    const useSessionMocked = jest.mocked(useSession)
    useSessionMocked.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    })
    render(<Post post={post}/>)
    expect(screen.getByText('title-fake')).toBeInTheDocument()
    expect(screen.getByText('Fake Post')).toBeInTheDocument()
  })

  it('should to be able load initial data', async () => {
    const getSessionMock = jest.mocked(getSession)
    getSessionMock.mockResolvedValueOnce(null)

    const response = await getServerSideProps({ params: { slug: 'fake-slug'}} as any)
    
    expect(response).toEqual(
      expect.objectContaining({
        redirect: {
          destination: '/posts/preview/fake-slug',
          permanent: false
        }
      })
    )
  })

  it('should to be able load initial data user is logged', async () => {
    const getSessionMock = jest.mocked(getSession)
    const prismicClientMock = jest.mocked(createPrismicClient)
    const asHTMLMock = jest.mocked(asHTML)
    const asTextMock = jest.mocked(asText)
    getSessionMock.mockResolvedValueOnce({
      activeSubscription: 'fake-active'
    } as any)
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

    const response = await getServerSideProps({ params: { slug: 'slug-fake'}} as any)
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