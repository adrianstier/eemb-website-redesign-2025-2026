#!/usr/bin/env python3
"""
EEMB Scraper Setup Test
Quick test to verify all dependencies and basic functionality.
"""

import sys

def test_imports():
    """Test that all required packages are importable"""
    print("🔍 Testing imports...")

    required = {
        'requests': 'HTTP client',
        'bs4': 'BeautifulSoup (HTML parser)',
        'lxml': 'XML parser',
        'pandas': 'Data manipulation',
        'tqdm': 'Progress bars',
        'PIL': 'Image processing (Pillow)'
    }

    failed = []

    for package, description in required.items():
        try:
            __import__(package)
            print(f"  ✅ {description}")
        except ImportError:
            print(f"  ❌ {description} - MISSING")
            failed.append(package if package != 'bs4' else 'beautifulsoup4')

    if failed:
        print(f"\n❌ Missing packages: {', '.join(failed)}")
        print("\nInstall with:")
        print(f"  pip3 install {' '.join(failed)}")
        return False

    print("\n✅ All imports successful!")
    return True

def test_network():
    """Test network connectivity to EEMB site"""
    print("\n🌐 Testing network connectivity...")

    import requests

    try:
        response = requests.get("https://eemb.ucsb.edu", timeout=10)
        print(f"  ✅ eemb.ucsb.edu is reachable (status: {response.status_code})")
        return True
    except requests.exceptions.Timeout:
        print("  ❌ Connection timeout - site may be slow or unreachable")
        return False
    except requests.exceptions.ConnectionError:
        print("  ❌ Connection failed - check internet connection")
        return False
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return False

def test_html_parsing():
    """Test HTML parsing"""
    print("\n📄 Testing HTML parsing...")

    from bs4 import BeautifulSoup

    html = """
    <html>
        <head><title>Test Page</title></head>
        <body>
            <h1>Faculty Directory</h1>
            <div class="faculty">
                <h2>Dr. Test Person</h2>
                <a href="mailto:test@ucsb.edu">test@ucsb.edu</a>
                <img src="/photo.jpg" alt="Photo">
            </div>
        </body>
    </html>
    """

    try:
        soup = BeautifulSoup(html, 'html.parser')
        title = soup.find('title').text
        h1 = soup.find('h1').text
        email = soup.find('a', href=lambda x: x and 'mailto:' in x)['href']

        assert title == "Test Page"
        assert h1 == "Faculty Directory"
        assert "test@ucsb.edu" in email

        print("  ✅ HTML parsing works correctly")
        return True
    except Exception as e:
        print(f"  ❌ HTML parsing failed: {e}")
        return False

def test_csv_writing():
    """Test CSV writing"""
    print("\n📊 Testing CSV writing...")

    import pandas as pd
    import os
    import tempfile

    try:
        # Create test data
        data = [
            {'name': 'Test Person', 'email': 'test@ucsb.edu', 'title': 'Professor'},
            {'name': 'Another Person', 'email': 'another@ucsb.edu', 'title': 'Lecturer'}
        ]

        df = pd.DataFrame(data)

        # Write to temp file
        with tempfile.NamedTemporaryFile(mode='w', suffix='.csv', delete=False) as f:
            temp_path = f.name
            df.to_csv(temp_path, index=False)

        # Read back
        df_read = pd.read_csv(temp_path)

        # Verify
        assert len(df_read) == 2
        assert df_read['name'][0] == 'Test Person'

        # Clean up
        os.unlink(temp_path)

        print("  ✅ CSV writing and reading works")
        return True
    except Exception as e:
        print(f"  ❌ CSV writing failed: {e}")
        return False

def test_image_processing():
    """Test image processing (optional)"""
    print("\n🖼️  Testing image processing...")

    try:
        from PIL import Image
        from io import BytesIO

        # Create a simple test image
        img = Image.new('RGB', (100, 100), color='red')
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)

        # Read it back
        img_read = Image.open(buffer)
        assert img_read.size == (100, 100)

        print("  ✅ Image processing works")
        return True
    except Exception as e:
        print(f"  ⚠️  Image processing not available: {e}")
        print("  (This is optional - scrapers will work without it)")
        return True  # Non-critical

def test_directory_creation():
    """Test that we can create directories"""
    print("\n📁 Testing directory creation...")

    import os

    try:
        test_dir = '../data/test_dir'
        os.makedirs(test_dir, exist_ok=True)

        assert os.path.exists(test_dir)

        # Clean up
        os.rmdir(test_dir)

        print("  ✅ Directory creation works")
        return True
    except Exception as e:
        print(f"  ❌ Directory creation failed: {e}")
        return False

def test_basic_scrape():
    """Test a basic scrape of EEMB homepage"""
    print("\n🕷️  Testing basic scrape of EEMB homepage...")

    import requests
    from bs4 import BeautifulSoup

    try:
        response = requests.get("https://eemb.ucsb.edu", timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')

        title = soup.find('title')
        links = soup.find_all('a', href=True)
        images = soup.find_all('img', src=True)

        print(f"  Page title: {title.text.strip() if title else 'No title'}")
        print(f"  Found {len(links)} links")
        print(f"  Found {len(images)} images")

        if len(links) > 0 and len(images) > 0:
            print("  ✅ Basic scraping works!")
            return True
        else:
            print("  ⚠️  Scraped but found no content - site may be unusual")
            return True  # Still counts as success
    except Exception as e:
        print(f"  ❌ Basic scrape failed: {e}")
        return False

def main():
    """Run all tests"""
    print("""
    ╔════════════════════════════════════════════════════════════════════╗
    ║                                                                    ║
    ║         EEMB Scraper Setup Test                                   ║
    ║         Verify everything is ready before scraping                ║
    ║                                                                    ║
    ╚════════════════════════════════════════════════════════════════════╝
    """)

    tests = [
        ("Package imports", test_imports),
        ("Network connectivity", test_network),
        ("HTML parsing", test_html_parsing),
        ("CSV writing", test_csv_writing),
        ("Image processing", test_image_processing),
        ("Directory creation", test_directory_creation),
        ("Basic scrape", test_basic_scrape),
    ]

    results = {}

    for test_name, test_func in tests:
        try:
            results[test_name] = test_func()
        except Exception as e:
            print(f"\n❌ {test_name} crashed: {e}")
            results[test_name] = False

        # Small pause between tests
        import time
        time.sleep(0.5)

    # Summary
    print("\n" + "="*80)
    print("  TEST SUMMARY")
    print("="*80 + "\n")

    passed = sum(1 for result in results.values() if result)
    total = len(results)

    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {status} - {test_name}")

    print(f"\n📊 Results: {passed}/{total} tests passed")

    if passed == total:
        print("\n🎉 All tests passed! You're ready to scrape.")
        print("\nNext step:")
        print("  python3 run_all.py")
        return 0
    else:
        print("\n⚠️  Some tests failed. Fix issues above before scraping.")
        print("\nMost common fixes:")
        print("  - Missing packages: pip3 install -r requirements.txt")
        print("  - Network issues: Check internet connection")
        print("  - Permission issues: chmod +x scripts/*.py")
        return 1

if __name__ == "__main__":
    sys.exit(main())
