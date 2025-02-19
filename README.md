# Blog Project

This project is a blog platform where users can write articles, categorize them, and save articles from other users. The project is developed using modern web technologies and cloud services.

## Features

### User Management
- **Registration and Login:** Users can securely register and log in using JWT-based authentication.
- **Profile Management:** Users can update their profiles and manage personal information.

### Article Management
- **Create, Edit, and Delete Articles:** Users can create, edit, and delete articles using a rich text editor.
- **Category Filtering:** Articles can be categorized and filtered based on user interests.

### Content Management
- **Save and Share Articles:** Users can save articles they like and share them on social media platforms.
- **Content Suggestions:** With GPT-4o integration, users can receive content suggestions to enrich their writing.

### File Management
- **File Upload:** Users can upload images and other media files to articles using Azure Blob Storage.

## Technical Details

- **Backend:** Developed using FastAPI to create a RESTful API. SQLAlchemy and pyodbc are used for database connections.
- **Database:** The project uses SQLite by default but is also configured to work with Azure SQL Server.
- **Authentication:** User authentication is provided using JWT (JSON Web Tokens).
- **Cloud Services:** Azure Blob Storage is used for file storage. Additionally, content suggestions are provided using OpenAI's GPT-4o model.

## Requirements

- Python 3.8+
- Azure account
- SQL Server or SQLite

## Installation

1. Clone this project:
   ```bash
   git clone https://github.com/username/blog-project.git
   cd blog-project
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # MacOS/Linux
   venv\Scripts\activate  # Windows
   ```

3. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   - Create a `.env` file and move the environment variables from `config.py` to this file.

5. Start the application:
   ```bash
   uvicorn backend.main:app --reload
   ```

## Usage

- Once the application is running, you can access it at [http://localhost:8000](http://localhost:8000).
- API documentation is available at [http://localhost:8000/docs](http://localhost:8000/docs).

## License

This project is licensed under the MIT License. 