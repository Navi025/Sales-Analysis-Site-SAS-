import requests

# Test saving a report
def test_save_report():
    url = 'http://localhost:5000/api/save_report'
    report_data = {
        'title': 'Demo Report',
        'description': 'This is a demo report for testing purposes.'
    }
    response = requests.post(url, json=report_data)
    print('Save Report Response:', response.json())

# Test retrieving reports
def test_get_reports():
    url = 'http://localhost:5000/api/reports'
    response = requests.get(url)
    print('Get Reports Response:', response.json())

if __name__ == "__main__":
    test_save_report()
    test_get_reports()
