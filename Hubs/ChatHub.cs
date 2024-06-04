using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
namespace OfferApp.Hubs
{

    public class ChatHub : Hub
    {
        public async Task SendMessage(string message)
        {
            var userName = Context.User?.FindFirst(ClaimTypes.Surname)?.Value;

            await Clients.All.SendAsync("ReceiveMessage", userName, message);
        }
    }

}
