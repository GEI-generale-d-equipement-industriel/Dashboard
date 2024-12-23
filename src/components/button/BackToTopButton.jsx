import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { UpOutlined } from "@ant-design/icons";

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show/hide button based on scroll position
  const handleScroll = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll back to the top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scroll
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    isVisible && (
        <Button
        shape="circle"
        icon={<UpOutlined />}
        onClick={scrollToTop}
        className="fixed bottom-10 right-10 z-50 shadow-lg bg-yellow-500 text-white hover:bg-yellow-600 border-none"
      />
      
    )
  );
};

export default BackToTopButton;
