#!/usr/bin/env python3
"""
Import news articles from news.json to Supabase
"""

import json
from datetime import datetime

# Read news.json
with open('src/data/news.json', 'r') as f:
    data = json.load(f)

# Map topic to news_category enum values
topic_to_category = {
    'faculty': 'faculty_news',
    'marine': 'research',
    'climate': 'research',
    'ecology': 'research',
    'evolution': 'research',
    'conservation': 'research'
}

def escape_sql(text):
    """Escape single quotes for SQL"""
    if text is None:
        return ''
    return text.replace("'", "''")

def generate_insert(articles, start_idx=0):
    """Generate INSERT statement for a batch of articles"""
    values = []
    for i, item in enumerate(articles):
        # Parse date
        try:
            date_obj = datetime.strptime(item['date'], '%B %d, %Y')
            publish_date = date_obj.strftime('%Y-%m-%d')
        except:
            publish_date = '2024-01-01'

        # Escape strings
        title = escape_sql(item.get('title', ''))
        slug = escape_sql(item.get('slug', ''))
        excerpt = escape_sql(item.get('excerpt', ''))
        content = escape_sql(item.get('content', ''))
        image_url = escape_sql(item.get('imageUrl', '/images/news/placeholder.jpg'))

        # Map topic to category
        topic = item.get('topic', 'ecology')
        category = topic_to_category.get(topic, 'research')

        # Determine featured (first 5 articles)
        featured = 'true' if item['id'] <= 5 else 'false'

        # Build tags array from topic
        tags = f"'{{\"{topic}\"}}'"

        values.append(f"('{title}', '{slug}', NULL, '{excerpt}', '{content}', '{category}', NULL, '{publish_date}', {featured}, false, '{image_url}', {tags})")

    sql = "INSERT INTO news_articles (title, slug, subtitle, excerpt, content, category, author, publish_date, featured, pinned, image_url, tags) VALUES\n"
    sql += ",\n".join(values) + ";"
    return sql

# Generate SQL for batches of 10
batch_size = 10
for i in range(0, len(data), batch_size):
    batch = data[i:i+batch_size]
    batch_num = i // batch_size + 1
    print(f"\n-- Batch {batch_num} (articles {i+1}-{min(i+batch_size, len(data))})")
    print(generate_insert(batch, i))
