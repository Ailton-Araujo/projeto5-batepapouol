const input = document.querySelector(".idLogin");

let user = {};
let loginUser = {};

input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.querySelector(".userInput>button").click();
    }
}
);

function conectServer(string) {
    axios.defaults.headers.common['Authorization'] = `${string}`;
}

function loginServer() {

    user = {
        name: input.value
    };

    loginUser = axios.post('https://mock-api.driven.com.br/api/vm/uol/participants', user)
    document.querySelector(".userInput").classList.add("hidden");
    document.querySelector(".loading").classList.remove("hidden");


    loginUser.then((reply) => {
        if(reply.status === 200){
            document.querySelector(".overlay").classList.add("hidden")
        }
    });

    loginUser.catch((reply) => {
        if(reply.response.status === 400){
            document.querySelector(".loading").classList.add("hidden");
            document.querySelector(".userInput").classList.remove("hidden");
            alert("Nome de Usuário já utilizado, por favor selecione outro Nome de Usuário")
        }
    });
    input.value = "";
}

function keepStatus() {
    const statusUser = axios.post('https://mock-api.driven.com.br/api/vm/uol/status', user)
}


conectServer('');
//setInterval(keepStatus, 5000);