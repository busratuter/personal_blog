from azure.storage.blob import BlobServiceClient
import json
from config import AZURE_STORAGE_CONNECTION_STRING, AZURE_STORAGE_CONTAINER_NAME

class AzureBlobStorage:
    def __init__(self):
        self.blob_service_client = BlobServiceClient.from_connection_string(AZURE_STORAGE_CONNECTION_STRING)
        self.container_client = self.blob_service_client.get_container_client(AZURE_STORAGE_CONTAINER_NAME)

    def _get_user_folder_name(self, user_id, first_name, last_name):
        # Remove any special characters that might cause issues in blob storage
        sanitized_first_name = ''.join(e for e in first_name if e.isalnum())
        sanitized_last_name = ''.join(e for e in last_name if e.isalnum())
        return f"{user_id}-{sanitized_first_name}-{sanitized_last_name}"

    def upload_article(self, article_data, filename, user_id, first_name, last_name, as_plain_text=False):
        try:
            # Create user folder structure
            user_folder = self._get_user_folder_name(user_id, first_name, last_name)
            full_path = f"{user_folder}/{filename}"
            
            if as_plain_text:
                # Düz metin formatında kaydet
                text_content = f"""Başlık: {article_data['title']}
                
Yazar ID: {article_data['author_id']}
Kategori ID: {article_data['category_id']}
Oluşturulma Tarihi: {article_data['created_at']}
Son Güncelleme: {article_data['updated_at']}

İçerik:
{article_data['content']}
"""
                data_to_upload = text_content
            else:
                # JSON formatında kaydet
                data_to_upload = json.dumps(article_data)
            
            # Blob client oluştur
            blob_client = self.container_client.get_blob_client(full_path)
            
            # Veriyi yükle
            blob_client.upload_blob(data_to_upload, overwrite=True)
            
            return blob_client.url
        except Exception as e:
            print(f"Error uploading to blob storage: {str(e)}")
            raise

    def get_article(self, filename, user_id, first_name, last_name):
        try:
            user_folder = self._get_user_folder_name(user_id, first_name, last_name)
            full_path = f"{user_folder}/{filename}"
            blob_client = self.container_client.get_blob_client(full_path)
            json_data = blob_client.download_blob().readall()
            return json.loads(json_data)
        except Exception as e:
            print(f"Error downloading from blob storage: {str(e)}")
            raise

    def delete_article(self, filename, user_id, first_name, last_name):
        try:
            # Get user folder name and create full path
            user_folder = self._get_user_folder_name(user_id, first_name, last_name)
            full_path = f"{user_folder}/{filename}"
            
            blob_client = self.container_client.get_blob_client(full_path)
            blob_client.delete_blob()
        except Exception as e:
            print(f"Error deleting from blob storage: {str(e)}")
            raise
