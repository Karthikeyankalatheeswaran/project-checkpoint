import os
import requests

RAWG_API_URL = "https://api.rawg.io/api/games"
RAWG_API_KEY = os.getenv("RAWG_API_KEY")

def get_games(search_query=None, page=1):
    params = {
        "key": RAWG_API_KEY,
        "page": page,
    }
    if search_query:
        params["search"] = search_query

    response = requests.get(RAWG_API_URL, params=params)
    response.raise_for_status()
    return response.json()
