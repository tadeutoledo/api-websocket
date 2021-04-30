let socket = null;
let socket_admin_id = null;
let email = null;
let user_id = null;

document
  .querySelector("#start_chat")
  .addEventListener("click", (event) => {

    const chat_help = document.getElementById('chat_help');
    chat_help.style.display = 'none';

    const chat_in_support = document.getElementById('chat_in_support');
    chat_in_support.style.display = 'block';

    email = document.getElementById('email').value;
    const text = document.getElementById('txt_help').value;

    socket = io();

    socket.on('connect', () => {
      const params = {
        email,
        text
      };

      socket.emit('client_first_access', params, (call, err) => {
        user_id = call.id;
        console.log('user id ' + user_id);
      });
    })

    socket.on('client_list_all_messages', messages => {

      var template_client = document.getElementById('message-user-template').innerHTML;
      var template_admin = document.getElementById('admin-template').innerHTML;

      messages.forEach(message => {
        if (message.admin_id === null) {
          const rendered = Mustache.render(template_client, {
            message: message.text,
            email
          });

          document.getElementById('messages').innerHTML += rendered;

        } else {
          const rendered = Mustache.render(template_admin, {
            message_admin: message.text
          });

          document.getElementById('messages').innerHTML += rendered;
        }
      });
    });

    socket.on('admin_send_to_client', message => {
      console.log(message);

      socket_admin_id = message.socket_id;

      const template_admin = document.getElementById("admin-template").innerHTML;

      const rendered = Mustache.render(template_admin, {
        message_admin: message.text,
      });

      document.getElementById("messages").innerHTML += rendered;
    });
  });

document
  .querySelector('#send_message_button')
  .addEventListener('click', (evento) => {

    const text = document.getElementById('message_user');

    const params = {
      text: text.value,
      socket_admin_id,
      user_id
    };

    socket.emit('client_send_to_admin', params);

    var template_client = document.getElementById('message-user-template').innerHTML;

    const rendered = Mustache.render(template_client, {
      message: text.value,
      email
    });

    document.getElementById('messages').innerHTML += rendered;

    text.value = '';
  });
