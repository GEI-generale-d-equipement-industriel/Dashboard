import React from "react";
import { ConfigProvider } from "antd";

// Ant Design theme scoped to the talent list and candidate pages, so the rest
// of the dashboard keeps its current look.
const theme = {
  token: {
    colorPrimary: "#14110b",
    colorInfo: "#14110b",
    colorLink: "#14110b",
    colorBgBase: "#ffffff",
    colorTextBase: "#14110b",
    colorBorder: "#e0dacb",
    borderRadius: 10,
    fontFamily: "'Libre Franklin', system-ui, sans-serif",
  },
  components: {
    Slider: {
      trackBg: "#f0b71d",
      trackHoverBg: "#d99d00",
      handleColor: "#14110b",
      handleActiveColor: "#14110b",
      railBg: "#ece7da",
      railHoverBg: "#e3dccb",
      dotBorderColor: "#e0dacb",
    },
    Switch: { colorPrimary: "#14110b" },
    Select: { optionSelectedBg: "#fdf3d4", borderRadiusLG: 12 },
    Input: { borderRadiusLG: 12, activeShadow: "0 0 0 3px rgba(240, 183, 29, 0.35)" },
    Modal: { borderRadiusLG: 20 },
  },
};

const BmTheme = ({ children }) => <ConfigProvider theme={theme}>{children}</ConfigProvider>;

export default BmTheme;
