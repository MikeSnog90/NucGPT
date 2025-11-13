import React, { useRef, useState, useMemo, useEffect } from "react";
import styles from "./Qualidade.module.css";

// MODAL PARA O POPUP
function Modal({ open, title, onClose, children }) {
	// fecha com ESC
	useEffect(() => {
		function onKey(e) {
			if (e.key === "Escape") onClose?.();
		}
		if (open) window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, onClose]);

	if (!open) return null;

	return (
		<div
			className="modal d-block"
			role="dialog"
			aria-modal="true"
			aria-labelledby="modalLabel"
			onMouseDown={onClose} // clique no backdrop fecha
			style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
		>
			<div
				className="modal-dialog modal-dialog-centered"
				onMouseDown={(e) => e.stopPropagation()} // evita fechar ao clicar dentro
			>
				<div className="modal-content">
					<div className="modal-header">
						<h5 id="modalLabel" className="modal-title">
							{title}
						</h5>
						<button
							type="button"
							className="btn-close"
							aria-label="Close"
							onClick={onClose}
						/>
					</div>
					<div className="modal-body">{children}</div>
				</div>
			</div>
		</div>
	);
}

export default function PainelDocumentos() {
	// Estados principais
	const [arquivo, setArquivo] = useState(null); // arquivo selecionado
	const [tipoDocumento, setTipoDocumento] = useState(""); // select
	const [busca, setBusca] = useState(""); // texto de busca
	const [filtro, setFiltro] = useState("todos"); // "todos" | "favoritos"
	const [carregando, setCarregando] = useState(false); // spinner de análise
	const [modalOpen, setModalOpen] = useState(false);

	// Lista de documentos (exemplo inicial)
	const [documentos, setDocumentos] = useState([
		{ id: 1, nome: "Planta Mecânica - Eixo A", favorito: false },
		{ id: 2, nome: "Diagrama Elétrico - QGBT", favorito: true },
		{ id: 3, nome: "Memorial Descritivo - Fundação", favorito: false },
	]);

	// Refs
	const inputArquivoRef = useRef(null);
	const dropzoneRef = useRef(null);

	// Memoriza a lista filtrada/pesquisada
	const documentosFiltrados = useMemo(() => {
		let lista = documentos;
		if (filtro === "favoritos") {
			lista = lista.filter((d) => d.favorito);
		}
		if (busca.trim()) {
			const q = busca.toLowerCase();
			lista = lista.filter((d) => d.nome.toLowerCase().includes(q));
		}
		return lista;
	}, [documentos, filtro, busca]);

	// ----> Documento selecionado para detalhes <-----
	const [docSelecionado, setDocSelecionado] = useState(null);

	function abrirDetalhesDocumento(doc) {
		setDocSelecionado(doc); // define o documento da lista
		setModalOpen(true); // abre o modal
	}

	function fecharModal() {
		setModalOpen(false);
		setDocSelecionado(null); // limpa seleção do doc
		// também reseta o fluxo de análise se necessário:
		setArquivo(null);
		setTipoDocumento("");
		setCarregando(false);
	}

	function fecharPopup() {
		// quando a intenção for “fechar o popup de detalhes”
		setDocSelecionado(null);
		setModalOpen(false);
	}

	// Fecha com Esc quando há docSelecionado (detalhes)
	useEffect(() => {
		function onKeyDown(e) {
			if (e.key === "Escape") fecharPopup();
		}
		if (docSelecionado) window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
		// docSelecionado no deps para ativar/desativar corretamente
	}, [docSelecionado]);

	// Ações
	function handleNovoDocumento() {
		const novo = {
			id: Date.now(),
			nome: `Tarefa ${documentos.length + 1}`,
			favorito: false,
		};
		setDocumentos((prev) => [novo, ...prev]);
	}

	function handleToggleFavorito(id) {
		setDocumentos((prev) =>
			prev.map((d) => (d.id === id ? { ...d, favorito: !d.favorito } : d))
		);
	}

	function handleExcluirDocumento(id) {
		if (!window.confirm("Deseja excluir este documento?")) return;
		setDocumentos((prev) => prev.filter((d) => d.id !== id));
	}

	function handleClickDropzone() {
		inputArquivoRef.current?.click();
	}

	function openModalWithFile(file) {
		if (!file) return;
		setArquivo(file);
		setModalOpen(true);
	}

	function handleArquivoChange(e) {
		const file = e.target.files?.[0];
		openModalWithFile(file);
	}

	function handleDragOver(e) {
		e.preventDefault();
		dropzoneRef.current?.classList.add("border", "border-primary");
	}

	function handleDragLeave() {
		dropzoneRef.current?.classList.remove("border", "border-primary");
	}

	function handleDrop(e) {
		e.preventDefault();
		dropzoneRef.current?.classList.remove("border", "border-primary");
		const file = e.dataTransfer.files?.[0];
		openModalWithFile(file);
	}

	async function handleAnalisar() {
		if (!arquivo || !tipoDocumento) return;
		setCarregando(true);

		// Simulação de processamento
		await new Promise((r) => setTimeout(r, 1500));

		// Ao “analisar”, adiciona documento à lista
		setDocumentos((prev) => [
			{
				id: Date.now(),
				nome: arquivo.name,
				favorito: false,
			},
			...prev,
		]);

		// Reseta estados pós-análise
		setArquivo(null);
		setTipoDocumento("");
		setCarregando(false);
		setModalOpen(false);
	}

	function handleCancelarEnvio() {
		setArquivo(null);
		setTipoDocumento("");
		setCarregando(false);
		setModalOpen(false);
	}

	// UI
	return (
		<div className="container-fluid vh-100 d-flex p-0">
			{/* Menu lateral */}
			<aside
				className="d-flex flex-column bg-light p-3"
				style={{ width: 280, borderRight: "1px solid #ddd" }}
			>
				<button
					id="btnNovaTarefa"
					className="btn btn-primary w-100 mb-3"
					onClick={handleNovoDocumento}
				>
					Nova tarefa
				</button>

				<form
					id="formBuscar"
					className="d-flex mb-3"
					role="search"
					onSubmit={(e) => e.preventDefault()}
				>
					<input
						id="inputBuscar"
						type="search"
						className="form-control me-2"
						placeholder="Buscar"
						aria-label="Buscar"
						value={busca}
						onChange={(e) => setBusca(e.target.value)}
					/>
					<button
						id="btnBuscar"
						type="button"
						className="btn btn-outline-primary"
						onClick={() => {}}
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
								onChange={(e) => setFiltro(e.target.value)}
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
								onChange={(e) => setFiltro(e.target.value)}
							/>
							<label
								className="form-check-label"
								htmlFor="filtroFavoritos"
							>
								Favoritos
							</label>
						</div>
					</div>

					<ul
						id="listaDocumentos"
						className="list-group"
						aria-label="Lista de Documentos"
					>
						{documentosFiltrados.length === 0 && (
							<li className="list-group-item text-muted">
								Nenhum documento encontrado
							</li>
						)}
						{documentosFiltrados.map((doc) => (
							<li
								key={doc.id}
								className="list-group-item d-flex justify-content-between align-items-center"
							>
								<span
									className="text-truncate me-2"
									title={doc.nome}
									role="link"
									tabIndex={0}
									style={{
										cursor: "pointer",
										textDecoration: "underline",
									}}
									onClick={() => abrirDetalhesDocumento(doc)}
									onKeyDown={(e) => {
										if (
											e.key === "Enter" ||
											e.key === " "
										) {
											e.preventDefault();
											abrirDetalhesDocumento(doc);
										}
									}}
								>
									{doc.nome}
								</span>

								<div
									className="btn-group btn-group-sm"
									role="group"
									aria-label={`Ações do documento ${doc.nome}`}
								>
									<button
										className={`btn ${
											doc.favorito
												? "btn-warning"
												: "btn-outline-secondary"
										}`}
										onClick={() =>
											handleToggleFavorito(doc.id)
										}
										aria-label={
											doc.favorito
												? "Remover dos favoritos"
												: "Favoritar"
										}
										title={
											doc.favorito
												? "Remover dos favoritos"
												: "Favoritar"
										}
									>
										{doc.favorito ? "★" : "☆"}
									</button>

									<button
										className="btn btn-outline-danger"
										onClick={() =>
											handleExcluirDocumento(doc.id)
										}
										aria-label={`Excluir ${doc.nome}`}
										title="Excluir"
									>
										🗑️
									</button>
								</div>
							</li>
						))}
					</ul>
				</section>
			</aside>

			{/* Conteúdo principal — agora SOMENTE o passo 1 */}
			<main
				className={`flex-grow-1 p-4 overflow-auto ${styles.appContainer}`}
			>
				<section id="passo1">
					<h2>Inserção de Documento.</h2>
					<div
						id="dropzone"
						ref={dropzoneRef}
						className="mt-3 p-4 border border-2 rounded text-center"
						tabIndex={0}
						role="button"
						aria-label="Área para inserir documento"
						onClick={handleClickDropzone}
						onKeyDown={(e) =>
							(e.key === "Enter" || e.key === " ") &&
							handleClickDropzone()
						}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
						style={{ cursor: "pointer", borderStyle: "dashed" }}
					>
						Insira o documento aqui (arraste ou clique para
						selecionar)
						<input
							type="file"
							ref={inputArquivoRef}
							onChange={handleArquivoChange}
							className="d-none"
						/>
					</div>
				</section>
			</main>

			{/* MODAL — Passo 2: Documento carregado OU Detalhes */}
			<Modal
				open={modalOpen}
				title={
					docSelecionado
						? "Projeto / Documento"
						: "Documento para Análise"
				}
				onClose={fecharModal}
			>
				{/* SE FOR MODAL DE DETALHES */}
				{docSelecionado ? (
					<>
						<div className="mb-3">
							<div className="mb-2">
								<strong>Nome:</strong> {docSelecionado.nome}
							</div>
							<div className="mb-2">
								<strong>ID:</strong> {docSelecionado.id}
							</div>
							<div className="mb-2">
								<strong>Favorito:</strong>{" "}
								{docSelecionado.favorito ? "Sim ★" : "Não ☆"}
							</div>
						</div>

						<div className="d-flex gap-2">
							<button
								type="button"
								className={`btn ${
									docSelecionado.favorito
										? "btn-warning"
										: "btn-outline-secondary"
								}`}
								onClick={() => {
									handleToggleFavorito(docSelecionado.id);
									// mantém o modal sincronizado
									setDocSelecionado(
										(d) =>
											d && { ...d, favorito: !d.favorito }
									);
								}}
							>
								{docSelecionado.favorito
									? "Remover dos favoritos"
									: "Favoritar"}
							</button>

							<button
								type="button"
								className="btn btn-danger"
								onClick={() => {
									setDocumentos((prev) =>
										prev.filter(
											(d) => d.id !== docSelecionado.id
										)
									);
									fecharModal();
								}}
							>
								Excluir
							</button>

							<button
								type="button"
								className="btn btn-outline-secondary ms-auto"
								onClick={fecharModal}
							>
								Fechar
							</button>
						</div>
					</>
				) : (
					// SENÃO, É O MODAL DE ANÁLISE
					<>
						<div className="card mb-3">
							<div className="card-body">
								<strong>Documento enviado:</strong>{" "}
								<span id="nomeDocumentoEnviado">
									{arquivo?.name}
								</span>
							</div>
						</div>

						<div id="selecaoTipoDocumento" className="mb-4">
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
							<div id="tipoDocumentoHelp" className="form-text">
								{tipoDocumento
									? `Selecionado: ${tipoDocumento}`
									: "Escolha uma opção para habilitar a análise."}
							</div>
						</div>

						<div className="d-flex justify-content-center gap-3">
							<button
								id="btnAnalisar"
								className="btn btn-success"
								onClick={handleAnalisar}
								disabled={
									!arquivo || !tipoDocumento || carregando
								}
							>
								{carregando ? (
									<>
										<span
											className="spinner-border spinner-border-sm me-2"
											role="status"
											aria-hidden="true"
										/>
										Analisando...
									</>
								) : (
									"Analisar"
								)}
							</button>
							<button
								id="btnCancelarEnvio"
								className="btn btn-danger"
								onClick={
									fecharModal /* ou handleCancelarEnvio */
								}
								disabled={carregando}
							>
								Cancelar envio
							</button>
						</div>
					</>
				)}
			</Modal>
		</div>
	);
}
