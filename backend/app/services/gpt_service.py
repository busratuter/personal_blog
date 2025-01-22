import sys, os
from openai import AzureOpenAI
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
from config import settings

class GPTService:
    def __init__(self):
        self.client = AzureOpenAI(
            api_key=settings.GPT_API_KEY,
            azure_endpoint=settings.GPT_ENDPOINT,
            api_version="2024-02-15-preview"
        )
        self.model = settings.GPT_MODEL

    def generate_article(self, prompt):
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": """Sen bir makale yazarısın. Kullanıcının promptuna göre bir makale oluşturacaksın. Dönen response cevabı makaleye dönüştürüp kullanıcıya göndermelisin.
                    Yanıtını şu formatta ver:
                    {
                        "title": "Makalenin başlığı",
                        "content": "Makalenin içeriği",
                        "category": "Makale için en uygun kategori (Technology, Science, Health, Travel, Food, Art, Business, Education, Entertainment, Sports kategorilerinden biri)"
                    }
                    """},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Hata oluştu: {str(e)}"

    def chat_with_article(self, article_content, article_title, article_category, user_message):
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": f"""Sen bir makale asistanısın. Aşağıdaki makale hakkında sorulara cevap vereceksin:

                Makale Başlığı: {article_title}

                Makale Kategorisi: {article_category}

                Makale İçeriği:
                {article_content}"""},
                    {"role": "user", "content": user_message}
                ],
                temperature=0.7,
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Hata oluştu: {str(e)}"

gpt_service = GPTService() 