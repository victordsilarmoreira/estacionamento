const registeredLogin = "A";
const registeredPassword = "A";

function showMessage(message) {
    const messageBox = document.getElementById("messageBox");
    messageBox.textContent = message;
    messageBox.style.display = "block";
    messageBox.style.opacity = "1";

    setTimeout(() => {
        messageBox.style.opacity = "0";
        setTimeout(() => {
            messageBox.style.display = "none";
        }, 500);
    }, 3000);
}

function submitLogin() {
    var login = document.getElementById("login").value;
    var senha = document.getElementById("senha").value;

    if (login === registeredLogin && senha === registeredPassword) {
        showMessage("Login bem-sucedido!");
        document.getElementById("loginForm").style.display = "none";
        document.getElementById("infoForm").style.display = "block";
    } else {
        showMessage("Login ou senha incorreto.");
    }
}

function obterDataAtualFormatada() {
    var data = new Date();
    var dia = String(data.getDate()).padStart(2, '0');
    var mes = String(data.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
    var ano = data.getFullYear();
    return dia + '/' + mes + '/' + ano;
}

var dataAtual = obterDataAtualFormatada();

function mascararTelefone(input) {
    var telefone = input.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    telefone = telefone.replace(/^(\d{2})(\d)/g, '($1) $2'); // Adiciona parênteses e espaço
    telefone = telefone.replace(/(\d{5})(\d)/, '$1-$2'); // Adiciona hífen
    input.value = telefone;
}

function formatarTelefone(telefone) {
    if (telefone.length !== 15) {
        showMessage("Telefone inválido");
        return;
    }
  
    var telefoneNumeros = '55' + telefone.replace(/[()\s-]/g, '');

    console.log("Número de telefone sem formatação:", telefoneNumeros);

    return telefoneNumeros;
}

function validarNome(nome) {
    var regex = /^[a-zA-Z\s]+$/;
    return regex.test(nome);
}

function validarEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function verificarECadastrarOuAtualizarContato(nome, telefone, email) {
    if (!validarEmail(email)) {
        showMessage("E-mail inválido.");
        return;
    }
    if (!validarNome(nome)) {
        showMessage("Nome inválido");
        return;
    }
    var phone =  telefone.replace(/[()\s-]/g, '');
    console.log("Telefone para cadastro:", phone)
    if (phone === null) {
        return;
    };
    var verificar = {
        "url": `https://somarcasctg.digisac.app/api/v1/contacts?where[data][number]=${phone}`,
        "method": "GET",
        "headers": {
            "Authorization": "Bearer 5f549bfdd71ddbe1eab5640ce6c897764284cdaa",
            "Content-Type": "application/json"
        }
    };

    console.log("URL da verificação:", verificar.url); // Log da URL da verificação

    // Função para lidar com a resposta da verificação
    function handleResponse(response) {
        console.log("Resposta da verificação:", response); // Log da resposta da verificação completa
        if (!response.data || response.data.length === 0) {
            showMessage("Contato não cadastrado. Cadastrando...");
            var cadastrar = {
                "url": "https://somarcasctg.digisac.app/api/v1/contacts",
                "method": "POST",
                "headers": {
                    "Authorization": "Bearer 5f549bfdd71ddbe1eab5640ce6c897764284cdaa",
                    "Content-Type": "application/json"
                },
                "body": JSON.stringify({
                    "internalName": nome,
                    "number": phone,
                    "serviceId": "167e93b2-23ce-4615-836a-fc019ad79549",
                    "note": dataAtual,
                    "defaultDepartmentId": "9d76e703-bf88-4c17-bfeb-0f2de8f99e80",
                    "tagIds": [
                        "6790bd44-53b5-4253-878d-64c0ca509d26"
                    ],
                    "custom-fields": [
                        {
                            "id": "b9a3d696-cc15-4ab3-a880-445705dfc263",
                            "value": email
                        }
                    ]
                })
            };

            console.log("Dados do cadastro:", cadastrar.body); // Log dos dados do cadastro

            // Execute a requisição POST
            fetch(cadastrar.url, {
                method: cadastrar.method,
                headers: cadastrar.headers,
                body: cadastrar.body
            })
                .then(response => {
                    if (!response.ok) {
                        return response.text().then(text => { throw new Error(text) });
                    }
                    return response.json();
                })
                .then(data => {
                    showMessage('Contato criado:', data);
                    enviarMensagem(data.id, phone, nome);
                })
                .catch(error => {
                    console.error('Erro:', error);
                    showMessage('Erro ao criar contato: ' + error.message);
                });
        } else {
            showMessage("Contato já cadastrado.");
            console.log("Primeiro item da resposta:", response.data[0]); // Log do primeiro item da resposta
            if (response.data[0] && response.data[0].id) {
                var contatoId = response.data[0].id;
                console.log("ID do contato:", contatoId); // Log do ID do contato
                var editarcontact = {
                    "url": `https://somarcasctg.digisac.app/api/v1/contacts/${contatoId}`,
                    "method": "PUT",
                    "headers": {
                        "Authorization": "Bearer 5f549bfdd71ddbe1eab5640ce6c897764284cdaa",
                        "Content-Type": "application/json"
                    },
                    "body": JSON.stringify({
                        "note": dataAtual
                    })
                };

                // Execute a requisição PUT
                fetch(editarcontact.url, {
                    method: editarcontact.method,
                    headers: editarcontact.headers,
                    body: editarcontact.body
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log("Resposta da atualização:", data); // Log da resposta da atualização
                        showMessage('Contato atualizado:', data);
                        enviarMensagem(contatoId, phone, nome);
                    })
                    .catch(error => console.error('Erro:', error));
            } else {
                console.error('Erro: ID do contato não encontrado na resposta.');
                showMessage('Erro ao obter o ID do contato.');
            }
        }
    }

    // Execute a requisição GET
    fetch(verificar.url, {
        method: verificar.method,
        headers: verificar.headers
    })
        .then(response => response.json())
        .then(data => handleResponse(data))
        .catch(error => console.error('Erro:', error));
}

function enviarMensagem(contatoId, telefone, nome) {
    var phone1 = telefone.replace(/[()\s-]/g, '');
    console.log("Telefone para cadastro:", phone1);
    if (phone1 === null) {
        return;
    }
    var telefoneFormatado1 = formatarTelefone(telefone);
    var HTTP = {
        "url": "https://somarcasctg.digisac.app/api/v1/messages",
        "method": "POST",
        "headers": {
            "Authorization": "Bearer 5f549bfdd71ddbe1eab5640ce6c897764284cdaa",
            "Content-Type": "application/json"
        },
        "body": JSON.stringify({
            "type": "chat",
            "number": phone1,
            "serviceId": "167e93b2-23ce-4615-836a-fc019ad79549",
            "dontOpenTicket": "true",
            "hsmId": "f45b2e5e-8fa0-4e10-a21f-d893b167de91",
            "files": [],
            "uploadingFiles": false,
            "replyTo": null,
            "parameters": [
                {
                    "type": "body",
                    "parameters": [
                        {
                            "type": "text",
                            "text": nome
                        }
                    ]
                }
            ],
            "fileTemplate": {}
        })
    };

    fetch(HTTP.url, {
        method: HTTP.method,
        headers: HTTP.headers,
        body: HTTP.body
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            console.log(data.number); // Corrigido aqui
            showMessage("Requisição enviada com sucesso!");
            // Limpar o formulário após o envio
            document.getElementById("infoForm").reset();
        })
        .catch(error => {
            console.error('Erro:', error);
            showMessage("Erro ao enviar a requisição.");
        });
}

function submitInfo() {
    var nome = document.getElementById("nome").value;
    var email = document.getElementById("email").value;
    var telefone = document.getElementById("telefone").value;

    var telefoneFormatado = formatarTelefone(telefone);
    if (!telefoneFormatado) {
        return; // Se o telefone não for válido, interrompe a execução
    }

    verificarECadastrarOuAtualizarContato(nome, telefoneFormatado, email);
}