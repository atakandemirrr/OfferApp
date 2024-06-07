using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Security.Claims;
namespace OfferApp.Hubs
{

    public class ChatHub : Hub
    {

        private static List<(string Username, string UserId)> Users = new List<(string Username, string UserId)>();


        public override Task OnConnectedAsync()
        {
            var username = Context.User?.FindFirst(ClaimTypes.Surname)?.Value;
            var userId = Context.User?.FindFirst(ClaimTypes.Name)?.Value;
            if (username != null && userId != null)
            {
                Users.Add((username, userId));       
                var userListJson = JsonConvert.SerializeObject(Users);
                List<(string, string)> dataList = JsonConvert.DeserializeObject<List<(string, string)>>(userListJson);
                Clients.All.SendAsync("UpdateUserList", dataList);
            }
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            var username = Context.User?.FindFirst(ClaimTypes.Surname)?.Value;
            var userId = Context.User?.FindFirst(ClaimTypes.Name)?.Value;
            if (username != null && userId != null)
            {
                Users.Remove((username, userId));
                var userListJson = JsonConvert.SerializeObject(Users);
                Clients.All.SendAsync("UpdateUserList", userListJson);
            }
            return base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(string message)
        {

            var username = Context.User?.FindFirst(ClaimTypes.Surname)?.Value;
            await Clients.All.SendAsync("ReceiveMessage", username, message);
        }
    }

}
