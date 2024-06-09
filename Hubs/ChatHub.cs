using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Security.Claims;
namespace OfferApp.Hubs
{

    public class ChatHub : Hub
    {

        private static ConcurrentDictionary<string, (string Username, string UserId)> Users = new ConcurrentDictionary<string, (string Username, string UserId)>();

        public override Task OnConnectedAsync()
        {
            var username = Context.User?.FindFirst(ClaimTypes.Surname)?.Value;
            var userId = Context.User?.FindFirst(ClaimTypes.Name)?.Value;
            if (username != null && userId != null)
            {
                Users.TryAdd(Context.ConnectionId, (username, userId));
                var userListJson = JsonConvert.SerializeObject(Users.Values); // Kullanıcı listesini JSON formatına dönüştür
                Clients.All.SendAsync("UpdateUserList", userListJson); // Kullanıcı listesini güncelle
            }
            return base.OnConnectedAsync();
        }
        public override Task OnDisconnectedAsync(Exception exception)
        {
            Users.TryRemove(Context.ConnectionId, out _); // Bağlantı kimliği ile silme işlemi yapılmalı
            var userListJson = JsonConvert.SerializeObject(Users.Values); // Kullanıcı listesini JSON formatına dönüştür
            Clients.All.SendAsync("UpdateUserList", userListJson); // Kullanıcı listesini güncelle
            return base.OnDisconnectedAsync(exception);
        }


        public async Task SendMessage(string message)
        {

            var username = Context.User?.FindFirst(ClaimTypes.Surname)?.Value;
            await Clients.All.SendAsync("ReceiveMessage", username, message);
        }
        public async Task SendMessageToUser(string userId, string message)
        {
            var connectionId = Users.FirstOrDefault(u => u.Value.UserId == userId).Key;
            if (connectionId != null)
            {
                var senderUsername = Context.User?.FindFirst(ClaimTypes.Surname)?.Value;
                await Clients.Client(connectionId).SendAsync("ReceiveMessage", senderUsername, message);
            }
        }
    }

}
