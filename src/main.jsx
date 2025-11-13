// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
//bootstrap (somente precisa importar uma vez!!!)
import "./styles/bootstrap/css/bootstrap.min.css";
import "./styles/bootstrap/js/bootstrap.bundle.min.js";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
