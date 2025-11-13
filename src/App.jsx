// src/App.jsx

import React from "react";

import ProtectedRoute from "./auth/ProtectedRoute";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login/index.jsx";
import Perfil from "./pages/Perfil/index.jsx";
import Qualidade from "./pages/Qualidade/index.jsx";
import Referencia from "./pages/Referencia/index.jsx";
import NucGPTPage from "./pages/NucGPT";
import "./index.css";

export default function App() {
	return (
		<BrowserRouter basename="/nucgpt">
			<Routes>
				<Route path="/" element={<Login />} />
				<Route
					element={
						<ProtectedRoute>
							<MainLayout />
						</ProtectedRoute>
					}
				>
					<Route path="/perfil" element={<Perfil />} />
					<Route path="/chat" element={<NucGPTPage />} />
					<Route path="/qualidade" element={<Qualidade />} />
					<Route path="/referencia" element={<Referencia />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
