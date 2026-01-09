#!/usr/bin/env python3
"""
Generate individual INSERT statements for news articles
"""

import json
from datetime import datetime

# Read news.json
with open('src/data/news.json', 'r') as f:
    data = json.load(f)

topic_to_category = {
    'faculty': 'faculty_news',
    'marine': 'research',
    'climate': 'research',
    'ecology': 'research',
    'evolution': 'research',
    'conservation': 'research'
}

def escape_sql(text):
    if text is None:
        return ''
    return text.replace("'", "''")

# Generate individual INSERT statements
for i, item in enumerate(data):
    try:
        date_obj = datetime.strptime(item['date'], '%B %d, %Y')
        publish_date = date_obj.strftime('%Y-%m-%d')
    except:
        publish_date = '2024-01-01'

    title = escape_sql(item.get('title', ''))
    slug = escape_sql(item.get('slug', ''))
    excerpt = escape_sql(item.get('excerpt', ''))
    content = escape_sql(item.get('content', ''))
    image_url = escape_sql(item.get('imageUrl', '/images/news/placeholder.jpg'))
    topic = item.get('topic', 'ecology')
    category = topic_to_category.get(topic, 'research')
    featured = 'true' if item['id'] <= 5 else 'false'
    # Properly format PostgreSQL array
    tags = '{' + topic + '}'

    sql = f"""INSERT INTO news_articles (title, slug, subtitle, excerpt, content, category, author, publish_date, featured, pinned, image_url, tags) VALUES ('{title}', '{slug}', NULL, '{excerpt}', '{content}', '{category}', NULL, '{publish_date}', {featured}, false, '{image_url}', '{tags}');"""

    print(f"-- Article {i+1}: {item.get('title', '')[:50]}...")
    print(sql)
    print()
