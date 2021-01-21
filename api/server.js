const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const server = express();

server.use(cors());
server.use(helmet());
server.use(express.urlencoded());
server.use(express.json());

server.get('/', (req, res) => {
    console.log('It worked.')
})

server.get('/initialize', (req, res) => {

    return res.json({ 
        "msg": "INITIALIZE",
            "body": {
                "newLine": null,
                "heading": "Player 1",
                "message": "Awaiting Player 1's Move"
            }
    })
})

server.post('/node-clicked', (req, res) => {
    console.log(req.body)
    // return res.status(200).json({
    //         msg: "VALID_START_NODE",
    //         body: {
    //             newLine: null,
    //             heading: "Player 2",
    //             message: "Select a second node to complete the line."
    //         }
    //     })
})

module.exports = server;