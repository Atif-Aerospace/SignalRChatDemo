using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.SignalR;

namespace SignalRChatDemo.Hubs
{
    public class ChatHub : Hub
    {
        // Message for creating single data object
        public async Task CreateDataObject(string dataObject_JsonString)
        {
            await Clients.All.SendAsync("CreateDataObject", dataObject_JsonString);
        }

        // Message for creating multiple data objects
        public async Task CreateDataObjects(string dataObjects_JsonString)
        {
            await Clients.All.SendAsync("CreateDataObjects", dataObjects_JsonString);
        }

        // Message for deleting single data object
        public async Task DeleteDataObject(string dataObject_JsonString)
        {
            await Clients.All.SendAsync("DeleteDataObject", dataObject_JsonString);
        }
        // Message for deleting multiple data objects
        public async Task DeleteDataObjects(string dataObjects_JsonString)
        {
            await Clients.All.SendAsync("DeleteDataObjects", dataObjects_JsonString);
        }





        public async Task CreateModelObject(string modelObject_JsonString)
        {
            await Clients.All.SendAsync("CreateModelObject", modelObject_JsonString);
        }

        public async Task CreateWorkflowObject(string workflowObject_JsonString)
        {
            await Clients.All.SendAsync("CreateWorkflowObject", workflowObject_JsonString);
        }

        public async Task SendMessage(string username, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", username, message);
        }

        
    }
}
