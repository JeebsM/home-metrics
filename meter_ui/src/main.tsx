import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import axios from "axios";

const apiUriKey: string = import.meta.env.VITE_API_URI;
const apiUri: string = apiUriKey.split(" ")[0].replace(/'/g, "");

axios.defaults.baseURL = apiUri;
// axios.defaults.baseURL = "http://localhost:4430/";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
