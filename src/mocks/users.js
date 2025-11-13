// src/mocks/users.js
export const MOCK_USERS = [
	{
		id: 1,
		nome: "João Soares",
		cpf: "123.456.789-09", // coloque o traço: "-09"
		senha: "senha123",
		setor: "Qualidade",
		armazenamento: { usadoGB: 33, totalGB: 50 },
		permissoes: { verTodos: false, aprovar: false, editar: true },
	},
	{
		id: 2,
		nome: "Michael Nogueira",
		cpf: "335.250.908-54",
		senha: "marinha123",
		setor: "Desenvolvimento",
		armazenamento: { usadoGB: 19, totalGB: 50 },
		permissoes: { verTodos: true, aprovar: true, editar: true },
	},
];
