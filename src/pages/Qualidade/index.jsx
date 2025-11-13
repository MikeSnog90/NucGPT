import React, { useRef, useState, useMemo, useEffect } from "react";
import styles from "./Qualidade.module.css";

const DOCUMENTOS_INICIAIS = [];
const LOCAL_STORAGE_KEY = "documentosLista";

// ====================================================================
// Modal só para upload/análise (detalhes foram movidos)
// ====================================================================
function Modal({ open, title, onClose, children }) {
	useEffect(() => {
		const onKey = (e) => e.key === "Escape" && onClose?.();
		if (open) window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, onClose]);

	if (!open) return null;

	return (
		<div
			className="modal d-block"
			role="dialog"
			aria-modal="true"
			onMouseDown={onClose}
			style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
		>
			<div
				className="modal-dialog modal-dialog-centered"
				onMouseDown={(e) => e.stopPropagation()}
			>
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">{title}</h5>
						<button
							type="button"
							className="btn-close"
							onClick={onClose}
						/>
					</div>
					<div className="modal-body">{children}</div>
				</div>
			</div>
		</div>
	);
}

// ====================================================================
// Componente Principal
// ====================================================================
export default function PainelDocumentos() {
	// --- ESTADOS COM LOCALSTORAGE ---
	const [documentos, setDocumentos] = useState(() => {
		const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
		if (saved) {
			try {
				return JSON.parse(saved);
			} catch {
				return DOCUMENTOS_INICIAIS;
			}
		}
		return DOCUMENTOS_INICIAIS;
	});

	useEffect(() => {
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(documentos));
	}, [documentos]);

	// --- ESTADOS GERAIS ---
	const [docSelecionado, setDocSelecionado] = useState(null); // agora controla o painel inferior
	const [modalOpen, setModalOpen] = useState(false);
	const [arquivo, setArquivo] = useState(null);
	const [tipoDocumento, setTipoDocumento] = useState("");
	const [busca, setBusca] = useState("");
	const [filtro, setFiltro] = useState("todos");
	const [carregando, setCarregando] = useState(false);

	const inputArquivoRef = useRef(null);
	const dropzoneRef = useRef(null);

	// --- FUNÇÕES MODAL UPLOAD ---
	const openModalWithFile = (file) => {
		if (!file) return;
		setArquivo(file);
		setModalOpen(true);
	};

	const fecharModal = () => {
		setModalOpen(false);
		setArquivo(null);
		setTipoDocumento("");
		setCarregando(false);
	};

	// --- FILTRO E BUSCA ---
	const documentosFiltrados = useMemo(() => {
		let lista = documentos;
		if (filtro === "favoritos") lista = lista.filter((d) => d.favorito);
		if (busca.trim()) {
			const q = busca.toLowerCase();
			lista = lista.filter((d) => d.nome.toLowerCase().includes(q));
		}
		return lista;
	}, [documentos, filtro, busca]);

	// --- HANDLERS LISTA ---
	const handleNovoDocumento = () => {
		const novo = {
			id: Date.now(),
			nome: `Nova Tarefa ${documentos.length + 1}`,
			favorito: false,
		};
		setDocumentos((prev) => [novo, ...prev]);
	};

	const handleToggleFavorito = (id) => {
		setDocumentos((prev) =>
			prev.map((d) => (d.id === id ? { ...d, favorito: !d.favorito } : d))
		);
		// Atualiza também o documento selecionado no painel inferior
		if (docSelecionado?.id === id) {
			setDocSelecionado((d) => (d ? { ...d, favorito: !d.favorito } : d));
		}
	};

	const handleExcluirDocumento = (id) => {
		if (!window.confirm("Deseja excluir este documento?")) return;
		setDocumentos((prev) => prev.filter((d) => d.id !== id));
		if (docSelecionado?.id === id) setDocSelecionado(null); // limpa painel
	};

	// --- HANDLERS DROPZONE ---
	const handleClickDropzone = () => inputArquivoRef.current?.click();
	const handleArquivoChange = (e) => {
		const file = e.target.files?.[0];
		openModalWithFile(file);
	};
	const handleDragOver = (e) => {
		e.preventDefault();
		dropzoneRef.current?.classList.add("border", "border-primary");
	};
	const handleDragLeave = () => {
		dropzoneRef.current?.classList.remove("border", "border-primary");
	};
	const handleDrop = (e) => {
		e.preventDefault();
		dropzoneRef.current?.classList.remove("border", "border-primary");
		const file = e.dataTransfer.files?.[0];
		openModalWithFile(file);
	};

	// --- ANÁLISE ---
	const handleAnalisar = async () => {
		if (!arquivo || !tipoDocumento) return;
		setCarregando(true);
		await new Promise((r) => setTimeout(r, 1500));
		setDocumentos((prev) => [
			{ id: Date.now(), nome: arquivo.name, favorito: false },
			...prev,
		]);
		fecharModal();
	};

	// --- UI ---
	return (
		<div className="container-fluid vh-100 d-flex flex-column p-0">
			<div className="d-flex flex-grow-1 overflow-hidden">
				{/* SIDEBAR */}
				<aside
					className="d-flex flex-column bg-light p-3"
					style={{ width: 400, borderRight: "1px solid #ddd" }}
				>
					<button
						className="btn btn-primary w-100 mb-3"
						onClick={handleNovoDocumento}
					>
						Nova tarefa
					</button>

					<form
						className="d-flex mb-3"
						onSubmit={(e) => e.preventDefault()}
					>
						<input
							type="search"
							className="form-control me-2"
							placeholder="Buscar"
							value={busca}
							onChange={(e) => setBusca(e.target.value)}
						/>
						<button
							type="button"
							className="btn btn-outline-primary"
						>
							Search
						</button>
					</form>

					<hr />

					{/* Filtros */}
					<div className="d-flex mb-2">
						<div className="form-check me-3">
							<input
								className="form-check-input"
								type="radio"
								name="filtro"
								id="todos"
								value="todos"
								checked={filtro === "todos"}
								onChange={(e) => setFiltro(e.target.value)}
							/>
							<label className="form-check-label" htmlFor="todos">
								Todos
							</label>
						</div>
						<div className="form-check">
							<input
								className="form-check-input"
								type="radio"
								name="filtro"
								id="favoritos"
								value="favoritos"
								checked={filtro === "favoritos"}
								onChange={(e) => setFiltro(e.target.value)}
							/>
							<label
								className="form-check-label"
								htmlFor="favoritos"
							>
								Favoritos
							</label>
						</div>
					</div>

					{/* Lista */}
					<ul className="list-group flex-grow-1 overflow-auto">
						{documentosFiltrados.length === 0 && (
							<li className="list-group-item text-muted">
								Nenhum documento encontrado
							</li>
						)}
						{documentosFiltrados.map((doc) => (
							<li
								key={doc.id}
								className={`list-group-item d-flex justify-content-between align-items-center ${
									docSelecionado?.id === doc.id
										? "active"
										: ""
								}`}
							>
								<span
									className="text-truncate me-2"
									style={{ cursor: "pointer" }}
									onClick={() => setDocSelecionado(doc)}
									title={doc.nome}
								>
									{doc.nome}
								</span>
								<div className="btn-group btn-group-sm">
									<button
										className={`btn ${
											doc.favorito
												? "btn-warning"
												: "btn-outline-secondary"
										}`}
										onClick={() =>
											handleToggleFavorito(doc.id)
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
										title="Excluir"
									>
										🗑️
									</button>
								</div>
							</li>
						))}
					</ul>
				</aside>

				{/* ÁREA PRINCIPAL */}
				<main className="flex-grow-1 d-flex flex-column overflow-hidden">
					{/* Dropzone */}
					<section className="p-4 flex-shrink-0">
						<h2>Inserção de Documento</h2>
						<div
							id="dropzone"
							ref={dropzoneRef}
							className="mt-3 p-5 border border-2 rounded text-center"
							style={{ borderStyle: "dashed", cursor: "pointer" }}
							onClick={handleClickDropzone}
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
							tabIndex={0}
							role="button"
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

					{/* PAINEL DE DETALHES (ABAIXO DO DROPZONE) */}
					<section className="flex-grow-1 overflow-auto px-4 pb-4">
						{docSelecionado ? (
							<div
								className="card border-primary shadow-sm animate__animated animate__fadeIn"
								style={{ animationDuration: "0.3s" }}
							>
								<div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
									<h5 className="mb-0">
										Detalhes do Documento
									</h5>
									<button
										className="btn btn-sm btn-outline-light"
										onClick={() => setDocSelecionado(null)}
									>
										X
									</button>
								</div>
								<div className="card-body">
									<p>
										<strong>Nome:</strong>{" "}
										{docSelecionado.nome}
									</p>
									<p>
										<strong>ID:</strong> {docSelecionado.id}
									</p>
									<p>
										<strong>Favorito:</strong>{" "}
										{docSelecionado.favorito
											? "Sim ★"
											: "Não ☆"}
									</p>
									<hr />
									<div className="d-flex gap-2">
										<button
											className={`btn ${
												docSelecionado.favorito
													? "btn-warning"
													: "btn-outline-secondary"
											}`}
											onClick={() =>
												handleToggleFavorito(
													docSelecionado.id
												)
											}
										>
											{docSelecionado.favorito
												? "Remover dos favoritos"
												: "Favoritar"}
										</button>
										<button
											className="btn btn-danger"
											onClick={() => {
												handleExcluirDocumento(
													docSelecionado.id
												);
												setDocSelecionado(null);
											}}
										>
											Excluir
										</button>
									</div>
								</div>
							</div>
						) : (
							<div className="text-center text-muted mt-5">
								<p>
									Clique em um documento na lista para ver os
									detalhes aqui.
								</p>
							</div>
						)}
					</section>
				</main>
			</div>

			{/* MODAL APENAS PARA UPLOAD */}
			<Modal
				open={modalOpen}
				title="Documento para Análise"
				onClose={fecharModal}
			>
				<div className="card mb-3">
					<div className="card-body">
						<strong>Documento enviado:</strong> {arquivo?.name}
					</div>
				</div>

				<div className="mb-4">
					<label className="form-label">
						Selecione o tipo de documento:
					</label>
					<select
						className="form-select"
						value={tipoDocumento}
						onChange={(e) => setTipoDocumento(e.target.value)}
					>
						<option value="" disabled>
							Tipo de documento
						</option>
						<option value="mecanica">Engenharia Mecânica</option>
						<option value="eletrica">Engenharia Elétrica</option>
						<option value="civil">Engenharia Civil</option>
					</select>
				</div>

				<div className="d-flex justify-content-center gap-3">
					<button
						className="btn btn-success"
						onClick={handleAnalisar}
						disabled={!arquivo || !tipoDocumento || carregando}
					>
						{carregando ? (
							<>
								<span className="spinner-border spinner-border-sm me-2" />
								Analisando...
							</>
						) : (
							"Analisar"
						)}
					</button>
					<button
						className="btn btn-danger"
						onClick={fecharModal}
						disabled={carregando}
					>
						Cancelar envio
					</button>
				</div>
			</Modal>
		</div>
	);
}
