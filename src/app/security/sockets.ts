
"use strict";
var username = `user_${getRandomNumber()}`

function getRandomNumber() {
    return Math.floor(Math.random() * 1000);
}



var Chat = {};

class web_chat {
    socket: WebSocket;
    u1: string;
    constructor(u1:string){
        if (window.location.protocol == 'http:') {
            this.connect('ws://' + window.location.host + '/chat');
        } else {
            this.connect('wss://' + window.location.host + '/chat');
        }
    }



    public connect(host:string | URL){
        if ('WebSocket' in window) {
            this.socket = new WebSocket(host);
        } else if ('MozWebSocket' in window) {
            this.socket = new MozWebSocket(host);
        } else {
            append_terminal_rd('不支持此浏览器，请使用 Firefox, Chrom, Safari.');
            return;
        }

        this.socket.onopen = function () {
            append_terminal_gr('服务器接口打开。');
            send_regi();
        };

        this.socket.onclose = function () {
            append_terminal_rd('服务器接口关闭。');
        };

    }

    public send (a:string) {
        if (a != '') {
            this.socket.send(a);
        }
    }


}




// document.addEventListener("DOMContentLoaded", function() {
//     // Remove elements with "noscript" class - <noscript> is not allowed in XHTML
//     var noscripts = document.getElementsByClassName("noscript");
//     for (var i = 0; i < noscripts.length; i++) {
//         noscripts[i].parentNode.removeChild(noscripts[i]);
//     }
// }, false);

