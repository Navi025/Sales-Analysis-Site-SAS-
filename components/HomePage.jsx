'use client'

import { useRouter } from "next/navigation"
import Image from "next/image"
import { logo } from "@/public/assets"
import { Kmart } from "@/public/assets"
const HomePage = () => {
    const router = useRouter();
  return (
      <div>
          <div className="flex items-center justify-center font-poppins flex-col gap-10">              
            <h1 className="text-[100px] text_gradient">
                Sales Analysis
              </h1>
              <div className="flex items-center justify-between">
                  <p>KMart Corporation is a renowned American retail giant, widely recognized for its significant presence in the retail industry. Established in 1899, the company has a long and storied history that has evolved over the years. KMart's mission has always revolved around providing affordable and accessible shopping solutions to its diverse customer base, making it a household name across the United States. The corporation's retail empire comprises a vast network of stores that offer a wide range of products, including clothing, household items, electronics, and much more. Over the years, KMart has established a strong brand identity, combining quality with affordability, making it a go-to destination for budget-conscious consumers. This commitment to value and customer satisfaction has helped KMart maintain its position as a leading player in the retail industry. As a part of the Sears Holdings Corporation, KMart has undergone several transformations to adapt to the ever-changing retail landscape. The company has embraced technology and data analysis to enhance its operations and customer experience. In this context, this project aims to delve into the data analysis of KMart's sales data to gain insights that can further strengthen its competitive edge in the market.</p>
                  <Image src={Kmart} alt="Logo" className="w-[820px]"/>
              </div>
              <button type="button" className="blue_gradient_btn w-[10rem]" onClick={()=>router.push('/StartAnalysis')}>Get Started</button>
          </div>

    </div>
  )
}

export default HomePage