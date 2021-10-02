const express = require('express');
const app = express();
const cors = require('cors');
const server = require('http').Server(app);
const io = require('socket.io')(server)
const { v4: uuidv4 } = require('uuid');
const {RtcTokenBuilder, RtcRole} = require('agora-access-token');
const appID = '';
const appCertificate = '';
// const { ExpressPeerServer } = require('peer');
// const peerServer = ExpressPeerServer(server, {
//     debug: true,
// });

let thankyou = require('./routes/thankyou');

// app.use('/peerjs', peerServer);
app.use(express.static('public'))

app.set('view engine', 'ejs');

app.use('/thankyou', thankyou);
// io.listen(8080);
let djs = []; // party admin's userId

app.use(cors());

app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`);
})

app.get('/:room', (req, res) => {
    res.render('room', {roomId: req.params.room})
})

// peerServer.on('connection', function (client) {
//     console.log('peer with ', client.id, 'connected');
// });
// peerServer.on('disconnect', (client) => { 
//     console.log('peer ', client.id,  'disconnected');
//     var index = djs.findIndex(p => p.user == client.id);
//     if (index >= 0) {
//         djs.splice(index, 1);
//     }
// });

io.on('connection', socket => {
    // socket.on('disconnect', () => {
    //     dj = "";
    //     console.log('dj disconnect', dj);
    // })
    socket.on('channelName', room_ID => {
        // agora token server =====================================
        console.log('channelName ', room_ID);
        const channelName = room_ID;
        const uid = 0;
        const role = RtcRole.SUBSCRIBER;

        const expirationTimeInSeconds = 3600
        const currentTimestamp = Math.floor(Date.now() / 1000)
        const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds

        // Build token with uid
        const tokenA = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, role, privilegeExpiredTs);
        console.log("Token With Integer Number Uid: " + tokenA);
        socket.emit('token', tokenA);
        // ===========================================================
    });

    console.log('socket connection established', socket.connected);
    // console.log('socket disconnected', socket.disconnected);
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId); //passes room id 
        // Al other commands after roomId is joined to socket!
        console.log('user joined room', userId)
        let dj = djs.find( (p) => p.room === roomId );
        console.log('dj is', dj);
        if (!dj) {
            dj = {};
            dj.room = roomId;
            dj.user = userId;
            djs.push(dj);
            socket.emit('dj', userId); 
            // io.to(roomId).emit('dj', userId)
            // socket.to(roomId).broadcast.to(userId).emit('dj', userId);
            console.log('dj added ', djs);    
        } else {
            socket.emit('dj', dj.user); 
            // io.to(roomId).emit('dj', dj.user)
            console.log('dj name sent ', djs);
        }

        // socket.to(roomId).broadcast.emit('user-connected', userId); //broadcast 'user-connected'
        // socket.on('prevPeer', prevPeerId => {
        //     const peerObj = {
        //         "prevPeerId": prevPeerId,
        //         "dj": dj.user
        //     }
        //     console.log('peerObj emitted', peerObj);
        //     socket.to(roomId).broadcast.to(userId).emit('peerObj', peerObj);
        // })

        socket.on('message', message => {  // socket.on receives the message 
            io.to(roomId).emit('createMessage', message) 
        });
        socket.on('winner', winnerName => {
            console.log('winner name is (from server) ', winnerName);
            io.to(roomId).emit('winnerName', winnerName)
        });
        socket.on('partyStatus', partyStatus => {
            console.log('dance party status', partyStatus);
            socket.to(roomId).emit('danceStatus', partyStatus);
        })
    })
})

server.listen(process.env.PORT || 3030);
