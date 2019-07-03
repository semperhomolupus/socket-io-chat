$(function() {
    

    const formElem = $('form');
    const textareaElem = $('textarea');
    const nameElem = $('input');
    const messagesElem = $('#messages');

    const userID = +window.localStorage.getItem('chat-user-id');
    let userName;
    let userSurname;
    let socket;

    if (userID) {
        socket = io.connect('http://localhost:3000?userID=' + userID);
        userName = window.localStorage.getItem('chat-user-name');
        userSurname = window.localStorage.getItem('chat-user-surname');

        nameElem.val(userName + ' ' + userSurname)
    } else {
        messagesElem.append(
            `<h5 class="mb-4">Для продолжения авторизуйтесь через вк</h5>
            <button type="button" id="login" class="btn btn-success">Авторизоваться</button>`
        )

        $('body').on('click', '#login', function() {
            VK.Auth.login((res) => {
                window.localStorage.setItem('chat-user-id', res.session.user.id);
                window.localStorage.setItem('chat-user-name', res.session.user.first_name);
                window.localStorage.setItem('chat-user-surname', res.session.user.last_name);
                setTimeout(() => {window.location.reload()}, 100);
            })
        });
    }
    
    function publishMessage(data) {


        return (
            `<li class='list-group-item bg-light text-primary'>
                <b><i class='message-text'>Имя:</i> ${data.name}</b>
                <br/>
                <span><i class='message-text'>Сообщение:</i> ${data.text}</span>
            </li>`
        )
    }

    formElem.on('submit', function(e) {
        e.preventDefault();

        if (userID) {
            const text = textareaElem.val();
            const name = nameElem.val();
    
            socket.emit('send_message', {text, name});
            textareaElem.val('');
        } else {
            alert('какая-то шляпа')
        }
        
    });

    socket.on('send_all_messages', (messages) => {
        console.log('send_all_messages')
        console.log(messages, 'messages')
        let messagesList = '';

        if (messages.length > 0) {
            messages.forEach(item => {
                messagesList += publishMessage(item)
            })
        } else {
            messagesList = '<h5 class="mt-3 mb-3">Новых сообщений нет :(</h5>'
        }
        
        messagesElem.append(messagesList)
    })


    socket.on('add_message', (data) => {
        messagesElem.append(publishMessage(data))
    })



    
   
})