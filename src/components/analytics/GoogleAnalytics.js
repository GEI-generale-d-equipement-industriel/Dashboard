import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import TagManager from "react-gtm-module";

const GoogleAnalytics = () => {
  const location = useLocation();
  const id=process.env.REACT_APP_GTM_ID; 
  
  
  useEffect(() => {
    TagManager.initialize({
      gtmId: id, // Replace with your Google Tag Manager ID
    });

    TagManager.dataLayer({
      dataLayer: {
        event: "pageview",
        pagePath: location.pathname + location.search,
        pageTitle: document.title,
      },
    });
  }, [location]);

  return null;
};

export default GoogleAnalytics;
