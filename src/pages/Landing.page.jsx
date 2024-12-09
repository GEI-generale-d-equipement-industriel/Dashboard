import React,{useState} from "react";
import { Modal } from "antd";
import LoginModal from "../components/Modal/Login.Modal";
const LandingPage = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity duration-300">
            <img
              src="/assets/BeModel1.png"
              alt="BeModel Logo"
              className="h-5 w-24"
            />
            {/* <span className=" text-2xl font-bold text-yellow-500">
              BeModel.
            </span> */}
          </a>

          {/* Navigation */}
          <div className="flex items-center space-x-6">
            <a
              href="#about"
              className="text-gray-400 hover:text-yellow-500 transition duration-300"
            >
              About Us
            </a>
            <a
              href="#services"
              className="text-gray-400 hover:text-yellow-500 transition duration-300"
            >
              Services
            </a>
            <button
              className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-300"
              onClick={showModal}
            >
              Login
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center bg-gray-900">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold leading-tight text-white">
            Empower Your Brand
          </h1>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Connecting brands with models and influencers for impactful content.
          </p>
          <a
            href="https://www.be-model.tn/form/"
            className="mt-6 inline-block bg-yellow-500 text-black px-6 py-3 rounded-lg hover:bg-yellow-600 font-semibold shadow-md transition"
          >
            Join BeModel Now
          </a>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-800 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-yellow-500">
            Why Choose BeModel?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            {[
              {
                title: "Curated Talent",
                desc: "Access a diverse network of professional models and influencers.",
              },
              {
                title: "Seamless Collaboration",
                desc: "Simplified tools to connect and create impactful campaigns.",
              },
              {
                title: "Authentic Content",
                desc: "Build trust with content that connects emotionally.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="text-xl font-semibold text-yellow-500">
                  {item.title}
                </h3>
                <p className="text-gray-400 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-6 text-gray-400">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <p>&copy; 2024 BeModel. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-yellow-500">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-yellow-500">
              Terms & Conditions
            </a>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {isModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black bg-opacity-50 transition-opacity duration-300">
          <LoginModal onClose={handleCloseModal} />
        </div>
      )}
    </div>
  );
};

export default LandingPage;
