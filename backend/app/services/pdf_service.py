from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfbase import pdfmetrics, ttfonts
from reportlab.lib.units import cm
from io import BytesIO
import os

class PDFService:
    def __init__(self):
        # Font dosyalarının yolları
        self.fonts_dir = os.path.join(os.path.dirname(__file__), '../static/fonts')
        regular_font = os.path.join(self.fonts_dir, 'DejaVuSans.ttf')
        bold_font = os.path.join(self.fonts_dir, 'DejaVuSans-Bold.ttf')

        try:
            # Regular font'u kaydet
            regular_font_obj = ttfonts.TTFont('DejaVuSans', regular_font)
            pdfmetrics.registerFont(regular_font_obj)

            # Bold font'u kaydet
            bold_font_obj = ttfonts.TTFont('DejaVuSans-Bold', bold_font)
            pdfmetrics.registerFont(bold_font_obj)

            # Font ailesini kaydet
            pdfmetrics.registerFontFamily(
                'DejaVuSans',
                normal='DejaVuSans',
                bold='DejaVuSans-Bold'
            )

            self.normal_font = 'DejaVuSans'
            self.bold_font = 'DejaVuSans-Bold'
        except Exception as e:
            print(f"Font yüklenemedi: {str(e)}")
            self.normal_font = 'Helvetica'
            self.bold_font = 'Helvetica-Bold'

    def create_article_pdf(self, article_dict):
        buffer = BytesIO()
        
        # PDF dokümanını oluştur
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=2*cm,
            leftMargin=2*cm,
            topMargin=2*cm,
            bottomMargin=2*cm,
            encoding='UTF-8'
        )

        # Stil tanımlamaları
        styles = getSampleStyleSheet()
        
        # Başlık stili
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Title'],
            fontName=self.bold_font,
            fontSize=24,
            leading=30,
            alignment=1,  # Ortalı
            spaceAfter=30,
            encoding='UTF-8'
        )

        # Normal metin stili
        normal_style = ParagraphStyle(
            'CustomNormal',
            parent=styles['Normal'],
            fontName=self.normal_font,
            fontSize=12,
            leading=16,
            spaceBefore=12,
            spaceAfter=12,
            encoding='UTF-8'
        )

        # İçeriği hazırla
        story = []
        
        # Başlık
        title = article_dict.get('title', '')
        if isinstance(title, str):
            story.append(Paragraph(title, title_style))
            story.append(Spacer(1, 30))

        # İçerik
        content = article_dict.get('content', '')
        if isinstance(content, str):
            # Markdown işaretlerini kaldır
            content = content.replace('#', '').replace('*', '')
            
            # Paragrafları böl ve işle
            paragraphs = content.split('\n')
            for paragraph in paragraphs:
                if paragraph.strip():
                    story.append(Paragraph(paragraph.strip(), normal_style))
                    story.append(Spacer(1, 12))

        # PDF'i oluştur
        doc.build(story)
        
        buffer.seek(0)
        return buffer