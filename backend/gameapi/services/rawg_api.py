import os
import requests
from dotenv import load_dotenv

load_dotenv()

RAWG_API_KEY = os.getenv("RAWG_API_KEY")

def get_games(search_query="", page=1):
    url = "https://api.rawg.io/api/games"
    params = {
        "key": RAWG_API_KEY,
        "search": search_query,
        "page": page
    }
    res = requests.get(url, params=params)
    return res.json()