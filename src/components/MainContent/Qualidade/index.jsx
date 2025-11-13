// // src/components/MainContent/index.jsx

import React, { useCallback } from "react";
import Dropzone from "../../Dropzone/index.jsx";
import styles from "./MainContent.module.css";

export default function MainContent() {
	//return (
	// <div className={styles.mainContent}>
	// 	<header className={styles.header}>
	// 		<h1>Página Qualidade</h1>
	// 		<p>Bem-vindo ao módulo de controle de qualidade.</p>
	// 	</header>

	// 	<section className={styles.content}>
	// 		<div className={styles.card}>
	// 			<h2>Resumo de Indicadores</h2>
	// 			<p>Dados serão carregados aqui futuramente......</p>
	// 		</div>

	// 		<div className={styles.card}>
	// 			<h2>Gráficos</h2>
	// 			<p>Visualizações interativas serão adicionadas......</p>
	// 		</div>
	// 	</section>
	// </div>

	const handleFiles = (files) => {
		const pdfs = files.filter(
			(file) =>
				file.type === "application/pdf" ||
				file.name.toLowerCase().endsWith(".pdf")
		);

		console.log("PDFs recebidos:", pdfs);
	};

	return (
		<div style={{ padding: 20 }}>
			<h1>Upload de PDFs</h1>
			<Dropzone onFiles={handleFiles} />
		</div>
	);
}
