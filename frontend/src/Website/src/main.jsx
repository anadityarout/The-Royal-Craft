import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Appmain from "./Appmain";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Appmain />
  </BrowserRouter>
);