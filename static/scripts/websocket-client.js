var connection;

function websocketClient() {
    connection = new WebSocket("ws://"+window.location.hostname+":3007");

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
