const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const server = express();
// const db = require('./dotsModel.js');
const path = require('path');
server.use(cors());
const utils = require('./utils.js');
server.use(helmet());
server.use(express.urlencoded());
server.use(express.json());

// Change state from PG to initialState
initialState = {}

// Test API server
server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/index.html'));
})

server.get('/initialize', (req, res) => {
    // Reset all values in state to defaults and return starting message
    initialState = utils.setDefaults(initialState);
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
    let firstClick = initialState.firstClick
    let ends = initialState.ends
    let startNode = initialState.startNode
    let turn = initialState.turn
    let player = turn % 2 === 0 ? 'Player 2' : 'Player 1';
    
    // First Click
    if (startNode.length === 0) {
        initialState = {
            ...initialState, 
            firstClick: !initialState.firstClick,
            startNode: [x,y]
        }
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
            initialState = {
                ...initialState,
                startNode: [],
                firstClick: !initialState.firstClick
            }
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
            // End node can be more than one node away as long as it doesn't intersect
            // and is a valid node

            // This needs to be changed to a function. Function needs to adhere to above rules
            if ((x === startNode[0] + 1 && y === startNode[1]) || (x === startNode[0] - 1 && y === startNode[1]) || (x === startNode[0] && y === startNode[1] + 1) || (x === startNode[0] && y === startNode[1] - 1) || (x === startNode[0] + 1 && y === startNode[1] + 1) || (x === startNode[0] - 1 && y === startNode[1] - 1)) {
                initialState = {
                    ...initialState,
                    firstClick: !initialState.firstClick,
                    startNode: [],
                    turn: initialState.turn + 1,
                    ends: utils.setEnds(Array([x,y], startNode), initialState.ends),
                    allNodes: utils.removeFromAllNodes(Array([x,y], startNode), initialState.allNodes)
                }
                let turn = initialState.turn
                let player = turn % 2 === 0 ? 'Player 2' : 'Player 1';
                initialState = {
                    ...initialState,
                    validNodes: utils.setValidNodes(initialState.ends, initialState.allNodes)
                }
                console.log(initialState)
                const gameOver = initialState.validNodes.length === 0;
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
                initialState = {
                    ...initialState,
                    firstClick: !initialState.firstClick,
                    startNode: []
                }
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