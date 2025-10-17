import os
import requests

RAWG_API_KEY = os.getenv("RAWG_API_KEY")

def get_games(search_query=None, page=1):
    url = "https://api.rawg.io/api/games"
    params = {
        "key": os.getenv("RAWG_API_KEY"),
        "page_size": 10,
        "page": page,
    }
    if search_query:
        params["search"] = search_query
    response = requests.get(url, params=params)
    return response.json()