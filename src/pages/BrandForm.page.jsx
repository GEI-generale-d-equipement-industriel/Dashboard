import React from 'react'
import Header from '../components/Headers/AnimatedHedaer'
import TalentRecruiterForm from '../components/Forms/TalentRecruiterForm'
function BrandForm() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <Header />
      <main className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        {/* <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden"> */}
          <div className="p-6 sm:p-8 md:p-10 ">
            
            <TalentRecruiterForm />
          </div>
        
      </main>
    </div>
  )
}

export default BrandForm