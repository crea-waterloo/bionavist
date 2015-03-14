var connection;
function websocketClient() {
    connection = new WebSocket("ws://"+window.location.hostname+":8081");
    connection.binaryType = "blob";
    connection.onopen = function () {
        connection.send("fetch");
    };
    connection.onclose = function () {
        // console.log("Connection closed");
        alert("Connection closed");
    };
    connection.onerror = function () {
        console.error("Connection error");
    };
    connection.onmessage = function (event) {
        // if (event.data instanceof Blob) {
        //     reader = new FileReader();
        //     reader.onload = function () {
        //         console.log(reader.result);
        //     }
        //     reader.readAsText(event.data);
        // }
        console.log(event.data);
        var div = document.createElement("div");
        div.textContent = event.data;
        document.body.appendChild(div);
    };
}

window.addEventListener("beforeunload", function(event) {
    connection.close();
});