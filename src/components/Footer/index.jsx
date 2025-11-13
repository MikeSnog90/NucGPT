// src/components/Footer

import React, { useState } from "react";
import style from "./Footer.module.css";

export default function Footer() {
	return (
		<footer className={style.footer}>
			<span>
				© {new Date().getFullYear()} — SisGPT - Divisão de Sistemas
				Digitais - DDNM-21.3
			</span>
		</footer>
	);
}
