import os
from flask import Flask, jsonify, render_template, request, redirect
import pandas as pd
from flask_cors import CORS
from SalesAnalysis import Analyse


app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = ''

@app.route('/api/analyse', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    if file:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)
        # Perform analysis using pandas or other libraries
        df = pd.read_csv(file_path)
        result = Analyse(df)
        return jsonify(result)


  
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)