'use client'

import { useRouter } from "next/navigation"
import Image from "next/image"
import { useState, useEffect } from "react"
import dynamic from 'next/dynamic';
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });
import logo from "public/assets/logo.jpg"
import img1 from "public/assets/01.jpg"
import img2 from "public/assets/02.jpg"
import img3 from "public/assets/03.jpg"
import img4 from "public/assets/04.jpg"
import img5 from "public/assets/05.png"

const images = [img1, img2, img3, img4, img5]

const HomePage = () => {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [graphs, setGraphs] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchDemoGraphs = async () => {
      try {
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
        const data = await response.json();
        setGraphs(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchDemoGraphs();
  }, []);

  const plotConfig = {
    displayModeBar: false,
    responsive: true,
    useResizeHandler: true,
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-poppins">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between px-8 h-14 bg-black text-white shadow-md">
        <div className="flex items-center space-x-4 h-full">
          <Image src={logo} alt="Kmart Logo" className="h-[90%] w-auto object-contain" />
          <span className="text-2xl font-bold">Kmart Sales Dashboard</span>
        </div>
        <div className="space-x-6 hidden md:flex">
          <button className="hover:underline" onClick={() => router.push('/')}>Home</button>
          <button className="hover:underline" onClick={() => router.push('/StartAnalysis')}>Start Analysis</button>
          <button className="hover:underline" onClick={() => router.push('/Reports')}>Reports</button>
          <button className="hover:underline" onClick={() => router.push('/Settings')}>Settings</button>
        </div>
      </nav>

      {/* White space below navbar */}
      <div className="w-full h-[50px] bg-white"></div>

      {/* About and Image Carousel Section */}
      <section className="flex flex-col md:flex-row items-center bg-red-700 text-white px-8 py-12 space-y-8 md:space-y-0 md:space-x-12 max-w-6xl mx-auto">
        <div className="md:w-1/2">
          <h2 className="text-3xl font-extrabold mb-4">About KMart</h2>
          <p className="text-lg leading-relaxed">
            Kmart is a large department store chain, primarily operating
            in the United States and Australia, that sells a wide variety
            of goods at discounted prices. It's known for its affordable
            prices on items like clothing, home goods, and toys. Kmart also
            has a significant online presence.
          </p>
        </div>
        <div className="md:w-1/2 w-full h-64 md:h-96 overflow-hidden shadow-lg bg-red-700 rounded-lg group">
          <Image
            src={images[currentImageIndex]}
            alt={`Kmart Image ${currentImageIndex + 1}`}
            className="w-full h-full object-contain rounded-lg transform transition-transform duration-300 group-hover:scale-110"
            priority
          />
        </div>
      </section>

      {/* Hero Banner */}
      <header className="relative bg-red-700 text-white flex flex-col items-center justify-center h-64 md:h-96 px-8 mt-8 text-center">
        <div className="max-w-5xl">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Welcome to Kmart Sales Analysis
          </h1>
          <p className="text-lg md:text-2xl max-w-3xl mx-auto mb-8">
            Gain insights into your sales data to drive smarter business decisions.
          </p>
          <button
            className="bg-white text-red-600 font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-gray-100 transition"
            onClick={() => router.push('/StartAnalysis')}
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Sales Summary Graphs */}
      <main className="flex-grow bg-gray-50 px-4 md:px-8 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {['Month', 'City', 'Forecast'].map((key, index) => (
            <section key={index} className="bg-white rounded-lg shadow p-4 md:p-6 h-[350px]">
              <h2 className="text-xl font-semibold mb-4 text-red-700">
                {key === 'Month' && 'Month Wise Sale'}
                {key === 'City' && 'City Wise Sale'}
                {key === 'Forecast' && 'Sales Forecast For 6 Months'}
              </h2>
              {graphs ? (
                <Plot
                  data={JSON.parse(graphs[key].graph).data}
                  layout={{
                    ...JSON.parse(graphs[key].graph).layout,
                    autosize: true,
                    title: '',
                    margin: { t: 20, l: 40, r: 10, b: 40 },
                  }}
                  useResizeHandler
                  className="w-full h-full"
                  config={plotConfig}
                />
              ) : (
                <div className="h-full bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                  Loading...
                </div>
              )}
            </section>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-red-900 text-white text-center py-2">
        &copy; {new Date().getFullYear()} Navnitya Vinayak. All rights reserved.
      </footer>
    </div>
  );
}

export default HomePage;
