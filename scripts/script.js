const input = document.querySelector(".idLogin");
let user = {};

input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.querySelector(".userInput>button").click();
    }
}
);

function menuSidebar() {
    const classSidebar = document.querySelector(".sidebar");
    if (classSidebar.classList.contains("hidden")) {
        classSidebar.classList.remove("hidden");
        setTimeout(() => {
            classSidebar.querySelector(".menuSide").classList.add("show");
        }, 100);
    } else {
        classSidebar.querySelector(".menuSide").classList.remove("show");
        setTimeout(() => {
            classSidebar.classList.add("hidden");
        }, 1500);
    }
}

function conectServer(string) {
    axios.defaults.headers.common['Authorization'] = `${string}`;
}

function loginServer() {
    user = {
        name: input.value
    };

    const promiseLogin = axios.post('https://mock-api.driven.com.br/api/vm/uol/participants', user)
    document.querySelector(".userInput").classList.add("hidden");
    document.querySelector(".loading").classList.remove("hidden");

    promiseLogin.then((reply) => {
        if (reply.status === 200) {
            document.querySelector(".loginPage").classList.add("hidden");
            document.querySelector(".msgPage").classList.remove("hidden");
        }
    });
    promiseLogin.catch((reply) => {
        if (reply.response.status === 400) {
            document.querySelector(".loading").classList.add("hidden");
            document.querySelector(".userInput").classList.remove("hidden");
            alert("Nome de Usuário já utilizado, por favor selecione outro Nome de Usuário");
        }
    });
    input.value = "";
}
function renderMsg(){
    const promiseMsg = axios.get('https://mock-api.driven.com.br/api/vm/uol/messages');
    promiseMsg.then((reply) => {
        msgData = reply.data;
        let mensages = document.querySelector("main>ul");
        mensages.innerHTML = ""
        for(let i = 0; i < msgData.length; i++){
            mensages.innerHTML += `
            <li data-test="message" class="msg ${msgData[i].type}">
                <p class="timer">(${msgData[i].time})</p>
                <p><strong>${msgData[i].from}</strong> definir em um switch/case <strong>${msgData[i].to}</strong>: ${msgData[i].text}</p>
            </li>`   
        }
        mensages.scrollIntoView({block: "end"});
    });
}



conectServer('');
setInterval(() => {
    axios.post('https://mock-api.driven.com.br/api/vm/uol/status', user);
}, 5000);
renderMsg()
setInterval(renderMsg, 3000);
