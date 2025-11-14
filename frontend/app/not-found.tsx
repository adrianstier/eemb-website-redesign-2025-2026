import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ucsb-navy to-blue-800">
      <div className="text-center text-white p-8 max-w-md">
        <h1 className="text-9xl font-bold mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-xl mb-8 text-gray-200">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-ucsb-gold text-ucsb-navy px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}