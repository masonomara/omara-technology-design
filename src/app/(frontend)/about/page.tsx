import Image from 'next/image'
import React from 'react'

export default function page() {
  return (
    <main className="standardPageContainer">
      <div className="standardPageWrapper">
        <h1 className="title">About</h1>

        <div className="companyTitle">
          <Image src="/longWordmark.svg" height={12} width={208} alt="O’Mara Technology & Design" className="companyTitleImage" />
          <Image src="/condensedWordmark.svg" height={24} width={142} alt="O’Mara Technology & Design" className="companyTitleImageCondensed" />
          <Image src="/superCondensedWordmark.svg" height={36} width={87} alt="O’Mara Technology & Design" className="companyTitleImageSuperCondensed" />
        </div>
      </div>
    </main>
  )
}
