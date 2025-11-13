# PainelDocumentos — Documentação do Componente

## Visão geral

PainelDocumentos é um painel de pré-análise de documentos que oferece:

-   Lista com busca e filtro (todos/favoritos)
-   Favoritar/Desfavoritar e excluir itens
-   Dropzone acessível para upload (clique/arrastar-e-soltar)
-   Fluxo em 2 passos:
    -   Passo 1 no <main> (inserção do arquivo)
    -   Passo 2 em Modal (seleção do tipo + análise)

Sem dependência do JS do Bootstrap: o modal é controlado por estado React.

---

## Estrutura

```
nucgpt-react/
├── public/
│ └── vite.svg
│
├── src/
│ ├── assets/
│ │ ├── (imagens, ícones, etc.)
│ │ ├── logoSisGPT.svg
│ │ ├── react.svg
│ │ └── vetor.svg
│ │
│ ├── auth/
│ │ ├── AuthContext.jsx
│ │ └── ProtectedRoute.jsx
│ │
│ ├── components/
│ │ ├── Footer/
│ │ │ ├── index.jsx
│ │ │ └── Footer.module.css
│ │ ├── MainContent/
│ │ │ ├── index.jsx
│ │ │ └── MainContent.module.css
│ │ ├── Navbar/
│ │ │ ├── index.jsx
│ │ │ └── Navbar.module.css
│ │ └── Sidebar/
│ │ ├── index.jsx
│ │ └── Sidebar.module.css
│ │
│ ├── layouts/
│ │ ├── MainLayout.jsx
│ │ └── MainLayout.module.css
│ │
│ ├── mocks/
│ │ └── users.js
│ │
│ └── pages/
│ ├── Login/
│ │ ├── index.jsx
│ │ └── Login.module.css
│ ├── NucGPT/
│ │ ├── index.jsx
│ │ └── NucGPT.module.css
│ ├── Perfil/
│ │ ├── index.jsx
│ │ └── Perfil.module.css
│ ├── Qualidade/
│ │ ├── index.jsx
│ │ └── Qualidade.module.css
│ └── Referencia/
│ ├── index.jsx
│ └── Referencia.module.css
│
├── Styles/
│ ├── bootstrap/
│ │ ├── css
│ │ │ └── bootstrap.min.css
│ │ └── js
│ │ └── bootstrap.bundle.min.js
│ │
│ ├── App.jsx
│ ├── main.jsx
│ └── index.css
│
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## Estados e Refs

### Estados

-   arquivo: File | null — arquivo selecionado.
-   tipoDocumento: string — valor do `<select>` (mecanica | eletrica | civil).
-   busca: string — termo de pesquisa da lista.
-   filtro: "todos" | "favoritos" — filtro atual.
-   carregando: boolean — indica processamento de análise.
-   modalOpen: boolean — controla visibilidade do modal.
-   documentos: { id:number; nome:string; favorito:boolean }[] — lista renderizada.

### Refs

-   inputArquivoRef — referência ao `<input type="file">`.

-   dropzoneRef — referência ao contêiner dropzone para estilização em drag over.

### Derivados (memoizados)

-   documentosFiltrados — aplica filtro + busca sobre documentos.

---

## Principais comportamentos

### Inserção de arquivos (Passo 1)

-   Clique na área → abre o seletor (inputArquivoRef.click()).
-   Arrastar e soltar → previne o comportamento padrão, realça a área e captura File.
-   Ao receber um arquivo (clique/drag&drop), abre o Modal (modalOpen = true) e define arquivo.

## Modal (Passo 2)

-   Mostra o nome do arquivo selecionado e um `<select>` de tipo de documento.
-   Acessibilidade:
-   role="dialog" e aria-modal="true".
-   Fecha com ESC, clique no backdrop, botão X ou “Cancelar envio”.

## Ações:

-   Analisar: simula 1,5 s e adiciona o item à lista (nome = arquivo.name).
-   Cancelar envio: reseta arquivo, tipoDocumento, carregando e fecha o modal.
-   Lista, favoritar e excluir
-   Favoritar: alterna favorito do item.
-   Excluir: confirma via window.confirm e remove o item.
-   Busca: filtra por nome (case-insensitive) em tempo real.
-   Filtro: radio (todos/favoritos).

---

## Acessibilidade (A11y)

### Dropzone:

-   role="button", tabIndex={0}, aria-label.
-   Ativa por teclado: Enter ou Barra de espaço.
-   Feedback visual ao drag over (borda destacada).

### Modal:

-   role="dialog", aria-modal="true", aria-labelledby.
-   Fecha com Esc, clique fora e botão de fechar com aria-label="Close".

### Botões de ação na lista:

-   Têm aria-label descritivas (ex.: “Excluir X”, “Favoritar/Remover dos favoritos”).

---

### Estilos e dependências

-   Usa classes do Bootstrap CSS (grid/utilitários, btn, list-group, etc.).
    > Não depende do JS do Bootstrap.
-   Qualidade.module.css (opcional) para ajustes locais — importado como styles.

```jsx
type ModalProps = {
	open: boolean, // visibilidade
	title?: React.ReactNode, // título no header
	onClose?: () => void, // fecha por ESC, backdrop, X
	children?: React.ReactNode, // conteúdo do modal
};
```

#### Comportamentos padrão

-   Fecha ao pressionar Esc (listener condicionado a open).
-   Fecha ao clicar no backdrop (click no container externo).
-   Não fecha ao clicar no conteúdo (propagation stop).

---

### Fluxo do usuário

1. Passo 1 (Main) — usuário solta ou seleciona um arquivo
    > → arquivo definido → modalOpen = true.
2. Passo 2 (Modal) — escolhe tipo de documento
    > → clica Analisar → simula processamento → adiciona item à lista; modal fecha.
3. Lista — usuário pode favoritar, buscar, filtrar e excluir.

---

### Pontos de extensão

-   Validação de arquivo: restringir tipos (ex.: PDF) e tamanho antes de abrir o modal.
-   Envio real: substituir a simulação por chamada a API; tratar estados success/error.
-   Toasts: feedback após análise/exclusão (ex.: via lib de notificações).
-   Paginação e/ou scroll infinito para listas grandes.
-   Confirmação custom (em vez de window.confirm) com um modal de confirmação.
-   Internacionalização (strings extraídas para i18n).
-   Store/Server: mover documentos para contexto/global store ou backend.

---

### Boas práticas implementadas

-   Derived state com useMemo para evitar recomputação em cada render.
-   Funções puras de atualização: setDocumentos(prev => ...).
-   Encapsulamento do modal: sem dependências externas, controlado por props.
-   A11y no dropzone e no modal (teclado, labels, aria-\*).

---

### Tratamento de erros & estados

-   carregando bloqueia ações do modal (desabilita botões).
-   Estados resetados ao cancelar/analisar com sucesso.
-   Confirmação ao excluir para prevenir perda acidental.
    > Para produção, adicione try/catch no handleAnalisar (integração com API) e mensagens de erro.

---

### Testes recomendados (checklist)

#### Unidade

-   Render do modal quando modalOpen = true/false.
-   handleAnalisar adiciona documento e fecha o modal.
-   handleCancelarEnvio reseta estados.
-   handleToggleFavorito alterna favorito.
-   handleExcluirDocumento remove item correto.

#### Integração

-   Clique no dropzone abre input type=file.
-   dragover/drop dispara openModalWithFile.
-   Busca e filtro combinados na lista.
-   Acessibilidade: fechar com Esc, foco navegável, aria-\*.

---

### Exemplo de uso (importação)

```jsx
import PainelDocumentos from "./PainelDocumentos";
// ...
function App() {
	return <PainelDocumentos />;
}
```

---

## Snippets úteis

### Restringir a PDF antes de abrir o modal

```jsx
function openModalWithFile(file) {
	if (!file) return;
	const isPDF = file.type === "application/pdf" || /\.pdf$/i.test(file.name);
	if (!isPDF) {
		alert("Apenas PDFs são aceitos.");
		return;
	}
	setArquivo(file);
	setModalOpen(true);
}
```

### “Limpar lista” (exemplo)

```jsx
function handleLimparLista() {
	if (window.confirm("Limpar todos os documentos?")) setDocumentos([]);
}
```

---

### Convenções e padrões

-   Nomenclatura: handle* para handlers, *Ref para refs, \*Open para booleans de visibilidade.
-   Imutabilidade: uso de spread/array methods ao atualizar estados de lista.
-   Separação de responsabilidades:
-   UI do passo 1 no main
-   Lógica e UI do passo 2 em `<Modal>`

---
