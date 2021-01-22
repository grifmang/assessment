db = require('../data/dbConfig.js');

module.exports = {
    checkValidStart,
    checkValidEnd,
    checkGameOver,
    removeFromAllNodes,
    addStartNode,
    getStartNode,
    getValidNodes,
    setValidNodes,
    setStartNode,
    getAllNodes
}

function setValidNodes() {
    
}

function getAllNodes() {
    return db('dots').select('allNodes').first();
}

function setStartNode(node) {
    return db('dots').where({ id: 1 }).update({ startNode: node });
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

async function checkValidEnd(node) {
    // Check if node is a valid end node
    // Return true if node is valid end node
    start = await getStartNode().split(',');
    valids = await getValidNodes().split(',');
    if (node === startNode) {
        return false
    } else if (valids.includes(node) === false) {
        return false
    } else {
        return true
    }
}

async function checkValidStart(node) {
    // Check if node is a valid start node
    // Takes in a node array ex: [1,2]
    valids = await getValidNodes().split(',');
    for (let i=0; i<valids.length; i++) {
        if (node === valids[i]) {
            return true
        }
    }
    return false
}

function getStartNode() {
    // Return the first record of the  startNode column in the dots table
    return db('dots').where({ id: 1 }).select('startNode').first();
}

function removeFromAllNodes(nodes) {
    // Remove nodes after they were selected.
    valids = getAllNodes().split(',');
    nodes.map((element, index) => {
        if (valids.includes(element)) {
            valids.pop(index);
        }
    })
    return db('dots').where({ id: 1 }).update({ allNodes: valids.join() });
}