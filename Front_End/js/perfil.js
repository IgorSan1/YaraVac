(function(){
    const API_BASE = "http://localhost:8080/api/v1";

    // Função para formatar CPF
    function formatarCpf(cpf) {
        if (!cpf) return "";
        const digits = cpf.replace(/\D/g, "");
        return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    // Função para formatar telefone
    function formatarTelefone(telefone) {
        if (!telefone) return "";
        const digits = telefone.replace(/\D/g, "");
        if (digits.length === 11) {
            return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
        } else if (digits.length === 10) {
            return digits.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
        }
        return telefone;
    }

    // Função para formatar data
    function formatarData(data) {
        if (!data) return "";
        const [ano, mes, dia] = data.split("-");
        return `${dia}/${mes}/${ano}`;
    }

    async function carregarPerfilUsuario() {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Você precisa estar logado para acessar o perfil.");
            window.location.href = "login.html";
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
                console.error("Erro ao carregar perfil:", resp.status);
                alert("Erro ao carregar perfil do usuário.");
                return;
            }

            const data = await resp.json().catch(() => ({}));
            console.log("Dados do perfil:", data);

            // Normaliza possíveis formatos de resposta
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

            if (usuario) {
                preencherPerfil(usuario);
            } else {
                console.error("Usuário não encontrado na resposta.");
                alert("Não foi possível carregar as informações do usuário.");
            }
        } catch (err) {
            console.error("Erro ao carregar perfil:", err);
            alert("Falha ao carregar perfil do usuário.");
        }
    }

    function preencherPerfil(usuario) {
        // Atualizar nome na header
        const headerUserSpan = document.querySelector(".user-profile span");
        if (headerUserSpan) {
            headerUserSpan.textContent = usuario.usuario || "Usuário";
        }

        // Preencher Informações Pessoais
        const inputs = document.querySelectorAll(".form-group input");
        
        // Mapeamento de labels para valores do usuário
        const mapeamento = {
            "Usuário:": usuario.usuario || "",
            "CPF:": formatarCpf(usuario.cpf) || "",
            "Data de nascimento:": formatarData(usuario.dataNascimento) || "",
            "Nome completo:": usuario.nomeCompleto || "",
            "E-mail:": usuario.email || "",
            "Telefone:": formatarTelefone(usuario.telefone) || "",
            "Cargo:": usuario.cargo || "",
            "CNS:": usuario.cns || "",
            "Unidade de Saúde:": usuario.unidadeSaude || "",
        };

        // Iterar sobre os inputs e preencher com os valores do usuário
        inputs.forEach((input) => {
            const label = input.previousElementSibling;
            if (label) {
                const labelText = label.textContent.trim();
                if (mapeamento[labelText]) {
                    input.value = mapeamento[labelText];
                }
            }
        });
    }

    // Carregar perfil ao inicializar a página
    carregarPerfilUsuario();
})();

