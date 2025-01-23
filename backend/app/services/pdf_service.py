from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer
from reportlab.lib.units import cm
from io import BytesIO
import os

class PDFService:
    def __init__(self):
        # Liberation Sans fontunu kaydet
        font_path = os.path.join(os.path.dirname(__file__), '../static/fonts/LiberationSans-Regular.ttf')
        font_bold_path = os.path.join(os.path.dirname(__file__), '../static/fonts/LiberationSans-Bold.ttf')
        
        try:
            # Fontları kaydet
            pdfmetrics.registerFont(TTFont('LiberationSans', font_path))
            pdfmetrics.registerFont(TTFont('LiberationSans-Bold', font_bold_path))
        except:
            print("Font yüklenemedi, lütfen font dosyalarının varlığını kontrol edin")

    def create_article_pdf(self, article):
        buffer = BytesIO()
        
        # PDF dokümanını oluştur
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=2*cm,
            leftMargin=2*cm,
            topMargin=2*cm,
            bottomMargin=2*cm
        )
        
        # Özel stiller oluştur
        normal_style = ParagraphStyle(
            'CustomNormal',
            fontSize=12,
            leading=16,
            spaceBefore=12,
            spaceAfter=12,
            fontName='LiberationSans'
        )
        
        title_style = ParagraphStyle(
            'CustomTitle',
            fontSize=24,
            leading=30,
            spaceBefore=12,
            spaceAfter=30,
            alignment=1,  # Ortalı
            fontName='LiberationSans-Bold'
        )
        
        # İçeriği hazırla
        story = []
        
        # Başlık
        title = article.get('title', '')
        story.append(Paragraph(title, title_style))
        story.append(Spacer(1, 30))
        
        # İçerik - Markdown içeriğini düz metne çevir
        content = article.get('content', '').replace('#', '').replace('*', '')  # Markdown işaretlerini kaldır
        paragraphs = content.split('\n')
        
        for paragraph in paragraphs:
            if paragraph.strip():
                # HTML entities'i düzelt
                paragraph = (
                    paragraph
                    .replace('&nbsp;', ' ')
                    .replace('&quot;', '"')
                    .replace('&apos;', "'")
                    .replace('&lt;', '<')
                    .replace('&gt;', '>')
                    .replace('&amp;', '&')
                )
                story.append(Paragraph(paragraph, normal_style))
                story.append(Spacer(1, 12))
        
        # PDF'i oluştur
        doc.build(story)
        buffer.seek(0)
        return buffer 