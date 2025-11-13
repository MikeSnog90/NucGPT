// src/pages/PainelDocumentos.jsx
import React from "react";
import styles from "./Qualidade.module.css";
import Modal from "../components/Modal";

import { usePainelDocumentos } from "../hooks/usePainelDocumentos";

export default function PainelDocumentos() {
	const {
		// refs
		inputArquivoRef,
		dropzoneRef,
		// estados
		documentosFiltrados,
		docSelecionado,
		modalOpen,
		arquivo,
		tipoDocumento,
		busca,
		filtro,
		carregando,
		qualidadeSelecionada,
		// setters
		setBusca,
		setFiltro,
		setDocSelecionado,
		setTipoDocumento,
		// handlers
		handleToggleFavorito,
		handleExcluirDocumento,
		handleClickDropzone,
		handleArquivoChange,
		handleDragOver,
		handleDragLeave,
		handleDrop,
		handleNovaTarefa,
		handleAnalisar,
		fecharModal,
	} = usePainelDocumentos();

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
						onClick={handleNovaTarefa}
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

					{/* FILTROS */}
					<div className="d-flex mb-3">
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
							<label className="form-check-label" htmlFor="favoritos">
								Favoritos
							</label>
						</div>
					</div>

					{/* LISTA DE DOCUMENTOS */}
					<ul className="list-group flex-grow-1 overflow-auto">
						{documentosFiltrados.length === 0 ? (
							<li className="list-group-item text-muted">
								Nenhum documento encontrado
							</li>
						) : (
							documentosFiltrados.map((doc) => (
								<li
									key={doc.id}
									className={`list-group-item d-flex justify-content-between align-items-center ${
										docSelecionado?.id === doc.id ? "active" : ""
									}`}
								>
									<span
										className="text-truncate me-2"
										style={{ cursor: "pointer" }}
										onClick={() => setDocSelecionado(doc)}
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
											onClick={() => handleToggleFavorito(doc.id)}
										>
											{doc.favorito ? "★" : "☆"}
										</button>

										<button
											className="btn btn-outline-danger"
											onClick={() => handleExcluirDocumento(doc.id)}
										>
											🗑️
										</button>
									</div>
								</li>
							))
						)}
					</ul>
				</aside>

				{/* PAINEL PRINCIPAL */}
				<main className="flex-grow-1 d-flex flex-column overflow-hidden">
					{/* DROPZONE */}
					<section className="p-4 flex-shrink-0">
						<h2>Inserção de Documento</h2>

						<div
							ref={dropzoneRef}
							className="mt-3 p-5 border border-2 rounded text-center"
							style={{ borderStyle: "dashed", cursor: "pointer" }}
							onClick={handleClickDropzone}
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
						>
							Insira o documento aqui (arraste ou clique)
							<input
								type="file"
								ref={inputArquivoRef}
								onChange={handleArquivoChange}
								className="d-none"
							/>
						</div>
					</section>

					{/* DETALHES DO DOCUMENTO + JSON */}
					<section className="flex-grow-1 overflow-auto px-4 pb-4">
						{docSelecionado ? (
							<div className="card border-primary shadow-sm">
								<div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
									<h5 className="mb-0">Detalhes do Documento</h5>

									<button
										className="btn btn-sm btn-outline-light"
										onClick={() => setDocSelecionado(null)}
									>
										X
									</button>
								</div>

								<div className="card-body">
									<p><strong>Nome:</strong> {docSelecionado.nome}</p>
									<p><strong>ID:</strong> {docSelecionado.id}</p>
									<p>
										<strong>Favorito:</strong>{" "}
										{docSelecionado.favorito ? "Sim ★" : "Não ☆"}
									</p>

									<hr />

									<div className="d-flex gap-2 mb-3">
										<button
											className={`btn ${
												docSelecionado.favorito
													? "btn-warning"
													: "btn-outline-secondary"
											}`}
											onClick={() => handleToggleFavorito(docSelecionado.id)}
										>
											{docSelecionado.favorito
												? "Remover dos favoritos"
												: "Favoritar"}
										</button>

										<button
											className="btn btn-danger"
											onClick={() => {
												handleExcluirDocumento(docSelecionado.id);
												setDocSelecionado(null);
											}}
										>
											Excluir
										</button>
									</div>

									<hr />

									{qualidadeSelecionada ? (
										<div className="mt-3">
											<h5
