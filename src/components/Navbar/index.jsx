import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import Logo from "../../assets/logoSisGPT.svg";
import UserIcon from "../../assets/vetor.svg";

export default function Navbar() {
	const navigate = useNavigate();
	const isAuthenticated = !!localStorage.getItem("authToken");

	const handleLogout = () => {
		localStorage.removeItem("authToken");
		navigate("/");
	};

	const navLinks = [
		{ to: "/perfil", label: "Perfil" },
		{ to: "/qualidade", label: "Prévia da Qualidade" },
		{ to: "/referencia", label: "Referência Cruzada" },
		{ to: "/status", label: "Status do Projeto" },
		{ to: "/gestao", label: "Gestão de Pessoas" },
		{ to: "/chat", label: "NucChat" },
	];

	return (
		<nav className={`navbar navbar-expand-md ${styles.navbar}`}>
			<div className="container-fluid px-3">
				{/* Logo à esquerda */}
				{/* <link className="navbar-brand p-0" to="/"> */}
				<img src={Logo} alt="SisGPT" className={styles.imgNavbar} />
				{/* </link> */}

				{/* Botão Hamburger (modile) */}
				<button
					className={`navbar-toggler ${styles.navbarToggler}`}
					type="button"
					data-bs-toggle="colapse"
					data-bs-target="#navbarContent"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span
						className={`navbar-toggler-icon ${styles.navbarTogglerIcon}`}
					></span>
				</button>

				<div className="collapse navbar-collapse justify-content-center">
					<ul className="navbar-nav">
						{navLinks.map((link) => (
							<li key={link.to} className="nav-item mx-2">
								<Link to={link.to} className={styles.navLink}>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</div>

				{/* Avatar + Dropdown à direita */}
				{isAuthenticated && (
					<div className="ms-auto">
						<div className="dropdown">
							<button
								className="btn btn-link p-0"
								data-bs-toggle="dropdown"
								aria-label="Menu do usuário"
							>
								<img
									src={UserIcon}
									alt="Foto de perfil"
									className={styles["imgAvatar"]}
								/>
							</button>
							<ul className="dropdown-menu dropdown-menu-end">
								<li>
									<button
										className="dropdown-item"
										onClick={handleLogout}
									>
										Logout
									</button>
								</li>
							</ul>
						</div>
					</div>
				)}
			</div>
		</nav>
	);
}
