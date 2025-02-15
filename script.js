const registeredLogin = "Pratique";
const registeredPassword = "Estacionamento1402";

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
        showMessage("Login ou senha incorreto");
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

function submitInfo() {
    var nome = document.getElementById("nome").value;
    var email = document.getElementById("email").value;
    var telefone = document.getElementById("telefone").value;
    showMessage("Nome: " + nome + "\nE-mail: " + email + "\nTelefone: " + telefone);

    // Função para verificar e cadastrar ou atualizar contato
    function verificarECadastrarOuAtualizarContato(nome, telefone, email) {
        var dataAtual = obterDataAtualFormatada();

        var verificar = {
            "url": `https://somarcasctg.digisac.app/api/v1/contacts?where[data][number]=${telefone}`,
            "method": "GET",
            "headers": {
                "Authorization": "Bearer 5f549bfdd71ddbe1eab5640ce6c897764284cdaa",
                "Content-Type": "application/json"
            }
        };

        // Função para lidar com a resposta da verificação
        function handleResponse(response) {
            if (!response || response.length === 0) {
                showMessage("Contato não cadastrado. Cadastrando...");
                var cadastrar = {
                    "url": "https://somarcasctg.digisac.app/api/v1/contacts",
                    "method": "POST",
                    "headers": {
                        "Authorization": "Bearer 5f549bfdd71ddbe1eab5640ce6c897764284cdaa",
                        "Content-Type": "application/json"
                    },
                    "body": JSON.stringify({
                        "name": nome,
                        "number": telefone,
                        "email": email,
                        "note": dataAtual
                    })
                };

                // Execute a requisição POST
                fetch(cadastrar.url, {
                    method: cadastrar.method,
                    headers: cadastrar.headers,
                    body: cadastrar.body
                })
                    .then(response => response.json())
                    .then(data => showMessage('Contato criado:', data))
                    .catch(error => console.error('Erro:', error));
            } else {
                showMessage("Contato já cadastrado.");
                var contatoId = response[0].id;
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
                    .then(data => showMessage('Contato atualizado:', data))
                    .catch(error => console.error('Erro:', error));
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
    var HTTP = {
        "url": "https://somarcasctg.digisac.app/api/v1/messages",
        "method": "POST",
        "headers": {
            "Authorization": "Bearer 5f549bfdd71ddbe1eab5640ce6c897764284cdaa",
            "Content-Type": "application/json"
        },
        "body": JSON.stringify({
            "type": "chat",
            "contactId": contatoId,
            "serviceId": "167e93b2-23ce-4615-836a-fc019ad79549",
            "dontOpenTicket": "true",
            "hsmId": "15e6ad1e-d019-4474-9749-d6b280ead614",
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
            showMessage("Requisição enviada com sucesso!");
            // Limpar o formulário após o envio
            document.getElementById("infoForm").reset();
        })
        .catch(error => {
            console.error('Erro:', error);
            showMessage("Erro ao enviar a requisição.");
        });
}
