from flask import Flask, request, send_file
from flask_cors import CORS
from PyPDF2 import PdfMerger
from PIL import Image
import io

app = Flask(__name__)
CORS(app) # Allows React to talk to Python

@app.route('/assemble', methods=['POST'])
def assemble_files():
    if 'files' not in request.files:
        return {"error": "No files uploaded"}, 400

    files = request.files.getlist('files')
    merger = PdfMerger()

    try:
        for file in files:
            filename = file.filename.lower()
            
            # If it's a PDF, append directly
            if filename.endswith('.pdf'):
                merger.append(file)
                
            # If it's an image, convert to PDF format first
            elif filename.endswith(('.png', '.jpg', '.jpeg')):
                image = Image.open(file).convert('RGB')
                pdf_bytes = io.BytesIO()
                image.save(pdf_bytes, format='PDF')
                pdf_bytes.seek(0)
                merger.append(pdf_bytes)

        # Save final PDF to memory
        output_pdf = io.BytesIO()
        merger.write(output_pdf)
        merger.close()
        output_pdf.seek(0)

        # Send it back to the React frontend
        return send_file(
            output_pdf, 
            as_attachment=True, 
            download_name='Final_Assignment.pdf',
            mimetype='application/pdf'
        )

    except Exception as e:
        return {"error": str(e)}, 500

if __name__ == '__main__':
    print("Backend is running on port 5000...")
    app.run(host='0.0.0.0', port=5000)