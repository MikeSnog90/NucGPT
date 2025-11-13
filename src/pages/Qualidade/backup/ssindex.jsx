// src/pages/Qualidade/index.jsx

/** quero uma pagina em react apenas as bases sem lógica
na pasta src/page/qualidade.jsx 
quero uma pagina que chame dois components que criaremos posteriormente 
sendo um aba lateral esquerda para o compoment Sidebar, 
e uma área à direita para um component MainContent.
fundo brando sem estilizar, porém responsivo quando em small o aside fica oculto */

// src/pages/Qualidade/index.jsx

import React from "react";
import Sidebar from "../../components/Sidebar/";
import MainContent from "../../components/MainContent/Qualidade";
// Atualizado
import styles from "./Qualidade.module.css";

export default function Qualidade() {
	return (
		<div className={styles.qualidadePage}>
			<aside className={styles.sidebar}>
				<Sidebar />
			</aside>
			<main className={styles.mainContent}>
				<MainContent />
			</main>
		</div>
	);
}
