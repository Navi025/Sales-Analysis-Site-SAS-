'use client'

import { useState } from "react"
import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from 'next/dynamic';
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });
import logo from "public/assets/logo.jpg";

const StartAnalysisPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [images, setImages] = useState(null);
  const [clicked, setClicked] = useState(false);
  const [error, setError] = useState(null);
  const [showDemo, setShowDemo] = useState(false);
  const router = useRouter()

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleUseDemo = async () => {
    setClicked(true);
    setError(null);
    try {
      // Fetch the demo file as a blob
      const demoFileResponse = await fetch('/uploads/Filtered_DataSet.csv');
      const demoFileBlob = await demoFileResponse.blob();

      const formData = new FormData();
      formData.append('file', demoFileBlob, 'Filtered_DataSet.csv');

      const response = await fetch('http://localhost:5000/api/analyse', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }
      console.log(result);
      setImages(result);
    } catch (error) {
      console.error('Error using demo data:', error.message);
      setError(error.message);
    } finally {
      setClicked(false);
    }
  };

  const handleAnalyse = async () => {
    setClicked(true)
    setError(null);
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const response = await fetch('http://localhost:5000/api/analyse', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }
      console.log(result);
      setImages(result);
    } catch (error) {
      console.error('Error analyzing file:', error.message);
      setError(error.message);
    } finally {
      setClicked(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 font-poppins text-gray-100">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between px-8 h-14 bg-black text-white shadow-md">
        <div className="flex items-center space-x-4 h-full">
          <Image
            src={logo}
            alt="Kmart Logo"
            className="h-[90%] w-auto object-contain"
          />
          <span className="text-2xl font-bold">Kmart Sales Dashboard</span>
        </div>
        <div className="space-x-6 hidden md:flex">
          <button
            className="hover:underline"
            onClick={() => router.push('/')}
          >
            Home
          </button>
          <button
            className="hover:underline"
            onClick={() => router.push('/StartAnalysis')}
          >
            Start Analysis
          </button>
          <button
            className="hover:underline"
            onClick={() => router.push('/Reports')}
          >
            Reports
          </button>
          <button
            className="hover:underline"
            onClick={() => router.push('/Settings')}
          >
            Settings
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-12">
        <h1 className="text-6xl font-extrabold text-center text-gradient m-0 mb-10" >
          Sales Analysis
        </h1>
        <br />
        <div className="max-w-4xl w-full flex flex-col md:flex-row items-start gap-10">
          <div className="md:w-1/2 flex flex-col items-center">
            <ul className="list-disc list-inside text-gray-300 max-w-md mx-auto mb-6">
              <li>Analyze annual sales data for Kmart Corporation.</li>
              <li>Upload a CSV file with the following columns: Order_ID, Product, Quantity_Ordered, Price_Each, Order_Date, Purchase_Address, month.</li>
              <li>View interactive charts for monthly sales, product sales, city-wise sales, and time-wise sales.</li>
              <li>Get sales forecast for the next 6 months based on historical data.</li>
              <li>Use the demo dataset if you don't have your own data.</li>
            </ul>
          </div>
          <div className="md:w-1/2 flex flex-col items-center">
            <h2 className="text-3xl text-gray-300 text-center mb-4">
              Upload file for Analysis
            </h2>
            <form className="flex flex-col items-center gap-6 w-full max-w-md" onSubmit={(e) => e.preventDefault()}>
              <input
                type="file"
                accept=".csv"
                className="border border-gray-600 rounded-md p-3 w-full bg-gray-800 text-gray-200"
                onChange={handleFileChange}
              />
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 w-full"
                onClick={handleAnalyse}
                disabled={!selectedFile || clicked}
              >
                {clicked ? "Analyzing..." : "Analyse"}
              </button>
            </form>
            <div className="flex justify-between max-w-md mx-auto mt-4 space-x-4">
              <button
                type="button"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 flex-1"
                onClick={handleUseDemo}
                disabled={clicked}
              >
                Use Demo Data Set
              </button>
              <button
                type="button"
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 flex-1"
                onClick={() => setShowDemo(true)}
                disabled={clicked}
              >
                View Demo Data Set
              </button>
            </div>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-600 text-white rounded-md max-w-md text-center">
              Error: {error}
            </div>
          )}
        </div>

        {clicked && images == null && (
          <div className="flex h-64 items-center justify-center mt-12">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
            <span className="ml-4 text-xl font-semibold text-gray-300">Analyzing, please wait...</span>
          </div>
        )}

        {!clicked && images != null && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center mt-12 max-w-5xl mx-auto">
            <div>
              <h2 className="text-2xl font-semibold mb-2 text-gray-200">Month Wise Sale</h2>
              <Plot
                data={JSON.parse(images.Month.graph).data}
                layout={JSON.parse(images.Month.graph).layout}
                style={{ width: '100%', height: '400px' }}
                config={{ displayModeBar: false }}
              />
              <p className="text-gray-400 mt-2">{images.Month.explanation}</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-2 text-gray-200">Sales Forecast</h2>
              <Plot
                data={JSON.parse(images.Forecast.graph).data}
                layout={JSON.parse(images.Forecast.graph).layout}
                style={{ width: '100%', height: '400px' }}
                config={{ displayModeBar: false }}
              />
              <p className="text-gray-400 mt-2">{images.Forecast.explanation}</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-2 text-gray-200">Product Wise Sale</h2>
              <Plot
                data={JSON.parse(images.Product.graph).data}
                layout={JSON.parse(images.Product.graph).layout}
                style={{ width: '100%', height: '400px' }}
                config={{ displayModeBar: false }}
              />
              <p className="text-gray-400 mt-2">{images.Product.explanation}</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-2 text-gray-200">City Wise Sale</h2>
              <Plot
                data={JSON.parse(images.City.graph).data}
                layout={JSON.parse(images.City.graph).layout}
                style={{ width: '100%', height: '400px' }}
                config={{ displayModeBar: false }}
              />
              <p className="text-gray-400 mt-2">{images.City.explanation}</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-2 text-gray-200">Time Wise Sale</h2>
              <Plot
                data={JSON.parse(images.Time.graph).data}
                layout={JSON.parse(images.Time.graph).layout}
                style={{ width: '100%', height: '400px' }}
                config={{ displayModeBar: false }}
              />
              <p className="text-gray-400 mt-2">{images.Time.explanation}</p>
            </div>
          </div>
        )}

        {showDemo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-auto">
              <h2 className="text-2xl font-semibold mb-4">Demo Data Preview</h2>
              <iframe
                src="/uploads/Filtered_DataSet.csv"
                title="Demo Data Preview"
                className="w-full h-[60vh] border border-gray-300 rounded"
              />
              <button
                className="mt-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                onClick={() => setShowDemo(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default StartAnalysisPage
