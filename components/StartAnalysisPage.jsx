'use client'


import { useState } from "react"
import { useRouter } from "next/navigation";


const StartAnalysisPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [images, setImages] = useState(null);
  const [clicked , setClicked] = useState(false);
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
    }
  };

  return (
    <div>
        <div className="flex items-center justify-center mb-32 font-poppins flex-col gap-10">              
            <h1 className="text-[100px] text_gradient ">
                Sales Analysis
            </h1>
        <h1 className='text-[60px] text-blue-700'>
          Upload file for Analysis
        </h1>
        <form className='flex flex-col items-center gap-10'>
          <input type="file" accept='.csv' className='border w-[30rem]' onChange={handleFileChange} />
          <button type='button' className='blue_gradient_btn' onClick={handleAnalyse}>Analyse</button>
        </form>
      </div>
        { clicked && images == null && (
            <div className="flex h-screen items-center justify-center">
                <h1 className="text-[3rem] xs:text-[5rem]  md:text-[10rem] text-gradient text-center">
                    Loading!... <br /> Please Wait
                </h1>
            </div> 
        )}


        { !clicked && images !=null && (
        <div className="grid-cols-2 grid place-items-center gap-8 text-center">
          <div>
            <h2>Month Wise Sale</h2>
            <img src={`data:image/png;base64,${images.Month}`} alt="Month Wise Sale" className="w-[30rem]"/>
          </div>
          
          <div>
            <h2>Product Wise Sale</h2>
            <img src={`data:image/png;base64,${images.Product}`} alt="Product Wise Sale" className="w-[30rem]"/>
          </div>
          
          <div>
            <h2>City Wise Sale</h2>
            <img src={`data:image/png;base64,${images.City}`} alt="City Wise Sale" className="w-[30rem]"/>
          </div>
          
          <div>
            <h2>Time Wise Sale</h2>
            <img src={`data:image/png;base64,${images.Time}`} alt="Time Wise Sale" className="w-[30rem]"/>
          </div>
        </div>
      )}
    </div>
  )
}

export default StartAnalysisPage