const ws = require('ws')

const wss = new ws.Server({
    port: 5000
}, () => { console.log('server started on port 5000') })

wss.on('connection', (ws) => {
    console.log("Пользователь подключился")
    ws.on('message', (data) => {
        try {

            const dataObj = JSON.parse(data)

            switch (dataObj.event) {
                case 'message':
                    broadcastingMess(dataObj)
                    break;
                case 'connection':
                    broadcastingMess(dataObj)
                    break;

            }
        } catch (error) {

            console.error('❌ Ошибка парсинга JSON:', error);
        }
    })
})

function broadcastingMess(message) {
    wss.clients.forEach((client) => {
        try {
            client.send(JSON.stringify(message))
        } catch (error) {
            console.error('❌ Ошибка парсинга JSON:', error);
        }
    })
}