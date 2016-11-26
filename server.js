const express = require('express');
const socket = require('socket.io');
const AsyncPolling = require('async-polling');
const request  = require('request');
const config = require('./config.json');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

const server = app.listen(port, () => {
    console.log(`pi-clock is istening on port ${port}`);
});

const io = socket.listen(server);

io.sockets.on('connection', socket => {
    console.log(`web socket opened`);
});

var polling = AsyncPolling(end => {
    const apiUri = "https://www.la1tv.co.uk/api/v1/";
    const options = {
        url: `${apiUri}mediaItems?sortMode=SCHEDULED_PUBLISH_TIME&sortDirection=DESC&streamIncludeSetting=HAS_LIVE_STREAM&limit=10`,
        headers: {
            'X-Api-Key': config.la1ApiKey
        }
    };

    request(options, (error, response, body) => {      
        if (error || response.statusCode !== 200) {
            // hopefully a request will succeed soon.
            console.warn("API request error.");
            end();
        }
        
        try {
            const mediaItems = JSON.parse(body).data.mediaItems;

            if(mediaItems.length <= 0) {
                console.info('Nothing Currently Live.');

                io.sockets.emit('live:status', {live: false });
            } else {
                const showName = mediaItems[0].name;
                console.info(`Currently live with ${showName}`);

                io.sockets.emit('live:status', {live: true, name: showName});
            }
        }
        finally {    
            end();
        }
    })

}, 3000);

polling.run();

