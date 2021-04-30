import { Socket } from "socket.io";

import { io } from "../http";
import { ConnectionService } from '../services/ConnectionService'
import { UserService } from "../services/UserService";
import { MessagesService } from "../services/MessagesService";

io.on('connect', (socket: Socket) => {
  const userService = new UserService();
  const connectionService = new ConnectionService();
  const messagesService = new MessagesService();

  socket.on('client_first_access', async (params, callback) => {

    const { email, text } = params;

    const user = await userService.create({ email });
    //const previousConnection = await connectionService.findByUserId(user.id);

    const connection = await connectionService.create({
      socket_id: socket.id,
      user_id: user.id
    });

    const message = await messagesService.create({
      user_id: connection.user_id,
      text: text,
      admin_id: null
    });

    const allMessages = await messagesService.listByUser(connection.user_id);

    socket.emit('client_list_all_messages', allMessages);

    const connections = await connectionService.findAllWithoutAdmin();

    io.emit('admin_list_all_users', connections);

    callback(user);
  });

  socket.on('client_send_to_admin', async (params) => {

    console.log(JSON.stringify((params)));

    const { user_id, socket_admin_id, text } = params;

    const { email } = await userService.getById(user_id);

    const message = await messagesService.create({
      admin_id: null,
      text,
      user_id,
    });

    io.to(socket_admin_id).emit('client_send_to_admin', {
      text,
      user_id,
      email,
      created_at: message.created_at,
    });

  });
});
