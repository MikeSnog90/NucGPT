import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Perfil.module.css";

function formatarCPF(v) {
	return (v || "")
		.replace(/\D/g, "")
		.slice(0, 11)
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export default function UserProfileForm() {
	const navigate = useNavigate();

	// Estado do formulário
	const [nome, setNome] = useState("");
	const [cpf, setCpf] = useState("");
	const [setor, setSetor] = useState("");
	const [senha, setSenha] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	// Armazenamento (mock)
	const [armazenamento, setArmazenamento] = useState({
		usadoGB: 0,
		totalGB: 0,
	});

	// Carrega usuário do local Storage
	const user = useMemo(() => {
		try {
			const raw = localStorage.getItem("authUser");
			return raw ? JSON.parse(raw) : null;
		} catch {
			return null;
		}
	}, []);

	// Protege a rota e preenche o formulario ao montar

	useEffect(() => {
		const token = localStorage.getItem("authToken");
		if (!token || !user) {
			navigate("/login", { replace: true });
			return;
		}

		setNome(user?.nome ?? "");
		setCpf(formatarCPF(user?.cpf ?? ""));
		setSetor(user?.setor ?? "");
		setSenha(user?.senha ?? ""); //ATENÇÃO: isso é mock

		const usado = Number(
			user?.Armazenamento?.usadoGB ??
				user?.armazenamento?.usadoGB ??
				user?.armazenamento?.usado ??
				user?.storage?.used ??
				user?.storage?.usado ??
				0
		);

		const total = Number(
			user?.Armazenamento?.totalGB ??
				user?.armazenamento?.totalGB ??
				user?.armazenamento?.total ??
				user?.storage?.total ??
				0
		);

		// setArmazenamento({
		// 	usadoGB: user?.armazenamento?.usadoGB ?? 10,
		// 	totalGB: user?.armazenamento?.totalGB ?? 50,
		// });

		setArmazenamento({
			usadoGB: isNaN(usado).usado ? 0 : usado,
			totalGB: isNaN(total).total ? 0 : total,
		});
	}, [navigate, user]);

	// useInsertionEffect(() => {
	// 		const token = localStorage.get;
	// });

	const togglePasswordVisibility = () => {
		setShowPassword((s) => !s);
		// setShowPassword(!showPassword);
	};

	const pctUso = useMemo(() => {
		const { usadoGB, totalGB } = armazenamento;
		return totalGB > 0 ? Math.round((usadoGB / totalGB) * 100) : 0;
	}, [armazenamento]);

	// Salva alterações no mock
	const handleSalvar = (e) => {
		e.preventDefault();
		if (!user) return;

		const atualizado = {
			...user,
			nome,
			cpf, //pode ficar com mascara no mock
			senha,
			setor,
			// armazenamento: { ...armazenamento },
			armazenamento: {
				usadoGB: Number(armazenamento.usadoGB) || 0,
				totalGB: Number(armazenamento.totalGB) || 0,
			},
		};
		localStorage.setItem("authUser", JSON.stringify(atualizado));

		// Feedback simples (poderia ser um toast)
		alert("Dados atualizados (mock).");
	};

	// Sair (mock)
	const handleSair = () => {
		localStorage.removeItem("authToken");
		localStorage.removeItem("authUser");
		navigate("/");
	};

	return (
		<div className={styles.appContainer}>
			<form className="container" onSubmit={handleSalvar} noValidate>
				<div className="row">
					<div className="col-12 mt-5">
						<h1>Perfil do Usuário</h1>
						<p>
							Nesta tela, serão apresentados os dados pertinentes
							ao usuário.
						</p>
					</div>
				</div>

				{/** Nome */}
				<div className="row">
					<div className="col-12 mt-5">
						<input
							type="text"
							className="form-control"
							id="usuario"
							placeholder="Nome"
							value={nome}
							onChange={(e) => setNome(e.target.value)}
							required
						/>
					</div>
				</div>

				<div className="row">
					<div className="col-12 col-md-6">
						{/** CPF */}
						<input
							type="text"
							className="form-control my-3"
							id="cpf"
							placeholder="000.000.000-00"
							value={cpf}
							onChange={(e) =>
								setCpf(formatarCPF(e.target.value))
							}
							required
						/>

						{/** Setor */}
						<input
							type="text"
							className="form-control my-3"
							id="setor-trabalho"
							placeholder="Setor em que trabalha"
							value={setor}
							onChange={(e) => setSetor(e.target.value)}
							required
						/>

						{/** Espaço de Armazenamento */}
						<input
							type="text"
							className="form-control mt-3"
							id="Espaco-Armazenamento"
							placeholder="Espaço Armazenamento"
							value={`${armazenamento.usadoGB} GB / ${armazenamento.totalGB} GB`}
							onChange={() => {}}
							readOnly
						/>

						<div
							className="progress"
							role="progressbar"
							aria-valuenow={pctUso}
							aria-valuemin="0"
							aria-valuemax="100"
						>
							<div
								className="progress-bar"
								style={{ width: `${pctUso}%` }}
							>
								{pctUso}%
							</div>
						</div>
					</div>

					{/** Coluna direita */}
					<div className="col-12 col-md-6">
						{/** SENHA ATUAL (MOCK) */}
						<div className="input-group my-3">
							<input
								type={showPassword ? "text" : "password"}
								className="form-control"
								id="senha"
								placeholder="Senha"
								value={senha}
								onChange={(e) => setSenha(e.target.value)}
								required
							/>
							<button
								className="btn btn-outline-secondary"
								type="button"
								onClick={togglePasswordVisibility}
							>
								{showPassword ? "Ocultar" : "Mostrar"}
							</button>
						</div>

						{/** Alterar senha (muck UI) */}
						<a
							className="btn btn-primary mb-3"
							data-bs-toggle="collapse"
							href="#alterarSenhaCollapse"
							role="button"
							aria-expanded="false"
							aria-controls="alterarSenhaCollapse"
						>
							Alterar Senha
						</a>

						<div className="collapse" id="alterarSenhaCollapse">
							<div className="my-3">
								<input
									type="password"
									className="form-control"
									id="senhaAtual"
									placeholder="Digite a senha atual"
								/>
							</div>

							<div className="mb-3">
								<input
									type="password"
									className="form-control"
									id="novaSenha"
									placeholder="Digite a nova senha"
								/>
							</div>

							<div className="mb-3">
								<input
									type="password"
									className="form-control"
									id="confirmarSenha"
									placeholder="Confirme a nova senha"
								/>
							</div>

							<button
								className="btn btn-primary"
								type="button"
								onClick={() =>
									alert(
										"Alteração de senha é mock. Integra à API quando disponível."
									)
								}
							>
								Confirmar
							</button>
						</div>
					</div>
				</div>

				{/** Ações */}
				{/* <div className="row mt-4">
					<div className="col d-flex gap-2">
						<button className="btn btn-success" type="submit">
							Salvar (mock)
						</button>
						<button
							className="btn btn-outline-danger"
							type="button"
							onClick={handleSair}
						>
							Sair
						</button>
					</div>
				</div> */}
			</form>
		</div>
	);
}
