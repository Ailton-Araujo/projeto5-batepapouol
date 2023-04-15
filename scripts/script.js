let user = {};
let toUser = "";
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



function dataMsg(data) {
    if (data.classList.contains("to") === true &&
        data.querySelector("span .check") === null) {
        let old = document.querySelector(".users span .check");
        old.parentNode.innerHTML = ""

        data.querySelector("span").innerHTML = `<ion-icon data-test="check" class="check" name="checkmark"></ion-icon>`

        document.querySelector("span.toMsg").innerHTML = data.querySelector("p").innerHTML;
        toUser = data.querySelector("p").innerHTML;
        message.to = data.querySelector("p").innerHTML;

    } else if (data.classList.contains("type") === true &&
        data.querySelector("span .check") === null) {
        let old = document.querySelector(".msgType li>span .check");
        old.parentNode.innerHTML = ""

        data.querySelector("span").innerHTML = `<ion-icon data-test="check" class="check" name="checkmark"></ion-icon>`

        if (data.classList[1] === "private_message") {
            document.querySelector("span.typeMsg").innerHTML = ` (${data.querySelector("p").innerHTML})`;
        } else {
            document.querySelector("span.typeMsg").innerHTML = "";
        }

        message.type = data.classList[1];
    }
}

function conectServer(string) {
    axios.defaults.headers.common['Authorization'] = `${string}`;
}

function loginServer() {
    user = {
        name: inputLogin.value
    };
    message.from = user.name;

    const promiseLogin = axios.post('https://mock-api.driven.com.br/api/vm/uol/participants', user);
    document.querySelector(".userInput").classList.add("hidden");
    document.querySelector(".loading").classList.remove("hidden");

    promiseLogin.then((reply) => {
        if (reply.status === 200) {
            document.querySelector(".loginPage").classList.add("hidden");
            document.querySelector(".msgPage").classList.remove("hidden");
            renderMsgs();
            renderUsers();
            setInterval(renderMsgs, 3000);
            setInterval(renderUsers, 10000);
        }
    });
    promiseLogin.catch((reply) => {
        if (reply.response.status === 400) {
            document.querySelector(".loading").classList.add("hidden");
            document.querySelector(".userInput").classList.remove("hidden");
            alert("Nome de Usuário já utilizado, por favor selecione outro Nome de Usuário");
            inputLogin.value = "";
        }
    });
}

function renderMsgs() {
    const promiseMsg = axios.get('https://mock-api.driven.com.br/api/vm/uol/messages');
    /// Build the messages.
    promiseMsg.then((reply) => {
        let mensages = document.querySelector("main>ul");
        mensages.innerHTML = ""
        for (let i = 0; i < reply.data.length; i++) {
            switch (reply.data[i].type) {
                case "status":
                    mensages.innerHTML += `
                    <li data-test="message" class="msg ${reply.data[i].type}">
                        <p><span class="time">(${reply.data[i].time})</span> <strong>${reply.data[i].from}</strong> ${reply.data[i].text}</p>
                    </li>`
                    break;
                case "message":
                    mensages.innerHTML += `
                    <li data-test="message" class="msg ${reply.data[i].type}">
                        <p><span class="time">(${reply.data[i].time})</span> <strong>${reply.data[i].from}</strong> para <strong>${reply.data[i].to}:</strong> ${reply.data[i].text}</p>
                    </li>`
                    break;
                case "private_message":
                    if (reply.data[i].from === user.name || reply.data[i].to === user.name) {
                        mensages.innerHTML += `
                        <li data-test="message" class="msg ${reply.data[i].type}">
                            <p><span class="time">(${reply.data[i].time})</span> <strong>${reply.data[i].from}</strong> reservadamente para <strong>${reply.data[i].to}:</strong> ${reply.data[i].text}</p>
                        </li>`
                    }else {
                        mensages.innerHTML += `
                        <li data-test="message" class="msg hidden ${reply.data[i].type}">
                            <p><span class="time">(${reply.data[i].time})</span> <strong>${reply.data[i].from}</strong> reservadamente para <strong>${reply.data[i].to}:</strong> ${reply.data[i].text}</p>
                        </li>`
                    }
                    break;
            }
        }
        mensages.scrollIntoView({ block: "end" });
    });
}


function renderUsers() {
    const promiseUsers = axios.get('https://mock-api.driven.com.br/api/vm/uol/participants');
    /// Build the sidebar
    promiseUsers.then((reply) => {
        let checkStatus = 0;
        let users = document.querySelector(".menuSide>.users");
        users.innerHTML = `
                <li class="to toAll" onclick="dataMsg(this)">
                    <ion-icon name="people"></ion-icon>
                    <p data-test="all">Todos</p>
                </li>`;
        for (let i = 0; i < reply.data.length; i++) {
            if (toUser !== reply.data[i].name) {
                users.innerHTML += `
                <li class="to toUser" onclick="dataMsg(this)">
                    <ion-icon name="person-circle"></ion-icon>
                    <p data-test="participant">${reply.data[i].name}</p>
                    <span></span>
                </li>`;
            } else if (toUser === reply.data[i].name) {
                users.innerHTML += `
                <li class="to toUser" onclick="dataMsg(this)">
                    <ion-icon name="person-circle"></ion-icon>
                    <p data-test="participant">${reply.data[i].name}</p>
                    <span><ion-icon data-test="check" class="check" name="checkmark"></ion-icon></span>
                </li>`;
                checkStatus = 1;
            }
            if(i === (reply.data.length-1) && checkStatus !== 1){
                toUser = "";
            }
        }
        if (toUser === "" && checkStatus !== 1) {
            document.querySelector(".users > .toAll").innerHTML += `<span><ion-icon data-test="check" class="check" name="checkmark"></ion-icon></span>`
        }
    })
}

const inputMsg = document.querySelector(".textMsg");
inputMsg.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        ///event.preventDefault();
        document.querySelector("footer > button").click();
    }
}
);

function sendMsg() {
    message.text = inputMsg.value;
    inputMsg.value = "";
    const promiseMsg = axios.post('https://mock-api.driven.com.br/api/vm/uol/messages', message);
    message.text = "";
    promiseMsg.then((reply) => {
        if (reply.status === 200) {
            renderMsgs();
        }
    });
    promiseMsg.catch(() => {
        window.location.reload();
    });
}

conectServer('yLXdTVeSPYJui1kPya4pTuGv');
setInterval(() => {
    axios.post('https://mock-api.driven.com.br/api/vm/uol/status', user);
}, 5000);

