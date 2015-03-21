var connection;

function websocketClient() {
    connection = new WebSocket("ws://"+window.location.hostname+":8081");

    connection.onopen = function () {
        connection.send("fetch");
    };
    connection.onclose = function () {
        console.log("Connection closed");
    };
    connection.onerror = function () {
        console.error("Connection error");
    };
    connection.onmessage = function (event) {
        handleOnMessage(JSON.parse(event.data));
    };
}
