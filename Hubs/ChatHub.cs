using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.Security.Claims;
namespace OfferApp.Hubs
{

    public class ChatHub : Hub
    {

        private static ConcurrentDictionary<string, string> Users = new ConcurrentDictionary<string, string>();
       
        public override Task OnConnectedAsync()
        {
            var username = Context.User?.FindFirst(ClaimTypes.Surname)?.Value;
            Users.TryAdd(Context.ConnectionId, username);
            Clients.All.SendAsync("UpdateUserList", Users.Values);
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            Users.TryRemove(Context.ConnectionId, out _);
            Clients.All.SendAsync("UpdateUserList", Users.Values);
            return base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(string message)
        {

            var username = Context.User?.FindFirst(ClaimTypes.Surname)?.Value;
            await Clients.All.SendAsync("ReceiveMessage", username, message);
        }
    }

}
