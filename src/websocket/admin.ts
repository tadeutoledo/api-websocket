import { Socket } from "socket.io";

import { io } from "../http";
import { ConnectionService } from '../services/ConnectionService'
import { UserService } from "../services/UserService";
import { MessagesService } from "../services/MessagesService";

io.on('connect', async (socket) => {
  const userService = new UserService();
  const connectionService = new ConnectionService();
  const messagesService = new MessagesService();

  const allConnectionsWithoutAdmin = await connectionService.findAllWithoutAdmin();

  io.emit('admin_list_all_users', allConnectionsWithoutAdmin);

  socket.on('admin_start_chat', (params) => {
    const { user_id, socket_id } = params;

    connectionService.updateAdminSocketId({ user_id, socket_id, admin_id: socket.id });
  });

  socket.on('admin_list_messages_by_user', async (params, callback) => {

    const { user_id } = params;

    const allMessages = await messagesService.listByUser(user_id);

    callback(allMessages);
  });

  socket.on('admin_send_message', async (params) => {

    const { user_id, text } = params;

    const message = await messagesService.create({
      admin_id: socket.id,
      text,
      user_id,
    });

    const { socket_id } = await connectionService.findByUserId(user_id);

    io.to(socket_id).emit('admin_send_to_client', {
      text,
      socket_id: socket.id
    });

  });
});