const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const server = express();
const path = require('path');
const utils = require('./utils.js');
server.use(cors());
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
    initialState = utils.setDefaults();
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
    console.log('valid', initialState.validNodes)
    const {x,y} = req.body;
    let startNode = initialState.startNode
    let ends = initialState.ends
    let player = initialState.turn % 2 === 0 ? 'Player 2' : 'Player 1';
    let checkVisited = utils.checkVisited(initialState.visitedNodes, [x,y]);

    // If startNode length is 0
        // If ends length > 0
            // update firstClick and startNode
            // return VALID START NODE

    // First Click
    if (startNode.length === 0) {
        if (ends.length === 0) {
            // also set valid nodes to test against end node click
            initialState = {
                ...initialState, 
                firstClick: !initialState.firstClick,
                startNode: [x,y],
                validNodes: utils.setValidNodes(initialState.ends, initialState.allNodes, initialState.visitedNodes, [x,y])
            }
            console.log('first')
            console.log(initialState)
            return res.json({
                "msg": "VALID_START_NODE",
                "body": {
                    "newLine": null,
                    "heading": player,
                    "message": "Select a second node to complete the line."
                }
            })

        // ends exists
            // If node is in visitedNodes
                // return INVALID START NODE
            // if node in ends
                // return VALID START NODE
            // node not in ends
                // return INVALID START NODE
        } else {
            const checkEnds = utils.checkEnds(initialState.ends, [x, y])
            if (!checkEnds) {
                return res.json({
                    "msg": "INVALID_START_NODE",
                    "body": {
                        "newLine": null,
                        "heading": player,
                        "message": "You must start on either end of the path."
                    }
                })
            } else {
                const checkEnds = utils.checkEnds(ends, [x,y]);
                if (checkEnds) {
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
                } else {
                    return res.json({
                        "msg": "INVALID_START_NODE",
                        "body": {
                            "newLine": null,
                            "heading": player,
                            "message": "You must start on either end of the path."
                        }
                    })
                }
            }
        }
    } else {
        // Second Click   
        // Else, this will constitute a second click
            // if startNode === clickedNode
                // reset startNode and firstClick
                // return INVALID END NODE
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
                    "message": "Invalid move, can't choose starting node as end node!"
                }
            })
        } else {
            // startNode !== clickedNode
            // if clickedNode in ends or in visited
            const checkEnds = utils.checkEnds(ends, [x,y]);
            const checkValid = utils.checkValid(initialState.validNodes, [x,y]);
            if (checkEnds || checkVisited || !checkValid) {
                initialState = {
                    ...initialState,
                    startNode: [],
                    firstClick: !initialState.firstClick
                }
                // return INVALID END NODE
                return res.json({
                    "msg": "INVALID_END_NODE",
                    "body": {
                        "newLine": null,
                        "heading": player,
                        "message": "Invalid move!"
                    }
                })
            } else {
                // valid end node
                // check if end node is more than one spot from startNode
                const checkDistance = utils.checkDistance(startNode, [x,y]);
                // set end nodes and visitedNodes
                // remove both nodes from allNodes
                initialState = {
                    ...initialState,
                    firstClick: !initialState.firstClick,
                    startNode: [],
                    turn: initialState.turn + 1,
                    ends: utils.setEnds(Array([x,y], startNode), initialState.ends),
                    allNodes: utils.removeFromAllNodes(Array([x,y], startNode, ...checkDistance), initialState.allNodes),
                    visitedNodes: utils.setVisited(initialState.visitedNodes, [[x,y], startNode, ...checkDistance])
                }
                let turn = initialState.turn
                let player = turn % 2 === 0 ? 'Player 2' : 'Player 1';
                // set validNodes
                initialState = {
                    ...initialState,
                    validNodes: utils.setValidNodes(initialState.ends, initialState.allNodes, initialState.visitedNodes, startNode)
                }
                console.log(initialState)
                // if gameOver (no more validNodes)
                    // return GAME OVER
                // const gameOver = initialState.validNodes.length === 0;
                const gameOver = utils.checkGameOver(initialState.validNodes, initialState.visitedNodes);
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
                    // not gameOver
                        // return VALID END NODE
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
            }
        }
    }
})

server.post('/error', (req, res) => {
    return res.json({
        error: req.body.error
    })
});

module.exports = server;