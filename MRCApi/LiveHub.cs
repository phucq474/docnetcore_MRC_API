using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MRCApi
{
    public class LiveHub : Hub
    {
        public async Task SendMessage(string connectionId,string user,string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", "A connection with ID '" + connectionId + "' has just connected",user,message);
        }
    }
}
