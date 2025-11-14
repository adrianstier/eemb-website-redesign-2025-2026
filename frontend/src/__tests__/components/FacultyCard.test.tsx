// Example test for FacultyCard component
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import FacultyCard from '@/components/FacultyCard'

// Mock faculty data
const mockFaculty = {
  id: 1,
  attributes: {
    first_name: 'John',
    last_name: 'Doe',
    title: 'Professor',
    email: 'john.doe@ucsb.edu',
    office: 'LSB 3201',
    research_interests: ['Marine Biology', 'Climate Change', 'Coral Reefs'],
    image: {
      url: '/images/faculty/john-doe.jpg',
      alternativeText: 'John Doe',
    },
    slug: 'john-doe',
  },
}

describe('FacultyCard Component', () => {
  it('renders faculty information correctly', () => {
    render(<FacultyCard faculty={mockFaculty} />)

    // Check if name is rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument()

    // Check if title is rendered
    expect(screen.getByText('Professor')).toBeInTheDocument()

    // Check if email is rendered
    expect(screen.getByText('john.doe@ucsb.edu')).toBeInTheDocument()

    // Check if office is rendered
    expect(screen.getByText('Office: LSB 3201')).toBeInTheDocument()
  })

  it('displays research interests', () => {
    render(<FacultyCard faculty={mockFaculty} />)

    // Check if research interests are displayed
    mockFaculty.attributes.research_interests.forEach((interest) => {
      expect(screen.getByText(interest)).toBeInTheDocument()
    })
  })

  it('renders faculty image with correct alt text', () => {
    render(<FacultyCard faculty={mockFaculty} />)

    const image = screen.getByAltText('John Doe')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', mockFaculty.attributes.image.url)
  })

  it('renders placeholder image when no image provided', () => {
    const facultyWithoutImage = {
      ...mockFaculty,
      attributes: {
        ...mockFaculty.attributes,
        image: null,
      },
    }

    render(<FacultyCard faculty={facultyWithoutImage} />)

    const placeholderImage = screen.getByAltText('John Doe')
    expect(placeholderImage).toBeInTheDocument()
    expect(placeholderImage).toHaveAttribute('src', '/images/placeholder-avatar.png')
  })

  it('navigates to faculty profile on click', () => {
    const mockOnClick = jest.fn()
    render(<FacultyCard faculty={mockFaculty} onClick={mockOnClick} />)

    const card = screen.getByRole('article')
    fireEvent.click(card)

    expect(mockOnClick).toHaveBeenCalledWith(mockFaculty)
  })

  it('applies hover styles on mouse enter', () => {
    render(<FacultyCard faculty={mockFaculty} />)

    const card = screen.getByRole('article')
    fireEvent.mouseEnter(card)

    expect(card).toHaveClass('hover:shadow-lg')
  })

  it('truncates long research interests lists', () => {
    const facultyWithManyInterests = {
      ...mockFaculty,
      attributes: {
        ...mockFaculty.attributes,
        research_interests: [
          'Marine Biology',
          'Climate Change',
          'Coral Reefs',
          'Ocean Acidification',
          'Marine Conservation',
          'Ecosystem Dynamics',
        ],
      },
    }

    render(<FacultyCard faculty={facultyWithManyInterests} showMax={3} />)

    // Should only show first 3 interests
    expect(screen.getByText('Marine Biology')).toBeInTheDocument()
    expect(screen.getByText('Climate Change')).toBeInTheDocument()
    expect(screen.getByText('Coral Reefs')).toBeInTheDocument()

    // Should show "and X more"
    expect(screen.getByText('and 3 more...')).toBeInTheDocument()

    // Should not show the hidden interests
    expect(screen.queryByText('Ocean Acidification')).not.toBeInTheDocument()
  })

  it('handles missing data gracefully', () => {
    const incompleteData = {
      id: 2,
      attributes: {
        first_name: 'Jane',
        last_name: 'Smith',
        // Missing other fields
      },
    }

    render(<FacultyCard faculty={incompleteData} />)

    // Should still render name
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()

    // Should show default values or skip missing fields
    expect(screen.queryByText('Office:')).not.toBeInTheDocument()
  })

  it('is accessible with proper ARIA attributes', () => {
    render(<FacultyCard faculty={mockFaculty} />)

    const card = screen.getByRole('article')
    expect(card).toHaveAttribute('aria-label', 'Faculty profile for John Doe')

    // Check for proper heading hierarchy
    const heading = screen.getByRole('heading', { level: 3 })
    expect(heading).toHaveTextContent('John Doe')
  })
})