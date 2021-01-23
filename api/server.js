const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const server = express();
const db = require('./dotsModel.js');
server.use(cors());
server.use(helmet());
server.use(express.urlencoded());
server.use(express.json());

// Test API server
// server.get('/', (req, res) => {
//     console.log('It worked.')
// })

server.get('/initialize', (req, res) => {
    // Reset all values in db to defaults and return starting message
    db.setDefaults();
    return res.json({ 
        "msg": "INITIALIZE",
        "body": {
            "newLine": null,
            "heading": "Player 1",
            "message": "Awaiting Player 1's Move"
        }
    })
})

server.post('/node-clicked', async (req, res) => {
    const {x, y} = req.body;
    // Check if first click
    const { firstClick } = await db.getFirstClick();
    const { ends } = await db.getEnds();
    const { startNode } = await db.getStartNode();
    // const { turn } = await db.getTurn();
    // console.log(turn)
    
    // First Click
    if (startNode.length === 0) {
        await db.toggleFirstClick();
        await db.setStartNode([x,y]);
        let player = await db.getTurn() % 2 === 0 ? 'Player 2' : 'Player 1';
        return res.json({
            "msg": "VALID_START_NODE",
            "body": {
                "newLine": null,
                "heading": player,
                "message": "Select a second node to complete the line."
            }
        })
    } 
    // Second Click
    else {
        if ([x,y].length === startNode.length && [x,y].every((value, index) => value === startNode[index]) === true) {
            // let player = await db.getTurn() % 2 === 0 ? 'Player 2' : 'Player 1';
            await db.setStartNode([]);
            await db.toggleFirstClick();
            return res.json({
                "msg": "INVALID_END_NODE",
                "body": {
                    "newLine": null,
                    "heading": player,
                    "message": "Invalid move!"
                }
            })
        } else {
            // Check end node
            if ((x === startNode[0] + 1 && y === startNode[1]) || (x === startNode[0] - 1 && y === startNode[1]) || (x === startNode[0] && y === startNode[1] + 1) || (x === startNode[0] && y === startNode[1] - 1) || (x === startNode[0] + 1 && y === startNode[1] + 1) || (x === startNode[0] - 1 && y === startNode[1] - 1)) {
                await db.toggleFirstClick();
                await db.setStartNode([]);
                await db.incrementTurn();
                let player = await db.getTurn() % 2 === 0 ? 'Player 2' : 'Player 1';
                await db.setEnds(Array([x,y], startNode));
                await db.removeFromAllNodes(Array([x,y], startNode))
                await db.setValidNodes();
                return res.json({
                    "msg": "VALID_END_NODE",
                    "body": {
                        "newLine": {
                            "start": {
                                "x": startNode[0],
                                "y": startNode[1]
                            },
                            "end": {
                                "x": x,
                                "y": y
                            }
                        },
                        "heading": player,
                        "message": "Please select a starting node."
                    }
                })
            } else {
                let player = await db.getTurn() % 2 === 0 ? 'Player 2' : 'Player 1';
                await db.setStartNode([]);
                await db.toggleFirstClick();
                return res.json({
                    "msg": "INVALID_END_NODE",
                    "body": {
                        "newLine": null,
                        "heading": player,
                        "message": "Invalid move!"
                    }
                })
            }
        }
    }
});

server.post('/error', (req, res) => {
    return res.json({
        error: req.body.error
    })
});

module.exports = server;