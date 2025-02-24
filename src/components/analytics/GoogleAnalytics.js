import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Push pageview event to dataLayer on route change
    if (window.dataLayer) {
      window.dataLayer.push({
        event: "pageview", // Standard event name for GTM
        pagePath: location.pathname + location.search, // Current URL
        pageTitle: document.title, // Current page title
      });
    } else {
      console.warn("dataLayer is not defined");
    }
  }, [location]);

  return null; // This component does not render anything
};

export default GoogleAnalytics;
