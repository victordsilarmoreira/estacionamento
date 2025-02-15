var Verificar = {
    "url": "https://somarcasctg.digisac.app/api/v1/contacts?where[data][number]=&telefone&",
    "method": "GET",
    "headers": {
        "Authorization": "Bearer 5f549bfdd71ddbe1eab5640ce6c897764284cdaa",
        "Content-Type": "application/json"
    }
};

// Função para formatar a data no formato 'dd/MM/yyyy'
function formatarData(data) {
    var dia = String(data.getDate()).padStart(2, '0');
    var mes = String(data.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
    var ano = data.getFullYear();
    return dia + '/' + mes + '/' + ano;
}

// Obter a data atual
var dataAtual = new Date();
var datadodianoformato = formatarData(dataAtual);

// Função para lidar com a resposta
function handleResponse(response) {
    if (!response || response.length === 0) {
        // Se a resposta estiver vazia, execute a etapa cadastrarcontato
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

        // Execute a requisição POST
        fetch(cadastrarcontato.url, {
            method: cadastrarcontato.method,
            headers: cadastrarcontato.headers,
            body: cadastrarcontato.body
        })
        .then(response => response.json())
        .then(data => console.log('Contato criado:', data))
        .catch(error => console.error('Erro:', error));
    } else {
        console.log('Contato já existe:', response);
    }
}

// Execute a requisição GET
fetch(Verificar.url, {
    method: Verificar.method,
    headers: Verificar.headers
})
.then(response => response.json())
.then(data => handleResponse(data))
.catch(error => console.error('Erro:', error));
