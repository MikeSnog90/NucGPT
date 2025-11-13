// src/data/qualidade.js

export const MOCK_QUALIDADE = [
	{
		documentoId: "12345",
		arquivo: "planta_mecanica.pdf",
		pagina: 3,
		errosEncontrados: [
			{
				id: 1,
				descricao:
					"A linha de cota está desalinhada com o eixo principal.",
				corrigido: false,
			},
			{
				id: 2,
				descricao: "Texto de observação ultrapassa a margem da página.",
				corrigido: false,
			},
			{
				id: 3,
				descricao:
					"Símbolo elétrico 'QGBT' não encontrado na vista projetada.",
				corrigido: false,
			},
		],
	},
	{
		documentoId: "67890",
		arquivo: "esquema_eletrico_v2.pdf",
		pagina: 7,
		errosEncontrados: [
			{
				id: 4,
				descricao: "Falta aterramento no quadro de distribuição.",
				corrigido: true,
			},
		],
	},
];
