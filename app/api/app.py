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
            rename_dict = {
                'Quantity Ordered': 'Quantity_Ordered',
                'Price Each': 'Price_Each',
                'Order ID': 'Order_ID',
                'Order Date': 'Order_Date',
                'Purchase Address': 'Purchase_Address'
            }
            df.rename(columns=rename_dict, inplace=True)
            print(f"Dataframe columns after rename: {df.columns.tolist()}")

            # Check for required columns
            required_columns = ['Order_ID', 'Product', 'Quantity_Ordered', 'Price_Each', 'Order_Date', 'Purchase_Address', 'month']
            missing_columns = [col for col in required_columns if col not in df.columns]
            if missing_columns:
                error_msg = f"Missing required columns: {', '.join(missing_columns)}"
                print(error_msg)
                return jsonify({'error': error_msg})

            result = Analyse(df)
            return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/api/reports', methods=['GET'])
def get_reports():
    # For demonstration, return a static list of reports
    reports = [
        {
            "title": "Annual Sales Report 2023",
            "description": "Summary of sales performance for the year 2023."
        },
        {
            "title": "Q1 Sales Analysis",
            "description": "Detailed analysis of sales in the first quarter."
        }
    ]
    return jsonify(reports)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
