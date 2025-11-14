#!/usr/bin/env python3
"""
EEMB Complete Scraping Pipeline
Runs all scraping tasks in the correct order.
"""

import os
import sys
import time
import subprocess
from datetime import datetime

def print_header(text):
    """Print a nice header"""
    print("\n" + "="*80)
    print(f"  {text}")
    print("="*80 + "\n")

def run_script(script_name, description):
    """Run a Python script and handle errors"""
    print_header(description)
    print(f"Running: {script_name}")
    print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")

    start_time = time.time()

    try:
        result = subprocess.run(
            [sys.executable, script_name],
            cwd=os.path.dirname(os.path.abspath(__file__)),
            capture_output=False,
            text=True,
            check=True
        )

        elapsed = time.time() - start_time
        print(f"\n✅ {description} completed in {elapsed:.1f} seconds")
        return True

    except subprocess.CalledProcessError as e:
        elapsed = time.time() - start_time
        print(f"\n❌ {description} failed after {elapsed:.1f} seconds")
        print(f"Error: {e}")
        return False

    except Exception as e:
        elapsed = time.time() - start_time
        print(f"\n❌ {description} failed after {elapsed:.1f} seconds")
        print(f"Unexpected error: {e}")
        return False

def check_dependencies():
    """Check if all required packages are installed"""
    print_header("Checking Dependencies")

    required_packages = [
        'requests',
        'beautifulsoup4',
        'lxml',
        'pandas',
        'tqdm',
        'Pillow'
    ]

    missing = []

    for package in required_packages:
        try:
            if package == 'beautifulsoup4':
                __import__('bs4')
            elif package == 'Pillow':
                __import__('PIL')
            else:
                __import__(package)
            print(f"  ✅ {package}")
        except ImportError:
            print(f"  ❌ {package} - MISSING")
            missing.append(package)

    if missing:
        print("\n⚠️  Missing packages detected!")
        print("\nInstall them with:")
        print(f"  pip install {' '.join(missing)}")
        print("\nOr install all requirements:")
        print("  pip install -r requirements.txt")
        return False

    print("\n✅ All dependencies installed!")
    return True

def create_output_directories():
    """Create output directories if they don't exist"""
    print_header("Setting Up Output Directories")

    dirs = [
        '../data',
        '../assets',
        '../assets/images',
        '../assets/images/faculty',
        '../assets/documents',
        '../assets/media'
    ]

    script_dir = os.path.dirname(os.path.abspath(__file__))

    for dir_path in dirs:
        full_path = os.path.join(script_dir, dir_path)
        os.makedirs(full_path, exist_ok=True)
        print(f"  ✅ {dir_path}")

    print("\n✅ Output directories ready!")
    return True

def main():
    """Run the complete scraping pipeline"""
    print("""
    ╔════════════════════════════════════════════════════════════════════╗
    ║                                                                    ║
    ║         EEMB Website Content Scraping Pipeline                    ║
    ║         Complete Content Preservation System                      ║
    ║                                                                    ║
    ╚════════════════════════════════════════════════════════════════════╝
    """)

    print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    overall_start = time.time()

    # Step 1: Check dependencies
    if not check_dependencies():
        print("\n❌ Please install missing dependencies and try again.")
        sys.exit(1)

    # Step 2: Create output directories
    if not create_output_directories():
        print("\n❌ Failed to create output directories.")
        sys.exit(1)

    # Step 3: Run scrapers in order
    tasks = [
        ('crawl_site.py', 'Step 1: Site Structure Crawler'),
        ('scrape_faculty.py', 'Step 2: Faculty Directory Scraper'),
        ('download_images.py', 'Step 3: Image & Document Downloader'),
        ('validate_links.py', 'Step 4: Link Validator'),
    ]

    results = {}
    for script, description in tasks:
        success = run_script(script, description)
        results[description] = success

        if not success:
            print(f"\n⚠️  {description} failed, but continuing with next task...")
            print("  (You can fix errors and re-run individual scripts later)")

        # Small pause between tasks
        time.sleep(2)

    # Final summary
    overall_elapsed = time.time() - overall_start

    print_header("SCRAPING PIPELINE COMPLETE")

    print("📊 Task Summary:")
    for task, success in results.items():
        status = "✅ SUCCESS" if success else "❌ FAILED"
        print(f"  {status} - {task}")

    print(f"\n⏱️  Total time: {overall_elapsed:.1f} seconds ({overall_elapsed/60:.1f} minutes)")

    successful_tasks = sum(1 for s in results.values() if s)
    print(f"\n✅ {successful_tasks}/{len(tasks)} tasks completed successfully")

    print("\n📁 Output Files:")
    print("  Data Files:")
    print("    - ../data/site-map.csv - Complete site structure")
    print("    - ../data/faculty-scraped.csv - All faculty data")
    print("    - ../data/images-catalog.csv - Image inventory")
    print("    - ../data/documents-catalog.csv - Document inventory")
    print("    - ../data/link-validation.csv - All link status")
    print("    - ../data/broken-links.csv - Only broken links")
    print("\n  Downloaded Assets:")
    print("    - ../assets/images/ - All images")
    print("    - ../assets/images/faculty/ - Faculty photos")
    print("    - ../assets/documents/ - All documents")

    print("\n🎉 Content preservation complete!")
    print("\nNext Steps:")
    print("  1. Review CSV files in ../data/")
    print("  2. Check for any broken links in broken-links.csv")
    print("  3. Manually audit important content")
    print("  4. Begin building new website with preserved content")

    print(f"\nFinished: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    # Exit with error code if any task failed
    if successful_tasks < len(tasks):
        sys.exit(1)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Scraping interrupted by user (Ctrl+C)")
        print("You can resume by running individual scripts or run_all.py again")
        sys.exit(1)
