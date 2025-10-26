(function(){
    const API_BASE = "http://localhost:8080/api/v1";
    const searchBar = document.querySelector(".search-bar");
    let debounceId;

    // Verificar se o usuario eh ADMIN e exibir o botao de cadastro de usuarios
    verificarPermissaoAdmin();

    async function verificarPermissaoAdmin() {
        const token = localStorage.getItem("token");
        if (!token) {
            return;
        }

        try {
            const resp = await fetch(`${API_BASE}/usuario/perfil`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!resp.ok) {
                return;
            }

            const data = await resp.json().catch(() => ({}));

            // Normaliza possiveis formatos de resposta
            let usuario = null;
            if (Array.isArray(data?.dados) && Array.isArray(data.dados[0])) {
                usuario = data.dados[0][0];
            } else if (Array.isArray(data?.dados)) {
                usuario = data.dados[0];
            } else if (data?.dados) {
                usuario = data.dados;
            } else {
                usuario = data;
            }

            // Verificar se o usuario tem a role ADMIN
            if (usuario && usuario.roles && usuario.roles.includes("ADMIN")) {
                const btnCadastroUsuario = document.getElementById("btnCadastroUsuario");
                if (btnCadastroUsuario) {
                    btnCadastroUsuario.style.display = "";
                }
            }
        } catch (err) {
            console.error("Erro ao verificar permissoes:", err);
        }
    }

    // Função para aplicar máscara de CPF
    function applyCpfMask(value) {
        const digits = (value || "").replace(/\D/g, "").slice(0, 11);
        const part1 = digits.slice(0, 3);
        const part2 = digits.slice(3, 6);
        const part3 = digits.slice(6, 9);
        const part4 = digits.slice(9, 11);
        let out = part1;
        if (part2) out += `.${part2}`;
        if (part3) out += `.${part3}`;
        if (part4) out += `-${part4}`;
        return out;
    }

    // Função para validar CPF (apenas dígitos)
    function isCpf(value) {
        const digits = (value || "").replace(/\D/g, "");
        return digits.length === 11;
    }

    // Aplicar máscara enquanto digita
    searchBar.addEventListener("input", () => {
        const cursorPos = searchBar.selectionStart;
        const oldValue = searchBar.value;
        const newValue = applyCpfMask(searchBar.value);
        searchBar.value = newValue;
        
        // Ajusta posição do cursor
        if (oldValue.length < newValue.length) {
            searchBar.setSelectionRange(cursorPos + 1, cursorPos + 1);
        }
    });

    // Buscar paciente ao pressionar Enter
    searchBar.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            buscarPaciente();
        }
    });

    // Debounce para busca automática (opcional)
    searchBar.addEventListener("input", () => {
        clearTimeout(debounceId);
        const cpf = searchBar.value;
        
        if (isCpf(cpf)) {
            debounceId = setTimeout(() => {
                buscarPaciente();
            }, 500);
        }
    });

    async function buscarPaciente() {
        const cpf = (searchBar.value || "").replace(/\D/g, "");
        
        if (cpf.length !== 11) {
            alert("Informe um CPF válido (11 dígitos).");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Você precisa estar logado para buscar pacientes.");
            window.location.href = "login.html";
            return;
        }

        try {
            const resp = await fetch(`${API_BASE}/pessoa/buscar-por-cpf`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ cpf: cpf }),
            });

            if (!resp.ok) {
                const data = await resp.json().catch(() => ({}));
                alert(data?.mensagem || "Paciente não encontrado.");
                return;
            }

            const raw = await resp.json().catch(() => ({}));
            
            // Normaliza possíveis formatos: dados: [[{...}]]  ou dados: [{...}] ou { ... }
            let pessoa = null;
            if (Array.isArray(raw?.dados) && Array.isArray(raw.dados[0])) {
                pessoa = raw.dados[0][0];
            } else if (Array.isArray(raw?.dados)) {
                pessoa = raw.dados[0];
            } else if (raw?.dados) {
                pessoa = raw.dados;
            } else {
                pessoa = raw;
            }

            if (pessoa && pessoa.uuid) {
                // Armazenar dados do paciente no localStorage para uso posterior
                localStorage.setItem("pacienteSelecionado", JSON.stringify(pessoa));
                
                // Redirecionar para a página de registrar vacinação com o paciente pré-selecionado
                window.location.href = `registrar-vacinacao.html?cpf=${cpf}`;
            } else {
                alert("Paciente não encontrado (UUID ausente).");
            }
        } catch (err) {
            console.error("Erro ao buscar paciente:", err);
            alert("Falha ao buscar paciente. Tente novamente.");
        }
    }
})();

