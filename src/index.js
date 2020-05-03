const path=require('path')
const http=require('http')
const express=require('express')
const socketio=require('socket.io')
const Filter=require('bad-words')
const {generateMessage}=require('./utils/messages')
const {generateLocationMessage}=require('./utils/messages')

const app=express()
const server=http.createServer(app)
const io=socketio(server)

const port=process.env.PORT || 3000

const publicDirectoryPath=path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))

io.on('connection',(socket)=>{
    console.log('new websocket connection')

    socket.on('join',({username, room})=>{
        socket.join(room)

        socket.emit('message',generateMessage('Welcome!'))
        socket.broadcast.to(room).emit('message',generateMessage(`Someone new is here! Welcome ${username}`))    
    })

    socket.on('sendMessage',(message,callback)=>{
        const filter=new Filter()
        if(filter.isProfane(message)){
            return callback('profanity is not allowed')
        }
        io.to('1').emit('message',generateMessage(message))
        callback('Delivered')
    })

    socket.on('sendLocation',(coords,callback)=>{
        io.emit('locationMessage',generateLocationMessage(`https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect',()=>{
        io.emit('message',generateMessage('Someone left :('))
    })
})

server.listen(port,()=>{
    console.log(`Server up on port ${port}!`)
})

