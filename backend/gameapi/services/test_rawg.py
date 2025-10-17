import os
import requests
from dotenv import load_dotenv

# Load .env
load_dotenv()

RAWG_API_KEY = os.getenv("RAWG_API_KEY")
if not RAWG_API_KEY:
    raise Exception("RAWG_API_KEY not found in .env")

# Test fetch
url = "https://api.rawg.io/api/games"
params = {
    "key": RAWG_API_KEY,
    "page_size": 5,      # fetch 5 games for testing
    "page": 1,
}

response = requests.get(url, params=params)
data = response.json()

print("=== RAWG API Test ===")
for game in data.get("results", []):
    print(f"{game['name']} | Released: {game.get('released')} | Rating: {game.get('rating')}")