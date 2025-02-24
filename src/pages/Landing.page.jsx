import React, { useState } from "react";
import LoginModal from "../components/Modal/Login.Modal";
import SignupModal from "../components/Modal/Signup.Modal";
import CandidatePreview from "../components/preview/CandidatePreview";
import { useSearchParams, useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isJoinModalVisible, setIsJoinModalVisible] = useState(false); // not used now

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // We'll use a URL param "signup=true" to trigger the Signup modal.
  const isSignupModalVisible = searchParams.get("signup") === "true";

  // Handlers for Login modal
  const showLoginModal = () => setIsLoginModalVisible(true);
  const closeLoginModal = () => setIsLoginModalVisible(false);

  // Handler for Signup modal (driven by URL param)
  const closeSignupModal = () => {
    searchParams.delete("signup");
    navigate("/", { replace: true });
  };

  // Handler for "Join as a Creator" (redirect to external form)
  const handleJoinCreator = () => {
    window.location.href = "https://be-model.tn/form";
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
          <a
            href="/"
            className="flex items-center space-x-3 hover:opacity-90 transition-opacity duration-300"
            aria-label="BeModel homepage"
          >
            <img
              src="/assets/BeModel.png"
              alt="BeModel logo showcasing brand empowerment"
              className="h-5 w-28"
              loading="lazy"
            />
          </a>
          <nav className="flex items-center space-x-6" aria-label="Main navigation">
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
              onClick={showLoginModal}
              aria-label="Open Login Modal"
            >
              Login
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="py-20 text-center bg-gray-900">
          <div className="container mx-auto px-6">
             <h1 className="text-5xl font-bold leading-tight mb-4">
              Matching <span className="text-yellow-500">Brands</span> &{" "}
              <span className="text-yellow-500">Creators</span>
            </h1>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            The only platform you need for content creation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="flex flex-col items-center">
                <img
                  src="/assets/brand.webp"
                  alt="Professional shoot for a brand"
                  className="w-full h-[300px] object-contain rounded-lg shadow-lg mb-6"
                />
                <button
                  onClick={() => navigate("/brandform", { replace: true })}
                  className="bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition duration-300"
                >
                  Join as a Brand
                </button>
              </div>
              {/* Creator Column */}
              <div className="flex flex-col items-center">
                <img
                  src="/assets/creator.webp"
                  alt="Collaboration with a creator"
                  className="w-full h-[300px] object-contain rounded-lg shadow-lg mb-6"
                />
                <button
                  onClick={handleJoinCreator}
                  className="bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition duration-300"
                >
                  Join as a Creator
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-8 bg-gray-100">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-semibold text-center text-gray-600 mb-6">Used by Leading Brands</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center">
              {["KA","BE",  "TI","TR","TE"].map((brand) => (
                <img
                  key={brand}  
                  src={`/Logos/${brand}.svg `}
                  alt={`${brand} logo`}
                  className="h-28 object-contain filter    hover:opacity-100 transition-opacity duration-300"
                />
              ))}
            </div>
          </div>
        </section>
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">
                How does it <span className="text-yellow-500">work</span> ?
              </h2>
              <p className="text-gray-400">Join a network of 2k+ Creators & 20+ Brands</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-yellow-500">For Creators</h3>
                  <ul className="space-y-4">
                    {[
                      "Connect with leading brands for collaboration opportunities",  
                      "Showcase your portfolio to potential clients",
                      "Access professional resources and community support",
                    ].map((text, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-yellow-500 mr-2">•</span>
                        <span className="text-gray-300">{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-yellow-500">For Brands</h3>
                  <ul className="space-y-4">
                    {[
                      "Find the perfect creators for your campaigns",
                      "Streamline content creation and collaboration",
                      "Track campaign performance and ROI",
                    ].map((text, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-yellow-500 mr-2">•</span>
                        <span className="text-gray-300">{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl">
                <video className="w-full h-full object-cover" controls poster="/assets/video-thumbnail.jpg">
                  <source src="/assets/how-it-works.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </section>
{/* <CandidatePreview /> */}
        {/* Testimonials Section - New */}
        <section className="py-20 bg-gray-100">
          <div className="container mx-auto px-6">
           
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  name: "Wassim G",
                  image: "/assets/user1.png",
                  text: "Aamelt 2 shooting maa market contactewni aal BeModel. Nes el kol professionnel w ambiance behia.",
                },
                {
                  name: "Siwar K",
                  image: "/assets/user2.png",
                  text: "Aamelt 2 shooting maa market contactewni aal BeModel. Nes el kol professionnel w ambiance behia.",
                },
                {
                  name: "Monia B",
                  image: "/assets/user3.png",
                  text: "Aamelt 2 shooting maa market contactewni aal BeModel. Nes el kol professionnel w ambiance behia.",
                },
                {
                  name: "Wassim G",
                  image: "/assets/user4.png",
                  text: "Aamelt 2 shooting maa market contactewni aal BeModel. Nes el kol professionnel w ambiance behia.",
                },
              ].map((testimonial, index) => (
                <div key={index} className="flex flex-col items-center">
                
                <div className="bg-gray-200 rounded-lg p-6 min-h-[200px] w-full shadow-2xl">
                <div className={` rounded-full flex items-center justify-center mb-6`}>
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-28 h-28 rounded-full object-cover"
                  />
                </div>
                <h3 className="text-yellow-500 text-center text-xl font-bold mb-4">{testimonial.name}</h3>
                  <p className="text-gray-800 text-center font-bold leading-relaxed">{testimonial.text}</p>
                </div>
              </div>
              ))}
            </div>
          </div>
        </section>
              
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 py-6 text-gray-400">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <p>&copy; 2024-2025 BeModel. All rights reserved.</p>
          <nav aria-label="Footer navigation">
            <div className="flex space-x-4">
              <a href="#" className="hover:text-yellow-500">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-yellow-500">
                Terms & Conditions
              </a>
            </div>
          </nav>
        </div>
      </footer>

      {/* Modals */}
      {isLoginModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-black bg-opacity-50 backdrop-blur-sm">
          <LoginModal onClose={closeLoginModal} />
        </div>
      )}
      {isSignupModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-black bg-opacity-50 backdrop-blur-sm">
          <SignupModal onClose={closeSignupModal} />
        </div>
      )}
    </div>
  );
};

export default LandingPage;
