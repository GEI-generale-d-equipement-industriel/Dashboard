import React, { useState } from "react";
import LoginModal from "../components/Modal/Login.Modal";
import SignupModal from "../components/Modal/Signup.Modal";
import CandidatePreview from "../components/preview/CandidatePreview";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LandingPage = () => {
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  // const [isJoinModalVisible, setIsJoinModalVisible] = useState(false); // not used now

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
  const scrollToPreview = () => {
    // console.log("clicked");
    
    const previewSection = document.getElementById('candidate-preview');
    if (previewSection) {
      previewSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };
  // Handler for "Join as a Creator" (redirect to external form)
  const handleJoinCreator = () => {
    window.location.href = "https://be-model.tn/form";
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <header className="h-24 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 shadow-lg sticky top-0 z-50">
  <div className="container mx-auto flex justify-between items-center px-6 py-4">
    <div className="flex items-center space-x-8">
      <motion.a
        href="/"
        className="flex items-center space-x-3 hover:opacity-90 transition-opacity duration-300"
        aria-label="BeModel homepage"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <img
          src="/assets/BeModel.png"
          alt="BeModel logo showcasing brand empowerment"
          className="h-8 w-32 object-contain"
          loading="lazy"
        />
      </motion.a>
      <motion.button
        onClick={scrollToPreview}
        className="text-white-400 font-bold text-xl hover:text-yellow-500 transition-opacity duration-300 ml-4"
        aria-label="Scroll to Preview section"
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
      >
        Try it your self 
      </motion.button>
    </div>

    <nav className="flex items-center space-x-6" aria-label="Main navigation">
      <motion.button
        className="bg-yellow-500 text-black px-6 py-2.5 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 shadow-lg hover:shadow-yellow-500/20"
        onClick={showLoginModal}
        aria-label="Open Login Modal"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Login
      </motion.button>
    </nav>
  </div>
</header>

      {/* Hero Section */}
      <main>
        <section className="py-24 text-center bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container mx-auto px-6">
            <motion.h1 
              className="text-6xl font-bold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Matching <span className="text-yellow-500">Brands</span> &{" "}
              <span className="text-yellow-500">Creators</span>
            </motion.h1>
            <motion.p 
              className="text-gray-300 text-xl mt-4 max-w-2xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              The only platform you need for content creation.
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <motion.div 
                className="flex flex-col items-center group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="relative overflow-hidden rounded-xl shadow-2xl mb-6 transform transition-transform duration-300 group-hover:scale-105">
                  <img
                    src="/assets/brand.webp"
                    alt="Professional shoot for a brand"
                    className="w-full h-[300px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <motion.button
                  onClick={() => navigate("/brandform", { replace: true })}
                  className="bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-all duration-300 shadow-lg hover:shadow-yellow-500/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Join as a Brand
                </motion.button>
              </motion.div>
              <motion.div 
                className="flex flex-col items-center group"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="relative overflow-hidden rounded-xl shadow-2xl mb-6 transform transition-transform duration-300 group-hover:scale-105">
                  <img
                    src="/assets/creator.webp"
                    alt="Collaboration with a creator"
                    className="w-full h-[300px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <motion.button
                  onClick={handleJoinCreator}
                  className="bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-all duration-300 shadow-lg hover:shadow-yellow-500/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Join as a Creator
                </motion.button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <motion.h2 
              className="text-3xl font-bold text-center text-gray-800 mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Used by Leading Brands
            </motion.h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-12 items-center justify-items-center">
              {["KA","BE", "TI","TR","TE"].map((brand, index) => (
                <motion.img
                  key={brand}
                  src={`/Logos/${brand}.svg`}
                  alt={`${brand} logo`}
                  className="h-28 object-contain  transition-all duration-300 hover:scale-110"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="py-24 bg-gray-900">
          <div className="container mx-auto px-6">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold mb-6">
                How does it <span className="text-yellow-500">work</span>?
              </h2>
              <p className="text-gray-300 text-lg">Join a network of 2k+ Creators & 20+ Brands</p>
            </motion.div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div 
                className="space-y-12"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="space-y-6 bg-gray-800/50 p-8 rounded-xl backdrop-blur-sm">
                  <h3 className="text-2xl font-semibold text-yellow-500">For Creators</h3>
                  <ul className="space-y-4">
                    {[
                      "Connect with leading brands for collaboration opportunities",  
                      "Showcase your portfolio to potential clients",
                      "Access professional resources and community support",
                    ].map((text, index) => (
                      <motion.li 
                        key={index} 
                        className="flex items-start space-x-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        <span className="text-yellow-500 text-xl">•</span>
                        <span className="text-gray-300 text-lg">{text}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-6 bg-gray-800/50 p-8 rounded-xl backdrop-blur-sm">
                  <h3 className="text-2xl font-semibold text-yellow-500">For Brands</h3>
                  <ul className="space-y-4">
                    {[
                      "Find the perfect creators for your campaigns",
                      "Streamline content creation and collaboration",
                      "Track campaign performance and ROI",
                    ].map((text, index) => (
                      <motion.li 
                        key={index} 
                        className="flex items-start space-x-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        <span className="text-yellow-500 text-xl">•</span>
                        <span className="text-gray-300 text-lg">{text}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
              <motion.div 
                className="relative aspect-video rounded-xl overflow-hidden shadow-2xl"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <video className="w-full h-full object-cover" controls poster="/assets/video-thumbnail.jpg">
                  <source src="/assets/how-it-works.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </motion.div>
            </div>
          </div>
        </section>

        <div id="candidate-preview" className="scroll-mt-24">
  <CandidatePreview />
</div>

        {/* Testimonials Section */}
        <section className="py-24 bg-gray-100">  
          <div className="container mx-auto px-6">
            <motion.h2 
              className="text-4xl font-bold text-center text-gray-800 mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              What Our Users Say
            </motion.h2>
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
                <motion.div 
                  key={index} 
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="bg-white rounded-2xl p-8 min-h-[300px] w-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="flex flex-col items-center">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-yellow-500 rounded-full blur-xl opacity-20"></div>
                        <img
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.name}
                          className="w-28 h-28 rounded-full object-cover relative z-10 border-4 border-yellow-500"
                        />
                      </div>
                      <h3 className="text-yellow-500 text-xl font-bold mb-4">{testimonial.name}</h3>
                      <p className="text-gray-700 text-center leading-relaxed">{testimonial.text}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 text-gray-400">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-center md:text-left">&copy; 2024-2025 BeModel. All rights reserved.</p>
          <nav aria-label="Footer navigation">
            <div className="flex space-x-6">
              <a href="#" className="hover:text-yellow-500 transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-yellow-500 transition-colors duration-300">
                Terms & Conditions
              </a>
            </div>
          </nav>
        </div>
      </footer>

      {/* Modals */}
      {isLoginModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-black/80 backdrop-blur-sm">
          <LoginModal onClose={closeLoginModal} />
        </div>
      )}
      {isSignupModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-black/80 backdrop-blur-sm">
          <SignupModal onClose={closeSignupModal} />
        </div>
      )}
    </div>
  );
};

export default LandingPage;
