const path=require('path')
const http=require('http')
const express=require('express')
const socketio=require('socket.io')

const app=express()
const server=http.createServer(app)
const io=socketio(server)

const port=process.env.PORT || 3000

const publicDirectoryPath=path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))

// let count=0

// io.on('connection',(socket)=>{
//     console.log('new websocket connection')

//     socket.emit('countUpdated',count)

//     socket.on('increment',()=>{
//         count++
//         // socket.emit('countUpdated',count)
//         io.emit('countUpdated',count)
//     })
// })

io.on('connection',(socket)=>{
    console.log('new websocket connection')

    io.emit('message','welcome')

    socket.on('sendMessage',(message)=>{
        io.emit('message',message)
    })
})

server.listen(port,()=>{
    console.log(`Server up on port ${port}!`)
})

