$(function() {
    const socket = io.connect()

    const formElem = $('form');
    const textareaElem = $('textarea');
    const nameElem = $('input');
    const colorElem = $('select');
    const messagesElem = $('#messages');

    function publishMessage(data) {
        return (
            `<li class='list-group-item  bg-${data.color}'>
                <b><i class='message-text'>Имя:</i> ${data.name}</b>
                <br/>
                <span><i class='message-text'>Сообщение:</i> ${data.text}</span>
            </li>`
        )
    }

    formElem.on('submit', function(e) {
        e.preventDefault();
        const text = textareaElem.val();
        const name = nameElem.val();
        const color = colorElem.val();

        socket.emit('send_message', {text, name, color});
        textareaElem.val('');
    });

    socket.on('send_all_messages', (messages) => {
        console.log('send_all_messages')
        console.log(messages, 'messages')
        let messagesList = '';
        messages.forEach(item => {
            messagesList += publishMessage(item)
        })

        messagesElem.append(messagesList)
    })


    socket.on('add_message', (data) => {
        messagesElem.append(publishMessage(data))
    })
})