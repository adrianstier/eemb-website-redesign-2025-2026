import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import {
  Card,
  CardTitle,
  CardDescription,
  CardImage,
  CardBadge,
  CardMeta,
  CardHeader,
  CardBody,
  CardFooter,
} from '@/components/ui/Card'

describe('Card Component', () => {
  describe('Rendering', () => {
    it('renders card with children', () => {
      render(
        <Card>
          <p>Card content</p>
        </Card>
      )
      expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    it('renders as article by default', () => {
      render(<Card>Content</Card>)
      const card = screen.getByRole('article')
      expect(card).toBeInTheDocument()
    })

    it('applies custom className', () => {
      render(<Card className="custom-class">Content</Card>)
      const card = screen.getByRole('article')
      expect(card).toHaveClass('custom-class')
    })

    it('applies base styling', () => {
      render(<Card>Content</Card>)
      const card = screen.getByRole('article')
      expect(card).toHaveClass('bg-white')
      expect(card).toHaveClass('rounded-xl')
      expect(card).toHaveClass('shadow-md')
    })
  })

  describe('Padding Variants', () => {
    it('applies medium padding by default', () => {
      render(<Card>Content</Card>)
      const card = screen.getByRole('article')
      expect(card).toHaveClass('p-6')
    })

    it('applies no padding', () => {
      render(<Card padding="none">Content</Card>)
      const card = screen.getByRole('article')
      expect(card).not.toHaveClass('p-4')
      expect(card).not.toHaveClass('p-6')
      expect(card).not.toHaveClass('p-8')
    })

    it('applies small padding', () => {
      render(<Card padding="sm">Content</Card>)
      const card = screen.getByRole('article')
      expect(card).toHaveClass('p-4')
    })

    it('applies large padding', () => {
      render(<Card padding="lg">Content</Card>)
      const card = screen.getByRole('article')
      expect(card).toHaveClass('p-8')
    })
  })

  describe('Hover Effect', () => {
    it('has hover effect by default', () => {
      render(<Card>Content</Card>)
      const card = screen.getByRole('article')
      expect(card).toHaveClass('hover:shadow-xl')
    })

    it('can disable hover effect', () => {
      render(<Card hover={false}>Content</Card>)
      const card = screen.getByRole('article')
      expect(card).not.toHaveClass('hover:shadow-xl')
    })
  })

  describe('Link Card', () => {
    it('renders as link when href is provided', () => {
      render(<Card href="/test">Link Card</Card>)
      const link = screen.getByRole('link')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/test')
    })

    it('wraps article in link', () => {
      render(<Card href="/test">Link Card</Card>)
      const link = screen.getByRole('link')
      const article = link.querySelector('article')
      expect(article).toBeInTheDocument()
    })

    it('has cursor-pointer class when href provided', () => {
      render(<Card href="/test">Link Card</Card>)
      const article = screen.getByRole('article')
      expect(article).toHaveClass('cursor-pointer')
    })
  })

  describe('Clickable Card', () => {
    it('calls onClick when clicked', () => {
      const handleClick = jest.fn()
      render(<Card onClick={handleClick}>Clickable Card</Card>)

      fireEvent.click(screen.getByRole('article'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('is keyboard accessible', () => {
      const handleClick = jest.fn()
      render(<Card onClick={handleClick}>Clickable Card</Card>)

      const card = screen.getByRole('article')
      expect(card).toHaveAttribute('tabIndex', '0')
    })

    it('responds to Enter key', () => {
      const handleClick = jest.fn()
      render(<Card onClick={handleClick}>Clickable Card</Card>)

      const card = screen.getByRole('article')
      fireEvent.keyDown(card, { key: 'Enter' })
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('responds to Space key', () => {
      const handleClick = jest.fn()
      render(<Card onClick={handleClick}>Clickable Card</Card>)

      const card = screen.getByRole('article')
      fireEvent.keyDown(card, { key: ' ' })
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('has cursor-pointer class when onClick provided', () => {
      render(<Card onClick={() => {}}>Clickable Card</Card>)
      const article = screen.getByRole('article')
      expect(article).toHaveClass('cursor-pointer')
    })
  })

  describe('Accessibility', () => {
    it('supports aria-label', () => {
      render(<Card ariaLabel="Featured article">Content</Card>)
      const card = screen.getByRole('article')
      expect(card).toHaveAttribute('aria-label', 'Featured article')
    })

    it('supports custom role', () => {
      render(<Card role="region">Content</Card>)
      const card = screen.getByRole('region')
      expect(card).toBeInTheDocument()
    })
  })
})

describe('CardTitle Component', () => {
  it('renders as h3 by default', () => {
    render(<CardTitle>Title</CardTitle>)
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument()
  })

  it('renders as specified heading level', () => {
    render(<CardTitle as="h2">Title</CardTitle>)
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
  })

  it('applies styling', () => {
    render(<CardTitle>Title</CardTitle>)
    const title = screen.getByRole('heading')
    expect(title).toHaveClass('text-xl')
    expect(title).toHaveClass('font-semibold')
  })

  it('applies custom className', () => {
    render(<CardTitle className="custom-title">Title</CardTitle>)
    const title = screen.getByRole('heading')
    expect(title).toHaveClass('custom-title')
  })
})

describe('CardDescription Component', () => {
  it('renders description text', () => {
    render(<CardDescription>Description text</CardDescription>)
    expect(screen.getByText('Description text')).toBeInTheDocument()
  })

  it('applies gray text color', () => {
    render(<CardDescription>Description</CardDescription>)
    const description = screen.getByText('Description')
    expect(description).toHaveClass('text-gray-600')
  })

  it('applies custom className', () => {
    render(<CardDescription className="custom-desc">Description</CardDescription>)
    const description = screen.getByText('Description')
    expect(description).toHaveClass('custom-desc')
  })
})

describe('CardImage Component', () => {
  it('renders image with src and alt', () => {
    render(<CardImage src="/test.jpg" alt="Test image" />)
    const img = screen.getByRole('img', { name: 'Test image' })
    expect(img).toHaveAttribute('src', '/test.jpg')
  })

  it('applies video aspect ratio by default', () => {
    const { container } = render(<CardImage src="/test.jpg" alt="Test" />)
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('aspect-video')
  })

  it('applies square aspect ratio', () => {
    const { container } = render(<CardImage src="/test.jpg" alt="Test" aspectRatio="square" />)
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('aspect-square')
  })

  it('applies portrait aspect ratio', () => {
    const { container } = render(<CardImage src="/test.jpg" alt="Test" aspectRatio="portrait" />)
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('aspect-[4/5]')
  })

  it('has hover zoom effect', () => {
    render(<CardImage src="/test.jpg" alt="Test" />)
    const img = screen.getByRole('img')
    expect(img).toHaveClass('group-hover:scale-105')
  })
})

describe('CardBadge Component', () => {
  it('renders badge text', () => {
    render(<CardBadge>New</CardBadge>)
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('applies gradient background', () => {
    render(<CardBadge>Featured</CardBadge>)
    const badge = screen.getByText('Featured')
    expect(badge).toHaveClass('bg-gradient-to-r')
    expect(badge).toHaveClass('from-ocean-blue')
    expect(badge).toHaveClass('to-ocean-teal')
  })

  it('has pill styling', () => {
    render(<CardBadge>Tag</CardBadge>)
    const badge = screen.getByText('Tag')
    expect(badge).toHaveClass('rounded-full')
    expect(badge).toHaveClass('text-xs')
  })
})

describe('CardMeta Component', () => {
  it('renders meta content', () => {
    render(
      <CardMeta>
        <span>Jan 1, 2024</span>
        <span>5 min read</span>
      </CardMeta>
    )
    expect(screen.getByText('Jan 1, 2024')).toBeInTheDocument()
    expect(screen.getByText('5 min read')).toBeInTheDocument()
  })

  it('has flex layout with gap', () => {
    const { container } = render(<CardMeta>Meta</CardMeta>)
    const meta = container.firstChild
    expect(meta).toHaveClass('flex')
    expect(meta).toHaveClass('gap-4')
  })
})

describe('CardHeader Component', () => {
  it('renders header content', () => {
    render(<CardHeader>Header Content</CardHeader>)
    expect(screen.getByText('Header Content')).toBeInTheDocument()
  })

  it('has bottom border', () => {
    const { container } = render(<CardHeader>Header</CardHeader>)
    const header = container.firstChild
    expect(header).toHaveClass('border-b')
  })
})

describe('CardBody Component', () => {
  it('renders body content', () => {
    render(<CardBody>Body Content</CardBody>)
    expect(screen.getByText('Body Content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<CardBody className="custom-body">Body</CardBody>)
    const body = container.firstChild
    expect(body).toHaveClass('custom-body')
  })
})

describe('CardFooter Component', () => {
  it('renders footer content', () => {
    render(<CardFooter>Footer Content</CardFooter>)
    expect(screen.getByText('Footer Content')).toBeInTheDocument()
  })

  it('has top border', () => {
    const { container } = render(<CardFooter>Footer</CardFooter>)
    const footer = container.firstChild
    expect(footer).toHaveClass('border-t')
  })
})

describe('Composed Card', () => {
  it('renders complete card with all subcomponents', () => {
    render(
      <Card href="/article/1">
        <CardHeader>
          <CardBadge>Featured</CardBadge>
        </CardHeader>
        <CardImage src="/image.jpg" alt="Article image" />
        <CardBody>
          <CardTitle>Article Title</CardTitle>
          <CardDescription>Article description text</CardDescription>
        </CardBody>
        <CardFooter>
          <CardMeta>
            <span>Jan 1, 2024</span>
          </CardMeta>
        </CardFooter>
      </Card>
    )

    expect(screen.getByText('Featured')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Article image' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Article Title' })).toBeInTheDocument()
    expect(screen.getByText('Article description text')).toBeInTheDocument()
    expect(screen.getByText('Jan 1, 2024')).toBeInTheDocument()
  })
})
