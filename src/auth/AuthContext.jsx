import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { MOCK_USERS } from "../mocks/users.js";

const AuthContext = createContext(null);

// util simples pra aceitar CPF "cru" ou formatado
function formatCpf(raw = "") {
	const only = String(raw).replace(/\D/g, "").slice(0, 11);
	if (only.length !== 11) return raw;
	return only.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null); // agora guarda o objeto completo do mock
	const [token, setToken] = useState(null);
	const [ready, setReady] = useState(false);

	// restaura sessão do localStorage
	useEffect(() => {
		const saved = localStorage.getItem("auth");
		if (saved) {
			try {
				const { user, token } = JSON.parse(saved);
				setUser(user || null);
				setToken(token || null);
			} catch {}
		}
		setReady(true);
	}, []);

	// mantém a mesma assinatura para não quebrar o resto do app
	const login = async (identifier, password) => {
		// simulando latência igual ao teu mock
		await new Promise((r) => setTimeout(r, 300));

		// aceita CPF formatado ou não
		const cpfFmt = formatCpf(identifier);

		// valida contra o teu mock
		const found = MOCK_USERS.find(
			(u) => u.cpf === cpfFmt && u.senha === password
		);

		if (!found) {
			throw new Error("Credenciais inválidas.");
		}

		// token fake só pra manter compatibilidade
		const data = {
			user: {
				id: found.id,
				nome: found.nome,
				cpf: found.cpf,
				setor: found.setor,
				armazenamento: found.armazenamento,
				permissoes: found.permissoes,
				// se quiser manter "name"/"email" por compatibilidade com UI antiga:
				name: found.nome,
				email: `${found.nome.split(" ")[0].toLowerCase()}@exemplo.com`,
			},
			token: "token-fake-" + btoa(found.cpf),
		};

		setUser(data.user);
		setToken(data.token);
		localStorage.setItem("auth", JSON.stringify(data));
		return data;
	};

	const logout = () => {
		setUser(null);
		setToken(null);
		localStorage.removeItem("auth");
	};

	const value = useMemo(
		() => ({ user, token, login, logout, ready }),
		[user, token, ready]
	);

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
