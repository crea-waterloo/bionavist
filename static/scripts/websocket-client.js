var connection;

function websocketClient() {
    connection = new WebSocket("ws://ws."+window.location.hostname);
    //connection = new WebSocket("ws://ws.bionavist.com");

    connection.onopen = function () {
        connection.send("fetch");
    };
    connection.onclose = function () {
        handleConnectionClose();
    };
    connection.onerror = function () {
        console.error("Connection error");
    };
    connection.onmessage = function (event) {
        handleOnMessage(JSON.parse(event.data));
    };
}
