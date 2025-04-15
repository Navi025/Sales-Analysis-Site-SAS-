'use client'

import { useState } from "react"
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "public/assets/logo.jpg";

const StartAnalysisPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [images, setImages] = useState(null);
  const [clicked, setClicked] = useState(false);
  const router = useRouter()

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleAnalyse = async () => {
    setClicked(true)
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
      console.log(result);
      setImages(result);
      setClicked(false);
    } catch (error) {
      console.error('Error analyzing file:', error.message);
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
        <div className="max-w-4xl w-full flex flex-col items-center gap-10">
          <h1 className="text-6xl font-extrabold text-center text-gradient">
            Sales Analysis
          </h1>
          <h2 className="text-3xl text-gray-300 text-center">
            Upload file for Analysis
          </h2>
          <form className="flex flex-col items-center gap-6 w-full max-w-md">
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
              <h2 className="text-2xl font-semibold mb-4 text-gray-200">Month Wise Sale</h2>
              <img
                src={`data:image/png;base64,${images.Month}`}
                alt="Month Wise Sale"
                className="w-full rounded-lg shadow-md"
              />
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-200">Product Wise Sale</h2>
              <img
                src={`data:image/png;base64,${images.Product}`}
                alt="Product Wise Sale"
                className="w-full rounded-lg shadow-md"
              />
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-200">City Wise Sale</h2>
              <img
                src={`data:image/png;base64,${images.City}`}
                alt="City Wise Sale"
                className="w-full rounded-lg shadow-md"
              />
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-200">Time Wise Sale</h2>
              <img
                src={`data:image/png;base64,${images.Time}`}
                alt="Time Wise Sale"
                className="w-full rounded-lg shadow-md"
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-red-900 text-white text-center py-2">
        &copy; {new Date().getFullYear()} Navnitya Vinayak. All rights reserved.
      </footer>

      {/* Loader CSS */}
      <style jsx>{`
        .loader {
          border-top-color: #3498db;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default StartAnalysisPage