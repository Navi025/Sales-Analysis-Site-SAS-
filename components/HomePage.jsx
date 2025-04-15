'use client'

import { useRouter } from "next/navigation"
import Image from "next/image"
import { useState, useEffect } from "react"
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 3000); // change image every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white font-poppins">
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

      {/* White space below navbar */}
      <div className="w-full h-[50px] bg-white"></div>

      {/* About and Image Carousel Section */}
      <section className="flex flex-col md:flex-row items-center bg-red-700 text-white px-8 py-12 space-y-8 md:space-y-0 md:space-x-12 max-w-6xl mx-auto">
        {/* Left Text */}
        <div className="md:w-1/2">
          <h2 className="text-3xl font-extrabold mb-4">About KMart</h2>
          <p className="text-lg leading-relaxed">
            Kmart is a large department store chain, primarily operating in the United States and Australia, that sells a wide variety of goods at discounted prices. It's known for its affordable prices on items like clothing, home goods, and toys. Kmart also has a significant online presence.
          </p>
        </div>
        {/* Right Image Carousel */}
        <div className="md:w-1/2 w-full h-64 md:h-96 overflow-hidden shadow-lg bg-red-700 rounded-lg">
          <Image
            src={images[currentImageIndex]}
            alt={`Kmart Image ${currentImageIndex + 1}`}
            className="w-full h-full object-contain rounded-lg"
            priority
          />
        </div>
      </section>

      {/* Hero Banner below About and Carousel */}
      <header className="relative bg-red-700 text-white flex flex-col items-center justify-center h-64 md:h-96 px-8 mt-8">
        <div className="max-w-5xl text-center">
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

      {/* Sales Summary Sections */}
      <main className="flex-grow bg-gray-50 px-8 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-red-700">Monthly Sales</h2>
            <div className="h-48 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
              Chart Placeholder
            </div>
          </section>
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-red-700">Product Sales</h2>
            <div className="h-48 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
              Chart Placeholder
            </div>
          </section>
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-red-700">City Sales</h2>
            <div className="h-48 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
              Chart Placeholder
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-red-900 text-white text-center py-2">
        &copy; {new Date().getFullYear()} Navnitya Vinayak. All rights reserved.
      </footer>
    </div >
  )
}

export default HomePage
