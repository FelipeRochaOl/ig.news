import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import Posts, { getStaticProps } from '../../pages/posts';
import { createPrismicClient } from '../../services/prismic';

jest.mock('next-auth/react');
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
jest.mock('../../services/prismic');
jest.mock('../../presenters', () => ({
  formatDateFull: jest.fn().mockReturnValue('31 de março de 2022')
}));

const posts = [
  {
    id: 'id-fake',
    slug: 'slug-fake',
    title: 'title-fake',
    excerpt: 'content-fake',
    date: '31 de março de 2022',
  }
]

describe('Posts page', () => {
  it('should to be able render correctly', () => {
    const useSessionMocked = jest.mocked(useSession)
    useSessionMocked.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    })
    render(<Posts posts={posts}/>)
    expect(screen.getByText('title-fake')).toBeInTheDocument()
  })

  it('should to be able load initial data', async () => {
    const prismicClientMock = jest.mocked(createPrismicClient)
    prismicClientMock.mockReturnValueOnce({
      getAllByType: jest.fn().mockResolvedValueOnce([{
        id: 'id-fake',
        uid: 'slug-fake',
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
      }])
    } as any)
    const response = await getStaticProps()
    
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts
        }
      })
    )
  })
})