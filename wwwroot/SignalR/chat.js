$(document).on('click', '#ShowHidden', async function () {
    var secilenID = document.getElementById("chatdiv");
    if (secilenID.style.display == "none") {
        secilenID.style.display = "";
    } else {
        secilenID.style.display = "none";
    }
})

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();
   
    connection.on("UpdateUserList", function (users) {
        const userList = document.getElementById("onlineUser");
        userList.innerHTML = "";

        users.forEach(function (user) {
            const li = document.createElement("li");
            li.textContent = user;
           /* li.dataset.userId = user.Item2;*/
            li.classList.add("user-item"); // Eklenen sýnýf
            userList.appendChild(li);
        });

        // Kullanýcýlar dinamik olarak eklendiði için her seferinde olaylarý yeniden eklememiz gerekiyor
        const userItems = document.querySelectorAll(".user-item");
        userItems.forEach(item => {
            item.addEventListener("click", function () {
                userItems.forEach(i => i.classList.remove("selected")); // Önceki seçimleri kaldýr
                this.classList.add("selected"); // Seçilen kullanýcýya sýnýf ekle
            });
        });
    });



 

    //Disable the send button until connection is established.
    document.getElementById("sendButton").disabled = true;

    connection.on("ReceiveMessage", function (user, message) {
        var li = document.createElement("li");
        document.getElementById("messagesList").appendChild(li);
        li.textContent = `${user} : ${message}`;
    });

    connection.start().then(function () {
        document.getElementById("sendButton").disabled = false;
    }).catch(function (err) {
        return console.error(err.toString());
    });

    document.getElementById("sendButton").addEventListener("click", function (event) {
        var message = document.getElementById("messageInput").value;
        connection.invoke("SendMessage", message).catch(function (err) {
            return console.error(err.toString());
        });
        event.preventDefault();
    });
});