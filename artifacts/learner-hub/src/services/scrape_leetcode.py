import json
import urllib.request
import re
import html

urls = [
    "https://leetcode.com/problems/search-a-2d-matrix/description/",
    "https://leetcode.com/problems/sort-colors/",
    "https://leetcode.com/problems/combination-sum-ii/",
    "https://leetcode.com/problems/same-tree/description/",
    "https://leetcode.com/problems/unique-binary-search-trees-ii/description/",
    "https://leetcode.com/problems/partition-list/description/",
    "https://leetcode.com/problems/edit-distance/description/",
    "https://leetcode.com/problems/permutation-sequence/description/",
    "https://leetcode.com/problems/length-of-last-word/description/",
    "https://leetcode.com/problems/distinct-subsequences/description/",
    "https://leetcode.com/problems/nth-highest-salary/description/",
    "https://leetcode.com/problems/house-robber/description/",
    "https://leetcode.com/problems/word-search-ii/description/",
    "https://leetcode.com/problems/minimum-size-subarray-sum/description/",
    "https://leetcode.com/problems/transpose-file/description/",
    "https://leetcode.com/problems/excel-sheet-column-title/description/",
    "https://leetcode.com/problems/surrounded-regions/description/",
    "https://leetcode.com/problems/populating-next-right-pointers-in-each-node-ii/",
    "https://leetcode.com/problems/factorial-trailing-zeroes/description/",
    "https://leetcode.com/problems/maximal-rectangle/description/"
]

graphql_url = "https://leetcode.com/graphql"

query = """
query questionData($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    questionId
    title
    difficulty
    content
  }
}
"""

scraped_data = []

def extract_details(content):
    if not content:
        return "", "", ""
        
    # Extract description (everything before Example 1)
    desc_part = content.split("<strong>Example 1:</strong>")[0]
    desc_part = desc_part.split('<p><strong class="example">Example 1:</strong></p>')[0]
    
    # Strip HTML tags
    desc = re.sub(r'<[^>]+>', '', desc_part).strip()
    desc = html.unescape(desc)
    
    # Try to extract Input and Output from the first example
    in_match = re.search(r'<strong>Input:</strong>(.*?)(\n|<)', content)
    out_match = re.search(r'<strong>Output:</strong>(.*?)(\n|<)', content)
    
    in_str = in_match.group(1).strip() if in_match else ""
    out_str = out_match.group(1).strip() if out_match else ""
    
    # Clean up any remaining HTML
    in_str = re.sub(r'<[^>]+>', '', in_str)
    out_str = re.sub(r'<[^>]+>', '', out_str)
    
    return desc, html.unescape(in_str), html.unescape(out_str)

for url in urls:
    match = re.search(r'leetcode\.com/problems/([^/]+)', url)
    if not match:
        print(f"Invalid URL: {url}")
        continue
    
    slug = match.group(1)
    print(f"Scraping: {slug}...")
    
    payload = {
        "operationName": "questionData",
        "variables": {"titleSlug": slug},
        "query": query
    }
    
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(graphql_url, data=data)
    req.add_header("Content-Type", "application/json")
    req.add_header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
    
    try:
        response = urllib.request.urlopen(req)
        result = json.loads(response.read().decode("utf-8"))
        
        q = result.get("data", {}).get("question")
        if q:
            desc, inp, out = extract_details(q.get("content", ""))
            
            scraped_data.append({
                "id": f"leetcode-{q['questionId']}",
                "title": q["title"],
                "difficulty": q["difficulty"],
                "description": desc,
                "inputTestCase": inp,
                "expectedOutput": out,
                "starterCode": "def solve():\n    pass\n" # Generic starter code
            })
            print(f"  -> Success: {q.get('title')}")
        else:
            print(f"  -> Not found or premium question")
    except Exception as e:
        print(f"  -> Error: {e}")

output_file = "C:/Users/91626/OneDrive/Desktop/Learning-Hub/Learning-Hub/artifacts/learner-hub/src/services/scraped_leetcode.json"
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(scraped_data, f, indent=2)

print(f"\\nScraping complete! {len(scraped_data)} questions saved to {output_file}")
