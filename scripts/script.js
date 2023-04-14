let user = {};
let message = {
    from: "",
	to: "Todos",
	text: "",
	type: "message"
}

const inputLogin = document.querySelector(".idLogin");
inputLogin.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        ///event.preventDefault();
        document.querySelector(".userInput>button").click();
    }
}
);

function menuSidebar() {
    const classSidebar = document.querySelector(".sidebar");
    if (classSidebar.classList.contains("hidden")) {
        classSidebar.classList.remove("hidden");
        setTimeout(() => {
            classSidebar.classList.add("show");
        }, 100);
    } else {
        classSidebar.classList.remove("show");
        setTimeout(() => {
            classSidebar.classList.add("hidden");
        }, 1500);
    }
}

function dataMsg(data){
    if(data.classList.contains("to") === true &&
    data.querySelector(".check.hidden") !== null){

        data.parentNode.querySelector(".check.show").classList.add("hidden");
        data.parentNode.querySelector(".check.show").classList.remove("show");

        data.querySelector(".to>.check").classList.remove("hidden");
        data.querySelector(".to>.check").classList.add("show");
        
        message.to = data.querySelector("p").innerHTML;

    }else if(data.classList.contains("type") === true){

        data.parentNode.querySelector(".check.show").classList.add("hidden");
        data.parentNode.querySelector(".check.show").classList.remove("show");

        data.querySelector(".type>.check").classList.remove("hidden");
        data.querySelector(".type>.check").classList.add("show");

        message.type = data.classList[1];
    }
    console.log(message)
}

function conectServer(string) {
    axios.defaults.headers.common['Authorization'] = `${string}`;
}

function loginServer() {
    user = {
        name: inputLogin.value
    };
    message.from = user.name;

    const promiseLogin = axios.post('https://mock-api.driven.com.br/api/vm/uol/participants', user)
    document.querySelector(".userInput").classList.add("hidden");
    document.querySelector(".loading").classList.remove("hidden");

    promiseLogin.then((reply) => {
        if (reply.status === 200) {
            document.querySelector(".loginPage").classList.add("hidden");
            document.querySelector(".msgPage").classList.remove("hidden");
            renderPage();
        }
    });
    promiseLogin.catch((reply) => {
        if (reply.response.status === 400) {
            document.querySelector(".loading").classList.add("hidden");
            document.querySelector(".userInput").classList.remove("hidden");
            alert("Nome de Usuário já utilizado, por favor selecione outro Nome de Usuário");
            input.value = "";
        }
    });

}

function renderMsgs(){
    const promiseMsg = axios.get('https://mock-api.driven.com.br/api/vm/uol/messages');
    /// Build the messages.
    promiseMsg.then((reply) => {
        let mensages = document.querySelector("main>ul");
        mensages.innerHTML = ""
        for(let i = 0; i < reply.data.length; i++){
            mensages.innerHTML += `
            <li data-test="message" class="msg ${reply.data[i].type}">
                <p><span>
                   (${reply.data[i].time}) 
                </span><strong>
                    ${reply.data[i].from}
                </strong> definir em um switch/case <strong>
                 ${reply.data[i].to}: 
                </strong>${reply.data[i].text}
                </p>
            </li>`   
        }
        mensages.scrollIntoView({block: "end"});
    });
}

function renderUsers(){
    const promiseUsers = axios.get('https://mock-api.driven.com.br/api/vm/uol/participants');
        /// Build the sidebar
        promiseUsers.then((reply) =>{
            let users = document.querySelector(".menuSide>.users");
            users.innerHTML = `
                <li data-test="all" class="to" onclick="dataMsg(this)">
                    <ion-icon name="people"></ion-icon>
                    <p>Todos</p>
                    <ion-icon class="check show" name="checkmark"></ion-icon>
                </li>`;
            for(let i = 0; i < reply.data.length; i++){
                users.innerHTML += `
                <li data-test="participant" data-test="check" class="to" onclick="dataMsg(this)">
                    <ion-icon name="person-circle"></ion-icon>
                    <p>${reply.data[i].name}</p>
                    <ion-icon class="check hidden" name="checkmark"></ion-icon>
                </li>`;
            }
        })
}


conectServer('');
setInterval(() => {
    axios.post('https://mock-api.driven.com.br/api/vm/uol/status', user);
}, 5000);

renderMsgs()
renderUsers()
setInterval(renderMsgs, 3000);
setInterval(renderUsers, 10000);

