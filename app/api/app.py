import os
from flask import Flask, jsonify, render_template, request, redirect
import pandas as pd
from flask_cors import CORS
from SalesAnalysis import Analyse


app = Flask(__name__)
CORS(app)
import os

app.config['UPLOAD_FOLDER'] = 'uploads'

if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

@app.route('/api/analyse', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'})

        file = request.files['file']

        if file.filename == '':
            return jsonify({'error': 'No selected file'})

        if file:
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            file.save(file_path)
            print(f"File saved to: {file_path}")
            # Perform analysis using pandas or other libraries
            df = pd.read_csv(file_path)
            print(f"Dataframe columns before rename: {df.columns.tolist()}")
            # Rename columns to match expected names in SalesAnalysis.py
            df.rename(columns={
                'Quantity Ordered': 'Quantity_Ordered',
                'Price Each': 'Price_Each',
                'Order ID': 'Order_ID',
                'Order Date': 'Order_Date',
                'Purchase Address': 'Purchase_Address'
            }, inplace=True)
            print(f"Dataframe columns after rename: {df.columns.tolist()}")
            result = Analyse(df)
            return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)})


  
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)