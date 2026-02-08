using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Distributed;
using SignalR.Back.Models;

namespace SignalR.Back.Hubs;

public interface IChatClient
{
    public Task ReceiveMessage(string userName, string message);
}

/// <summary>
/// === точка входа для сообщений ===
///
/// Что он делает?
///     • принимает вызовы от клиента
///         клиент (js/C#) может вызывать методы хаба как обычные функции.
/// 
///     • отправляет сообщения клиентам Сервер через Хаб может:
///         • отправить сообщение всем
///         • конкретному клиенту
///         • группе клиентов
/// </summary>
public class ChatHub : Hub<IChatClient>
{
    private readonly IDistributedCache _cache;

    public ChatHub(IDistributedCache distributedCache)
    {
        _cache = distributedCache;
    }

    public async Task JoinChat(UserConnection connection)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, connection.ChatRoom);

        var stringConnection = JsonSerializer.Serialize(connection);

        await _cache.SetStringAsync(Context.ConnectionId, stringConnection);

        await Clients.Group(connection.ChatRoom)
            .ReceiveMessage("Admin", $"{connection.UserName} присоединился к чату!");
    }

    public async Task SendMessage(string message)
    {
        var connection = await GetConnection(Context.ConnectionId);
        
        if (connection is not null)
            await Clients.Group(connection.ChatRoom).ReceiveMessage(connection.UserName, message);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var connection = await GetConnection(Context.ConnectionId);

        if (connection is not null)
        {
            await _cache.RemoveAsync(Context.ConnectionId);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, connection.ChatRoom);
            
            await Clients.Group(connection.ChatRoom)
                .ReceiveMessage("Admin", $"{connection.UserName} вышел из чата...");
        }
    }

    private async Task<UserConnection?> GetConnection(string connectionId)
    {
        var stringConnection = await _cache.GetAsync(Context.ConnectionId);
        return JsonSerializer.Deserialize<UserConnection>(stringConnection);
    }

}