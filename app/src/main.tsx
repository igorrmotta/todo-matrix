import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ACCENT } from "./theme";
import "./index.css";

// Expose the accent as a CSS variable so hover rules in index.css can use it.
document.documentElement.style.setProperty("--accent", ACCENT);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
