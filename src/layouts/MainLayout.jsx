// MainLayout.jsx

import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "./MainLayout.module.css";

export default function MainLayout() {
	return (
		<>
			<div className={styles.container}>
				<Navbar />
				<main className={styles.main}>
					<Outlet />
				</main>
				<Footer />
			</div>
		</>
	);
}
