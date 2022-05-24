import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import Blog from './Blog.js'

describe('<Note />', () => {
  beforeEach(()=> {
    const blog = {
      title: 'blog for test',
      author: 'blogs author',
      url: 'blog_url',
      likes: 3,
      user: 'abc'
    }

    const loginuser={
      id: 'abc'
    }
    render(<Blog blog={blog} loginuser={loginuser} />)
  })

  test('renders blog title', () => {
    const element = screen.findByText('blog for test')
    expect(element).toBeDefined()
  })

  test('does not render likes', () => {
    const likes = screen.queryByText('likes')
    expect(likes).toBeNull()
  })

  test('does not render blog url', () => {
    const URL = screen.queryByText('blog_url')
    expect(URL).toBeNull()
  })
  
  test('after click renders url', async ()=> {

    const user=userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const URL = screen.queryByText('blog_url')
    expect(URL).toBeDefined()

  })
})
  
test('<Note /> : like button pressed twice calls the event handler twice', async ()=> {
  const blog = {
    title: 'blog for test',
    author: 'blogs author',
    url: 'blog_url',
    likes: 3,
    user: 'abc'
  }

  const loginuser={
    id: 'abc'
  }

  const mockHandler = jest.fn()
  render(<Blog blog={blog} loginuser={loginuser} addLike={mockHandler}/>)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)

  })


