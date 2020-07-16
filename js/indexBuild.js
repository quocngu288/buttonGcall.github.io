
// let linkSocketIo = document.createElement('script')
// linkSocketIo.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.js')
let linkCss = document.createElement('link');
linkCss.setAttribute('rel', 'stylesheet');
linkCss.setAttribute('type', 'text/css');
linkCss.setAttribute('href', './css/index.css');
let linkImage = document.createElement('link');
//add vào header
// document.head.appendChild(linkSocketIo);
document.head.appendChild(linkCss);
let container = document.createElement('div');
container.classList.add("container");
document.body.appendChild(container)
let wrapAll = document.createElement('div');
wrapAll.classList.add("wrapAll");
container.appendChild(wrapAll)
let gbutton = document.createElement('div');
gbutton.classList.add("GButton");
//add GButton
wrapAll.appendChild(gbutton);
let button = document.createElement("button");
// button.innerHTML = "Show"
let img = document.createElement('img');
img.classList.add("image")
img.setAttribute('src', './img/send.svg');

//add button
gbutton.appendChild(button);
button.appendChild(img)
let gpanel = document.createElement('div');
gpanel.classList.add('GPanel')
//add gpanel
wrapAll.appendChild(gpanel)
let gpanel_header = document.createElement('div');
gpanel_header.classList.add('GPanel_header')
//add gpanel_header
gpanel.appendChild(gpanel_header);
let logo = document.createElement('div');
logo.classList.add('logo');
let imgLogo = document.createElement("img");
imgLogo.classList.add('imgLogo')
imgLogo.setAttribute('src', '../img/gcallupdate.png')
let span = document.createElement('span');
span.innerHTML = "GCovid"
let close = document.createElement('div');
close.classList.add('close')
let i = document.createElement('i');
i.innerHTML = "X"
//add logo và close
// gpanel_header.appendChild(img)
gpanel_header.appendChild(logo);
//add span
logo.appendChild(imgLogo)
logo.appendChild(span)
gpanel_header.appendChild(close);
// add i
close.appendChild(i)
let gpanel_body = document.createElement('div');
gpanel_body.classList.add("GPanel_body");
gpanel.appendChild(gpanel_body);
let gpanel_input = document.createElement('div');
gpanel_input.classList.add("GPanel_input")
let input = document.createElement("input");
input.placeholder = "write a reply"
input.classList.add("inputControl");
let sendButton = document.createElement("div");
sendButton.classList.add("sendButton");
//add gpanel_input
gpanel.appendChild(gpanel_input);
//add input control
gpanel_input.appendChild(input)
gpanel_input.appendChild(sendButton)
document.body.appendChild(wrapAll)
//sử lý sự kiện
let socket = io("https://gcalls-hackathon.herokuapp.com/");
let currentQuestion = {}
gbutton.addEventListener('click', showPanel);
close.addEventListener('click', closePanel);
input.addEventListener('keydown', sendMes);
input.addEventListener('input', setValueInput)

function showPanel() {
    gpanel.style.visibility = "visible";
    gbutton.style.visibility = "hidden";
    initQuestion()
}
function closePanel() {
    gpanel.style.visibility = "hidden";
    gbutton.style.visibility = "visible";
}
let message = "";
function setValueInput(e) {
    message = e.target.value
}
// hand crolltop
var objDiv = document.querySelector(".GPanel_body");
objDiv.scrollTop = objDiv.scrollHeight;
var checkscroll = 1;
var scrollOfAppend = 0;
gpanel_body.addEventListener("scroll", () => {
    if (scrollOfAppend == 1) // là user scroll chứ không phải do append
    {
        // tắt không cho scroll bởi append 
        checkscroll = 0;

    }
    if (gpanel_body.scrollHeight - gpanel_body.scrollTop == gpanel_body.clientHeight) // user kéo xuống bottom 
    {

        // bật cho append scroll 
        checkscroll = 1;

    }
})
function initQuestion() {
    socket.emit('open-chat');
    socket.on('question', (question) => {
        if (question.end) {
            console.log(question);
            let divSer = document.createElement("div");
            divSer.classList.add("mesServer")
            let p = document.createElement("p");
            p.innerHTML = "Cảm ơn bạn đã hoàn thành bản khảo sát, để biết thêm về tình hình Covid 19 tại Việt Nam, vui lòng truy cập địa chỉ: ";
            let a = document.createElement("a");
            a.setAttribute('href', 'localhost')
            a.innerHTML = "https://localhost:3000"
            gpanel_body.appendChild(divSer);
            divSer.appendChild(p);
            p.appendChild(a);
            if (checkscroll == 1) {
                scrollOfAppend = 1;
                gpanel_body.scrollTop = gpanel_body.scrollHeight;
            }
            return;
        }
        else currentQuestion = question;
        if (question.status === false) {
            var un = question.content;
            var ten = "Bạn phải nhập Yes/No"
            un = ten;
            let divSer = document.createElement("div");
            divSer.classList.add("mesServer")
            let p = document.createElement("p");
            p.style.backgroundColor = '#f45050'
            p.innerHTML = un;
            gpanel_body.appendChild(divSer);
            divSer.appendChild(p)
            console.log("quesFale", question);
            currentQuestion = question;
            if (checkscroll == 1) {
                scrollOfAppend = 1;
                gpanel_body.scrollTop = gpanel_body.scrollHeight;
            }
            return question;
        }
        let divSer = document.createElement("div");
        divSer.classList.add("mesServer")
        let p = document.createElement("p");
        p.innerHTML = question.content;
        gpanel_body.appendChild(divSer);
        divSer.appendChild(p)

        if (checkscroll == 1) {
            scrollOfAppend = 1;
            gpanel_body.scrollTop = gpanel_body.scrollHeight;
        }
    })
}
//emit
function sendMes(e) {
    if (e.key === "Enter") {
        input.value = "";
        //client
        let divCli = document.createElement("div");
        divCli.classList.add("mesClient")
        let pCli = document.createElement("p");
        pCli.innerHTML = message;
        gpanel_body.appendChild(divCli);
        divCli.appendChild(pCli)
        console.log(typeof message);
        replyMes(message)
    }
}
function replyMes(message) {
    if (currentQuestion.isBoolean === false) {
        //server
        socket.emit('answer', {
            tag: currentQuestion.tag,
            isBoolean: currentQuestion.isBoolean,
            content: message
        })
        return
    }
    socket.emit('answer', {
        yesorno: message,
        _id: currentQuestion._id,
        isBoolean: currentQuestion.isBoolean,
    })
}




