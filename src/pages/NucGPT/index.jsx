// src/pages/NucGPT/index.jsx

import React from "react";
import NucGPTChat from "./NucGPTChat";
import styles from "./stylesChat.module.css";

const NucGPTPage = () => {
	return (
		<div className={styles["nucgpt-container"]}>
			<header className={styles["nucgpt-header"]}>
				<h1 className={styles.headerTitle}>NucGPT</h1>
				<p>O futuro da inteligência artificial ao seu alcance.</p>
			</header>

			<section className={styles.features}>
				<div className={styles.feature}>
					<h2>Rápido</h2>
					<p>Respostas instantâneas para suas perguntas.</p>
				</div>
				<div className={styles.feature}>
					<h2>Confiável</h2>
					<p>Informações precisas e seguras.</p>
				</div>
				<div className={styles.feature}>
					<h2>Fácil de usar</h2>
					<p>Interface intuitiva para todos os usuários.</p>
				</div>
			</section>

			{/* Chat conectado à API Passando os estilos*/}
			<NucGPTChat chatStyles={styles} />

			<footer className={styles["nucgpt-footer"]}>
				<p>
					© 2025 SupTec - Divisão de Desenvolvimento de Sistemas.
					Todos os direitos reservados.
				</p>
			</footer>
		</div>
	);
};

export default NucGPTPage;
