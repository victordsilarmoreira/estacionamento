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
        showMessage("Login ou senha incorretos.");
    }
}

function submitInfo() {
    var nome = document.getElementById("nome").value;
    var email = document.getElementById("email").value;
    var telefone = document.getElementById("telefone").value;
    showMessage("Nome: " + nome + "\nE-mail: " + email + "\nTelefone: " + telefone);

//Vericar se tem contato cadastrado
var Verificar = {
    "url": "https://somarcasctg.digisac.app/api/v1/contacts?where[data][number]=&telefone&",
    "method": "GET",
    "headers": {
        "Authorization": "Bearer 5f549bfdd71ddbe1eab5640ce6c897764284cdaa",
        "Content-Type": "application/json"
    }
};

// Function to handle the response
function handleResponse(response) {
    if (!response || response.length === 0) {
        // If the response is empty, execute the cadastrarcontato step
        var cadastrarcontato = {
            "url": "https://somarcasctg.digisac.app/api/v1/contacts",
            "method": "POST",
            "headers": {
                "Authorization": "Bearer 5f549bfdd71ddbe1eab5640ce6c897764284cdaa",
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({
                "internalName": nome,
                "number": telefone,
                "serviceId": "f49b7105-2799-4b93-aaa2-73da0f8c59b5",
                "note": datadodianoformato,
                "defaultDepartmentId": "9d76e703-bf88-4c17-bfeb-0f2de8f99e80",
                "tagIds": [
                    "6790bd44-53b5-4253-878d-64c0ca509d26"
                ]
            })
        };

        // Execute the POST request
        fetch(cadastrarcontato.url, {
            method: cadastrarcontato.method,
            headers: cadastrarcontato.headers,
            body: cadastrarcontato.body
        })
        .then(response => response.json())
        .then(data => console.log('Contact created:', data))
        .catch(error => console.error('Error:', error));
    } else {
        console.log('Contact already exists:', response);
    }
}

// Execute the GET request
fetch(Verificar.url, {
    method: Verificar.method,
    headers: Verificar.headers
})
.then(response => response.json())
.then(data => handleResponse(data))
.catch(error => console.error('Error:', error));

//Cadastrar contato



    
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
            "components": [{
                "type": "body",
                "parameters": []
            }]
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
