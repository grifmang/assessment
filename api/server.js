const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const server = express();
const db = require('./dotsModel.js');
const path = require('path');
server.use(cors());
server.use(helmet());
server.use(express.urlencoded());
server.use(express.json());

// Test API server
server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/index.html'));
})

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
    const { turn } = await db.getTurn();
    let player = turn % 2 === 0 ? 'Player 2' : 'Player 1';
    console.log(turn)
    console.log(player)
    // const { turn } = await db.getTurn();
    // console.log(turn)
    
    // First Click
    if (startNode.length === 0) {
        await db.toggleFirstClick();
        await db.setStartNode([x,y]);
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
        // Check if startNode === input coords
        // Need to also check if startNode is valid with checkValidStart()
        if ([x,y].length === startNode.length && [x,y].every((value, index) => value === startNode[index]) === true) {
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
            // Conditional can be changed to checkValidEnd()
            // const isValidEnd = await db.checkValidEnd(startNode, [x,y]);
            if ((x === startNode[0] + 1 && y === startNode[1]) || (x === startNode[0] - 1 && y === startNode[1]) || (x === startNode[0] && y === startNode[1] + 1) || (x === startNode[0] && y === startNode[1] - 1) || (x === startNode[0] + 1 && y === startNode[1] + 1) || (x === startNode[0] - 1 && y === startNode[1] - 1)) {
            // if (isValidEnd === true) {
                await db.toggleFirstClick();
                await db.setStartNode([]);
                await db.incrementTurn();
                const { turn } = await db.getTurn();
                let player = turn % 2 === 0 ? 'Player 2' : 'Player 1';
                await db.setEnds(Array([x,y], startNode));
                console.log(Array([x,y], startNode))
                await db.removeFromAllNodes(Array([x,y], startNode))
                await db.setValidNodes();
                const gameOver = await db.checkGameOver();
                if (gameOver === true) {
                    return res.json({
                        "msg": "GAME_OVER",
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
                            "heading": "Game Over",
                            "message": (turn + 1) % 2 === 0 ? 'Player 2 Wins!' : 'Player 1 Wins!'
                        }
                    })
                } else {
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
                            "message": `Awaiting ${player}'s Move.`
                        }
                    })
                }
            } else {
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