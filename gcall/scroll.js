var formLogin = document.querySelector(".login");
var pageChat = document.querySelector(".wrapper");

var id = document.querySelector("#id");
var pw = document.querySelector("#password");
var btn = document.querySelector("#button");

var placeErrId = document.querySelector(".errID");
var ContentErrId = document.querySelector(".errID p");

var placeErrPW = document.querySelector(".errPW");
var ContentErrPW = document.querySelector(".errPW p ");

var hai = document.querySelector(".onOff-hai");
var duy = document.querySelector(".onOff-duy");
var loc = document.querySelector(".onOff-loc");
var hoa = document.querySelector(".onOff-hoa");

var placeChat = document.querySelector(".placeChat");


var chatInput = document.querySelector("#textChat");
var objDiv = document.querySelector(".placeChat");
objDiv.scrollTop = objDiv.scrollHeight;
var namePeople = -1;



// handle receive content another people chat 
var checkscroll = 1;
var scrollOfAppend = 0;
placeChat.addEventListener("scroll", () => {

    if (scrollOfAppend == 1) // là user scroll chứ không phải do append
    {
        // tắt không cho scroll bởi append 
        checkscroll = 0;

    }
    if (placeChat.scrollHeight - placeChat.scrollTop == placeChat.clientHeight) // user kéo xuống bottom 
    {

        // bật cho append scroll 
        checkscroll = 1;

    }
});

