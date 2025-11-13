import React, { useMemo, useRef, useState } from "react";

/**
 * Gestor de Documentos - Análise (versão React)
 * - Mantém a aparência do Bootstrap 5.
 * - Usa estado para lista, busca, filtro, seleção e simulação de análise.
 * - Dropzone com click/drag-and-drop para simular upload (adiciona à lista local).
 * - Ações: Renomear, Favoritar/Desfavoritar, Excluir, Abrir para análise.
 *
 * Requisitos:
 * - Bootstrap CSS já importado em nível global (ex.: index.html ou main.jsx).
 * - (Opcional) Para o dropdown funcionar com data-bs-toggle, garanta o Bootstrap JS bundle.
 */
export default function GestorDocumentos() {
	// Lista local simulada para documentos
	const [documentos, setDocumentos] = useState([]); // {id, nome, favorito}
	const [documentoAtual, setDocumentoAtual] = useState(null); // doc selecionado para análise

	// Filtros/Busca
	const [busca, setBusca] = useState("");
	const [filtro, setFiltro] = useState("todos"); // 'todos' | 'favoritos'

	// Passos/estados da análise
	const [tipoDocumento, setTipoDocumento] = useState("");
	const [carregando, setCarregando] = useState(false);

	// Dropzone
	const [dragOver, setDragOver] = useState(false);
	const inputFileRef = useRef(null);

	// Estilo inline equivalente ao CSS embutido do HTML original
	const dropzoneStyle = useMemo(
		() => ({
			border: "1px solid black",
			borderRadius: 5,
			padding: "1rem",
			minHeight: 150,
			textAlign: "center",
			color: "#666",
			cursor: "pointer",
			backgroundColor: dragOver ? undefined : "#f8f9fa",
		}),
		[dragOver]
	);

	const asideStyle = {
		width: 280,
		borderRight: "1px solid #ddd",
	};

	// Lista filtrada
	const docsFiltrados = useMemo(() => {
		const texto = busca.trim().toLowerCase();
		return documentos.filter((doc) => {
			if (filtro === "favoritos" && !doc.favorito) return false;
			if (!texto) return true;
			return doc.nome.toLowerCase().includes(texto);
		});
	}, [documentos, busca, filtro]);

	// Helpers
	const abrirDocumentoParaAnalise = (doc) => {
		setDocumentoAtual(doc);
		setTipoDocumento("");
		setCarregando(false);
	};

	const resetarPasso1 = () => {
		setDocumentoAtual(null);
		setTipoDocumento("");
		setCarregando(false);
		setDragOver(false);
	};

	// Ações da lista
	const renomearDocumento = (id) => {
		const doc = documentos.find((d) => d.id === id);
		if (!doc) return;
		const novoNome = window.prompt(
			"Digite o novo nome do documento:",
			doc.nome
		);
		if (novoNome && novoNome.trim() !== "") {
			setDocumentos((prev) =>
				prev.map((d) =>
					d.id === id ? { ...d, nome: novoNome.trim() } : d
				)
			);
		}
	};

	const alternarFavorito = (id) => {
		setDocumentos((prev) =>
			prev.map((d) => (d.id === id ? { ...d, favorito: !d.favorito } : d))
		);
	};

	const excluirDocumento = (id) => {
		const doc = documentos.find((d) => d.id === id);
		if (!doc) return;
		if (
			window.confirm(
				`Tem certeza que deseja excluir o documento "${doc.nome}"?`
			)
		) {
			setDocumentos((prev) => prev.filter((d) => d.id !== id));
			// se estava aberto, fecha
			if (documentoAtual?.id === id) {
				resetarPasso1();
			}
		}
	};

	// Simular análise
	const analisarDocumento = () => {
		if (!documentoAtual) {
			window.alert("Nenhum documento carregado.");
			return;
		}
		if (!tipoDocumento) {
			window.alert("Selecione o tipo de documento antes de analisar.");
			return;
		}
		setCarregando(true);
		setTimeout(() => {
			setCarregando(false);
			window.alert("Documento analisado com sucesso!");
			resetarPasso1();
		}, 3000);
	};

	// Upload simulado (click)
	const handleClickDropzone = () => {
		inputFileRef.current?.click();
	};

	const handleFileSelected = (file) => {
		if (!file) return;
		const novo = {
			id: crypto.randomUUID(),
			nome: file.name,
			favorito: false,
		};
		setDocumentos((prev) => [...prev, novo]);
		abrirDocumentoParaAnalise(novo);
	};

	const onFileInputChange = (e) => {
		const file = e.target.files?.[0];
		handleFileSelected(file);
		// limpa valor para poder selecionar o mesmo arquivo novamente
		e.target.value = "";
	};

	// Drag & Drop
	const onDragOver = (e) => {
		e.preventDefault();
		setDragOver(true);
	};
	const onDragLeave = (e) => {
		e.preventDefault();
		setDragOver(false);
	};
	const onDrop = (e) => {
		e.preventDefault();
		setDragOver(false);
		const file = e.dataTransfer.files?.[0];
		handleFileSelected(file);
	};

	return (
		<div className="container-fluid vh-100 d-flex p-0">
			{/* Menu lateral */}
			<aside
				className="d-flex flex-column bg-light p-3"
				style={asideStyle}
			>
				<button
					className="btn btn-primary w-100 mb-3"
					onClick={resetarPasso1}
				>
					Nova tarefa
				</button>

				<form
					className="d-flex mb-3"
					role="search"
					onSubmit={(e) => e.preventDefault()}
				>
					<input
						type="search"
						className="form-control me-2"
						placeholder="Buscar"
						aria-label="Buscar"
						value={busca}
						onChange={(e) => setBusca(e.target.value)}
					/>
					<button
						type="button"
						className="btn btn-outline-primary"
						onClick={() => {
							/* busca já é reativa */
						}}
					>
						Buscar
					</button>
				</form>

				<hr />

				<section>
					<div className="d-flex mb-2">
						<div className="form-check me-3">
							<input
								className="form-check-input"
								type="radio"
								name="filtroFavoritos"
								id="filtroTodos"
								value="todos"
								checked={filtro === "todos"}
								onChange={() => setFiltro("todos")}
							/>
							<label
								className="form-check-label"
								htmlFor="filtroTodos"
							>
								Todos
							</label>
						</div>
						<div className="form-check">
							<input
								className="form-check-input"
								type="radio"
								name="filtroFavoritos"
								id="filtroFavoritos"
								value="favoritos"
								checked={filtro === "favoritos"}
								onChange={() => setFiltro("favoritos")}
							/>
							<label
								className="form-check-label"
								htmlFor="filtroFavoritos"
							>
								Favoritos
							</label>
						</div>
					</div>

					<ul className="list-group" aria-label="Lista de Documentos">
						{docsFiltrados.length === 0 ? (
							<li className="list-group-item text-muted">
								Nenhum documento encontrado.
							</li>
						) : (
							docsFiltrados.map((doc, index) => (
								<li
									key={doc.id}
									className="list-group-item d-flex justify-content-between align-items-center"
								>
									<span
										role="button"
										tabIndex={0}
										onClick={() =>
											abrirDocumentoParaAnalise(doc)
										}
										onKeyDown={(e) =>
											e.key === "Enter" &&
											abrirDocumentoParaAnalise(doc)
										}
										style={{ cursor: "pointer" }}
									>
										{doc.nome}
									</span>

									{/* Dropdown de ações (requer Bootstrap JS para o toggle) */}
									<div className="dropdown">
										<button
											className="btn btn-sm btn-outline-secondary dropdown-toggle"
											type="button"
											id={`dropdownMenuButton${index}`}
											data-bs-toggle="dropdown"
											aria-expanded="false"
										>
											Ações
										</button>
										<ul
											className="dropdown-menu"
											aria-labelledby={`dropdownMenuButton${index}`}
										>
											<li>
												<button
													className="dropdown-item"
													type="button"
													onClick={() =>
														renomearDocumento(
															doc.id
														)
													}
												>
													Renomear
												</button>
											</li>
											<li>
												<button
													className="dropdown-item"
													type="button"
													onClick={() =>
														alternarFavorito(doc.id)
													}
												>
													{doc.favorito
														? "Remover dos favoritos"
														: "Adicionar aos favoritos"}
												</button>
											</li>
											<li>
												<button
													className="dropdown-item text-danger"
													type="button"
													onClick={() =>
														excluirDocumento(doc.id)
													}
												>
													Excluir
												</button>
											</li>
										</ul>
									</div>
								</li>
							))
						)}
					</ul>
				</section>
			</aside>

			{/* Conteúdo principal */}
			<main className="flex-grow-1 p-4 overflow-auto">
				{/* Passo 1 - Inserção (quando não há documento selecionado) */}
				{!documentoAtual && (
					<section aria-label="Inserção de Documento">
						<h2>Inserção de Documento.</h2>

						<div
							className={`mt-3 ${
								dragOver ? "bg-secondary text-white" : ""
							}`}
							style={dropzoneStyle}
							tabIndex={0}
							role="button"
							aria-label="Área para inserir documento"
							onClick={handleClickDropzone}
							onKeyDown={(e) =>
								e.key === "Enter" && handleClickDropzone()
							}
							onDragOver={onDragOver}
							onDragLeave={onDragLeave}
							onDrop={onDrop}
						>
							Insira o documento aqui (arraste ou clique para
							selecionar)
							<input
								ref={inputFileRef}
								type="file"
								accept=".pdf,.doc,.docx,.txt"
								onChange={onFileInputChange}
								hidden
							/>
						</div>
					</section>
				)}

				{/* Passo 2 - Documento carregado */}
				{documentoAtual && (
					<section aria-label="Documento para Análise">
						<h2>Documento para Análise</h2>

						<div className="card mt-3 mb-3">
							<div className="card-body">
								<strong>Documento enviado:</strong>{" "}
								<span>{documentoAtual?.nome}</span>
							</div>
						</div>

						<div className="mb-4">
							<label
								htmlFor="tipoDocumento"
								className="form-label"
							>
								Selecione o tipo de documento que será enviado
								para análise Prévia de Qualidade
							</label>
							<select
								id="tipoDocumento"
								className="form-select"
								aria-describedby="tipoDocumentoHelp"
								value={tipoDocumento}
								onChange={(e) =>
									setTipoDocumento(e.target.value)
								}
							>
								<option value="" disabled>
									Tipo de documento
								</option>
								<option value="mecanica">
									Engenharia Mecânica
								</option>
								<option value="eletrica">
									Engenharia Elétrica
								</option>
								<option value="civil">Engenharia Civil</option>
							</select>
							<div
								id="tipoDocumentoHelp"
								className="form-text"
							></div>
						</div>

						<div className="d-flex justify-content-center gap-3">
							<button
								className="btn btn-success"
								onClick={analisarDocumento}
								disabled={carregando}
							>
								Analisar
							</button>
							<button
								className="btn btn-danger"
								onClick={resetarPasso1}
								disabled={carregando}
							>
								Cancelar envio
							</button>
						</div>

						{carregando && (
							<div
								className="text-center mt-4"
								aria-live="polite"
								aria-busy="true"
							>
								<div
									className="spinner-border text-primary"
									role="status"
									aria-hidden="true"
								></div>
								<div className="mt-2">Por favor aguarde!</div>
							</div>
						)}
					</section>
				)}
			</main>
		</div>
	);
}
