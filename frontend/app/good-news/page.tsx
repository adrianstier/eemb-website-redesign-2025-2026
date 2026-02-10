import Link from 'next/link'
import { getAllNews } from '@/lib/data/news'
import type { Metadata } from 'next'

export const revalidate = 900

export const metadata: Metadata = {
  title: 'Good News | EEMB',
  description: 'Celebrating achievements, awards, publications, and milestones of the EEMB community at UC Santa Barbara.',
}

export default async function GoodNewsPage() {
  const articles = await getAllNews({ category: 'good_news' as never })

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-ocean-deep via-ocean-blue to-ocean-teal text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Good News</h1>
            <p className="text-lg md:text-xl text-white/90">
              Celebrating the achievements, awards, publications, and milestones of our EEMB community.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {articles.length > 0 ? (
            <div className="space-y-6 max-w-3xl mx-auto">
              {articles.map(article => (
                <article key={article.id} className="bg-white rounded-2xl shadow-warm p-6 border border-warm-200">
                  <h3 className="text-xl font-heading font-bold text-ocean-deep mb-2">
                    {article.title}
                  </h3>
                  {article.publish_date && (
                    <p className="text-sm text-warm-500 mb-3">
                      {new Date(article.publish_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                  {article.excerpt && (
                    <p className="text-warm-600 leading-relaxed mb-4">{article.excerpt}</p>
                  )}
                  {article.slug && (
                    <Link
                      href={`/news/${article.slug}`}
                      className="text-ocean-blue hover:underline font-medium"
                    >
                      Read more &rarr;
                    </Link>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-20 h-20 bg-ucsb-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-ucsb-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h2 className="text-2xl font-heading font-bold text-ocean-deep mb-4">
                Good News Coming Soon
              </h2>
              <p className="text-warm-600 mb-8 leading-relaxed">
                We are compiling achievements, awards, and milestones from the EEMB community.
                Check back soon or submit your own good news.
              </p>
              <a
                href="mailto:eemb-web@ucsb.edu?subject=Good%20News%20Submission"
                className="inline-flex items-center gap-2 bg-ucsb-gold text-ocean-deep px-6 py-3 rounded-xl font-semibold hover:bg-yellow-400 transition-colors"
              >
                Submit Good News
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Back link */}
      <section className="pb-16">
        <div className="container mx-auto px-4 text-center">
          <Link href="/news" className="text-ocean-blue hover:underline">
            &larr; Back to News
          </Link>
        </div>
      </section>
    </div>
  )
}
