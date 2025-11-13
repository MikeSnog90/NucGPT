// src/pages/Login.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logoSisGPT.svg";
import styles from "./Login.module.css";
import { MOCK_USERS } from "../../mocks/users.js";
import { useAuth } from "../../auth/AuthContext.jsx";

// ===== Utilidades de CPF =====
function validarCPF(cpf) {
	const str = (cpf || "").replace(/\D/g, "");
	if (!str || str.length !== 11 || /^(\d)\1+$/.test(str)) return false;

	const calcDV = (base) =>
		base
			.split("")
			.map((n, i) => parseInt(n, 10) * (base.length + 1 - i))
			.reduce((a, b) => a + b, 0);

	const dv1 = ((calcDV(str.slice(0, 9)) * 10) % 11) % 10;
	const dv2 = ((calcDV(str.slice(0, 10)) * 10) % 11) % 10;
	return dv1 === parseInt(str[9], 10) && dv2 === parseInt(str[10], 10);
}

function mascaraCPF(v) {
	return (v || "")
		.replace(/\D/g, "")
		.slice(0, 11)
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

/*************** TELA LOGIN ****************/
function LoginForm({ onSwitch }) {
	const navigate = useNavigate();
	// const { login } = useAuth();

	// Campos controlados
	const [cpf, setCpf] = useState("");
	const [senha, setSenha] = useState("");
	const [showSenha, setShowSenha] = useState(false);

	// Estado de validação
	const [touched, setTouched] = useState({ cpf: false, senha: false });
	const [submitting, setSubmitting] = useState(false);
	const [formError, setFormError] = useState("");

	// Regras de validação (usa a string mascarada — a função já remove não-dígitos)
	const cpfValido = validarCPF(cpf);
	const senhaValida = senha.length >= 6; // ajuste a regra conforme sua política
	const formValido = cpfValido && senhaValida;

	const handleCpfChange = (e) => {
		const v = e.target.value;
		setCpf(mascaraCPF(v));
	};

	const handleSenhaChange = (e) => {
		setSenha(e.target.value);
	};

	const handleBlur = (field) => {
		setTouched((prev) => ({ ...prev, [field]: true }));
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		setFormError("");

		// Evita submit se inválido
		if (!formValido) {
			setTouched({ cpf: true, senha: true });
			return;
		}

		try {
			setSubmitting(true);

			// 🔐 Aqui você chamaria sua API real:
			// const resp = await api.post('/auth/login', { cpf: cpf.replace(/\D/g,''), senha });
			// if (!resp.ok) throw new Error('Credenciais inválidas');

			// === LOGIN MOKADO ==
			const cpfSemMascara = cpf.replace(/\D/g, "");

			//Normaliza cpf dos mocks para comparar sem mascara
			const user = MOCK_USERS.find(
				(u) => u.cpf.replace(/\D/g, "") == cpfSemMascara
			);

			if (!user || user.senha !== senha) {
				throw new Error("Credenciais inválidas");
			}

			// Mock de sucesso:
			// await new Promise((r) => setTimeout(r, 600));
			// localStorage.setItem("authToken", "valid");

			// Se chegou aqui, usuário autenticado (mock)
			// Salva "token" e dados do usuário para per ler depois
			localStorage.setItem("authToken", "mock-valid");
			localStorage.setItem("authUser", JSON.stringify(user));

			navigate("/perfil");
		} catch (err) {
			setFormError(
				err?.message || "Não foi possível entrar. Tente novamente."
			);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className={styles.containerLogin}>
			<div className={styles.loginBox}>
				<img
					src={Logo}
					alt="Logo"
					className="mb-3 mx-auto d-block"
					style={{ maxWidth: "150px" }}
				/>

				<h5 className="text-center mb-4">Faça o login em sua conta</h5>

				<form onSubmit={handleLogin} noValidate>
					{/* CPF */}
					<div className="mb-3">
						<input
							type="text"
							id="cpf"
							name="cpf"
							placeholder="000.000.000-00"
							inputMode="numeric"
							autoComplete="username"
							className={`form-control ${
								touched.cpf && !cpfValido ? "is-invalid" : ""
							}`}
							value={cpf}
							onChange={handleCpfChange}
							onBlur={() => handleBlur("cpf")}
							aria-invalid={touched.cpf && !cpfValido}
							aria-describedby="cpf-feedback"
							required
							autoFocus
						/>
						{touched.cpf && !cpfValido && (
							<div id="cpf-feedback" className="invalid-feedback">
								CPF inválido.
							</div>
						)}
					</div>

					{/* SENHA */}
					<div className="mb-4">
						<div className="input-group">
							<input
								id="password"
								name="password"
								autoComplete="current-password"
								type={showSenha ? "text" : "password"}
								className={`form-control ${
									touched.senha && !senhaValida
										? "is-invalid"
										: ""
								}`}
								placeholder="Digite sua senha"
								value={senha}
								onChange={handleSenhaChange}
								onBlur={() => handleBlur("senha")}
								aria-invalid={touched.senha && !senhaValida}
								aria-describedby="senha-feedback"
								required
							/>
							<button
								type="button"
								className="btn btn-outline-secondary"
								aria-label={
									showSenha
										? "Ocultar senha"
										: "Mostrar senha"
								}
								onClick={() => setShowSenha((s) => !s)}
							>
								&#128065;
							</button>
						</div>
						{touched.senha && !senhaValida && (
							<div
								id="senha-feedback"
								className="invalid-feedback d-block"
							>
								A senha deve ter 6 caracteres.
							</div>
						)}
					</div>

					{/* Erro geral de autenticação */}
					{formError && (
						<div className="alert alert-danger py-2" role="alert">
							{formError}
						</div>
					)}

					{/* Ações */}
					<div
						className="d-flex flex-column mx-auto"
						style={{ maxWidth: "300px" }}
					>
						<button
							type="submit"
							className="btn btn-success w-100 mb-3"
							disabled={!formValido || submitting}
						>
							{submitting ? "Entrando..." : "Entrar"}
						</button>

						<button
							type="button"
							className="btn btn-primary w-100 mb-3"
							onClick={() => onSwitch("register")}
							disabled={submitting}
						>
							Cadastrar
						</button>

						<button
							type="button"
							className="btn btn-secondary w-100"
							onClick={() => onSwitch("forgot")}
							disabled={submitting}
						>
							Esqueci a senha
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

/****************** REGISTRAR/CADASTRAR *****************/
function Register({ onSwitch }) {
	return (
		<div className={styles.containerLogin}>
			<div className={styles.loginBox}>
				<img
					src={Logo}
					alt="Logo"
					className="mb-3 mx-auto d-block"
					style={{ maxWidth: "150px" }}
				/>
				<h5 className="text-center mb-4">Cadastre-se para acessar</h5>

				<form>
					<input
						type="text"
						className="form-control mb-3"
						id="reg-cpf"
						placeholder="000.000.000-00"
						required
					/>
					<input
						type="password"
						className="form-control mb-3"
						id="reg-password"
						placeholder="Digite sua senha"
						required
					/>
					<input
						type="password"
						className="form-control mb-3"
						id="reg-confirm"
						placeholder="Confirme sua senha"
						required
					/>
				</form>

				<div
					className="d-flex flex-column mx-auto"
					style={{ maxWidth: "300px" }}
				>
					<button
						type="button"
						className="btn btn-primary w-100 mb-2"
					>
						Cadastrar
					</button>
					<button
						type="button"
						className="btn btn-link"
						onClick={() => onSwitch("login")}
					>
						Voltar ao Login
					</button>
				</div>
			</div>
		</div>
	);
}

/****************** ESQUECI A SENHA *****************/
function ForgotPassword({ onSwitch }) {
	return (
		<div className={styles.containerLogin}>
			<div className={styles.loginBox}>
				<img
					src={Logo}
					alt="Logo"
					className="mb-3 mx-auto d-block"
					style={{ maxWidth: "150px" }}
				/>
				<h5 className="text-center">Digite seu Email</h5>

				<form>
					<input
						type="email"
						className="form-control my-2"
						id="email"
						placeholder="voce@exemplo.com"
						required
					/>
				</form>

				<div
					className="d-flex flex-column mx-auto"
					style={{ maxWidth: "300px" }}
				>
					<button
						type="button"
						className="btn btn-primary w-100 mb-3"
					>
						Recuperar Senha
					</button>
					<button
						type="button"
						className="btn btn-link"
						onClick={() => onSwitch("login")}
					>
						Voltar ao Login
					</button>
				</div>
			</div>
		</div>
	);
}

// ===== AuthScreen (Switch entre telas) =====
export default function AuthScreen() {
	const [screen, setScreen] = useState("login");

	return (
		<div>
			{screen === "login" && <LoginForm onSwitch={setScreen} />}
			{screen === "register" && <Register onSwitch={setScreen} />}
			{screen === "forgot" && <ForgotPassword onSwitch={setScreen} />}
		</div>
	);
}
