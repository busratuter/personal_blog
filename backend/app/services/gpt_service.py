import requests
import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
from config import settings

class GPTService:
    def __init__(self):
        self.endpoint = settings.GPT_ENDPOINT
        self.api_key = settings.GPT_API_KEY
        self.model = settings.GPT_MODEL

    def generate_article(self, prompt):
        headers = {
            "Content-Type": "application/json",
            "api-key": self.api_key
        }

        data = {
            "messages": [
                {"role": "system", "content": """Sen bir makale yazarısın. Kullanıcının isteğine göre bir makale oluşturacaksın.
                Yanıtını şu formatta ver:
                {
                    "title": "Makalenin başlığı",
                    "content": "Makalenin içeriği",
                    "category": "Makale için en uygun kategori (Technology, Science, Health, Travel, Food, Art, Business, Education, Entertainment, Sports kategorilerinden biri)"
                }
                """},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
        }

        try:
            response = requests.post(self.endpoint, headers=headers, json=data)
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]
        except Exception as e:
            return f"Hata oluştu: {str(e)}"

    def chat_with_article(self, article_content, article_title, article_category, user_message):
        headers = {
            "Content-Type": "application/json",
            "api-key": self.api_key
        }

        data = {
            "messages": [
                {"role": "system", "content": f"""Sen bir makale asistanısın. Aşağıdaki makale hakkında sorulara cevap vereceksin:

            Makale Başlığı: {article_title}

            Makale Kategorisi: {article_category}

            Makale İçeriği:
            {article_content}"""},
                            {"role": "user", "content": user_message}
                        ],
            "temperature": 0.7,
        }

        try:
            response = requests.post(self.endpoint, headers=headers, json=data)
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]
        except Exception as e:
            return f"Hata oluştu: {str(e)}"

gpt_service = GPTService() 