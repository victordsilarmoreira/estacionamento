const registeredLogin = "Pratique";
const registeredPassword = "Estacionamento1402";

function submitLogin() {
    var login = document.getElementById("login").value;
    var senha = document.getElementById("senha").value;

    if (login === registeredLogin && senha === registeredPassword) {
        alert("Login bem-sucedido!");
        document.getElementById("loginForm").style.display = "none";
        document.getElementById("infoForm").style.display = "block";
    } else {
        alert("Login ou senha incorretos.");
    }
}

function submitInfo() {
    var nome = document.getElementById("nome").value;
    var email = document.getElementById("email").value;
    var telefone = document.getElementById("telefone").value;
    alert("Nome: " + nome + "\nE-mail: " + email + "\nTelefone: " + telefone);

    var HTTP = {
        "url": "https://somarcasctg.digisac.app/api/v1/messages",
        "method": "POST",
        "headers": {
            "Authorization": "Bearer 5f549bfdd71ddbe1eab5640ce6c897764284cdaa",
            "Content-Type": "application/json"
        },
        "body": JSON.stringify({
             
            "type": "chat",
            "number": telefone,
            "serviceId": "167e93b2-23ce-4615-836a-fc019ad79549",
            "dontOpenTicket": "true",
            "hsmId": "b5b72295-ff4d-43f5-a9d0-8d068a0dc040",
            "files": [],
            "uploadingFiles": false,
            "replyTo": null,
            "components": {
                "type": "body",
                "parameters": []
            }
            }
        )
    };

    fetch(HTTP.url, {
        method: HTTP.method,
        headers: HTTP.headers,
        body: HTTP.body
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            alert("Requisição enviada com sucesso!");
        })
        .catch(error => {
            console.error('Erro:', error);
            alert("Erro ao enviar a requisição.");
        });

    var quantidadeLinhas = Object.keys(HTTP).length;
    alert("Quantidade de linhas: " + quantidadeLinhas);
}