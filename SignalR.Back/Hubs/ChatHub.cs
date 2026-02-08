using System.Text.RegularExpressions;
using Microsoft.AspNetCore.SignalR;
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
    public override Task OnConnectedAsync()
    {
        return base.OnConnectedAsync();
    }

    public async Task JoinChat(UserConnection connection)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, connection.ChatRoom);

        await Clients.Group(connection.ChatRoom).ReceiveMessage("Admin", $"{connection.UserName} присоединился к чату!");
    }
}