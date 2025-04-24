import React from 'react'
import Header from '../components/Headers/AnimatedHedaer'
import TalentRecruiterForm from '../components/Forms/TalentRecruiterForm'
import { Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

function BrandForm() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <Header />
      <main className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
        <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={handleBack}
              className="mr-4 hover:bg-gray-100 flex items-center"
            >
              Back to Home
            </Button>
          <div className="m-6 flex items-center">
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 text-center">
                Join BeModel as a Brand
              </h1>
              <p className="text-gray-600 text-center mt-2">
                Connect with talented models and influencers for your brand
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="p-6 sm:p-8 md:p-10">
              <TalentRecruiterForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default BrandForm