// src/hooks/usePainelDocumentos.js
import { useState, useEffect, useMemo, useRef } from "react";
import { MOCK_QUALIDADE } from "../data/qualidade";

const DOCUMENTOS_INICIAIS = [];
const LOCAL_STORAGE_KEY = "documentosLista";

export function usePainelDocumentos() {
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

	const [docSelecionado, setDocSelecionado] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [arquivo, setArquivo] = useState(null);
	const [tipoDocumento, setTipoDocumento] = useState("");
	const [busca, setBusca] = useState("");
	const [filtro, setFiltro] = useState("todos");
	const [carregando, setCarregando] = useState(false);

	const inputArquivoRef = useRef(null);
	const dropzoneRef = useRef(null);

	// QUALIDADE
	const qualidadeSelecionada = useMemo(() => {
		if (!docSelecionado) return null;
		return (
			MOCK_QUALIDADE.find((q) => q.arquivo === docSelecionado.nome) ||
			null
		);
	}, [docSelecionado]);

	// MODAL
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

	// FILTROS
	const documentosFiltrados = useMemo(() => {
		let lista = documentos;
		if (filtro === "favoritos") lista = lista.filter((d) => d.favorito);
		if (busca.trim()) {
			const q = busca.toLowerCase();
			lista = lista.filter((d) => d.nome.toLowerCase().includes(q));
		}
		return lista;
	}, [documentos, filtro, busca]);

	// LISTA
	const handleToggleFavorito = (id) => {
		setDocumentos((prev) =>
			prev.map((d) => (d.id === id ? { ...d, favorito: !d.favorito } : d))
		);
		if (docSelecionado?.id === id) {
			setDocSelecionado((d) => (d ? { ...d, favorito: !d.favorito } : d));
		}
	};

	const handleExcluirDocumento = (id) => {
		if (!window.confirm("Deseja excluir este documento?")) return;
		setDocumentos((prev) => prev.filter((d) => d.id !== id));
		if (docSelecionado?.id === id) setDocSelecionado(null);
	};

	// DROPZONE
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

	// NOVA TAREFA
	const handleNovaTarefa = () => {
		const novo = {
			id: Date.now(),
			nome: `Nova Tarefa ${documentos.length + 1}`,
			favorito: false,
		};
		setDocumentos((prev) => [novo, ...prev]);
		setDocSelecionado(novo);
		setTimeout(() => inputArquivoRef.current?.click(), 0);
	};

	// ANÁLISE
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

	return {
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
		// setters simples
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
	};
}
