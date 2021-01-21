db = require('../data/dbConfig.js');

module.exports = {
    checkValidStart,
    checkValidEnd,
    checkGameOver,
    removeValidNodes,
    addStartNode,
    getStartNode,
    getValidNodes
}

function getValidNodes() {
    return db('dots').select('validNodes').first();
}

function addStartNode(node) {
    // Update the first record, which stores our state, with a valid starting node
    return db('dots').where({ id: 1 }).update({ startNode: node.join() })
}

function checkGameOver() {
    // Return True is validNodes is empty signifying a finished game, since there are no more valid moves
    // Otherwise, return False
    return db('dots').select('validNodes').length === 0
}

function checkValidEnd() {
    // Erase startNode
    return
}

function checkValidStart(node) {
    if (getStartNode().length === 0) {
        return false
    } else {

    }
}

function getStartNode() {
    // Return the first record of the  startNode column in the dots table
    return db('dots').where({ id: 1 }).select('startNode');
}

function removeValidNodes(nodes) {
    valids = getValidNodes();
    nodes.map(element => {
        if ()
    })
}