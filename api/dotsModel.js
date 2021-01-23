const e = require('express');

db = require('../data/dbConfig.js');

module.exports = {
    checkValidStart,
    checkValidEnd,
    checkGameOver,
    removeFromAllNodes,
    getStartNode,
    getValidNodes,
    setValidNodes,
    setStartNode,
    getAllNodes,
    getEnds,
    setEnds,
    toggleFirstClick,
    getFirstClick,
    setDefaults,
    incrementTurn,
    getTurn
}

function getTurn() {
    return db('dots').where({ id: 1 }).select('turn').first();
}

async function incrementTurn() {
    const { turn } = await getTurn();
    return db('dots').where({ id: 1 }).update({ turn: turn + 1 });
}

async function setDefaults() {
    await db.migrate.rollback();
    await db.migrate.latest();
    await db.seed.run()
}

function getFirstClick() {
    return db('dots').where({ id: 1 }).select('firstClick').first();
}

async function toggleFirstClick() {
    let { firstClick } = await getFirstClick();
    return db('dots').where({ id: 1 }).update({ firstClick: !firstClick});
}

function getEnds() {
    return db('dots').where({ id: 1 }).select('ends').first();
}

async function setEnds(endsArray) {
    let { ends } = await getEnds();
    if (ends.length > 0) {
        ends.forEach((element, index) => {
            if (JSON.stringify(element) === JSON.stringify(endsArray[1])) {
                ends.splice(index, 1);
                ends.push(endsArray[0]);
            }  
        })
        return db('dots').where({ id: 1 }).update({ ends: ends });
    } else {
        return db('dots').where({ id: 1 }).update({ ends: endsArray });
    }
}

async function setValidNodes() {
    // Takes in the current end points and creates an array of all possible valid moves.
    // Then, we check those possibles against the known open, or valid, nodes. If they are not in the validNodes array, we remove them.
    // We then set validPossibles to the validNodes record.
    let validPossibles = []
    let { ends } = await getEnds();
    const { startNode } = await getStartNode();
    ends.map(element => {
        validPossibles.push(new Array(element[0] + 1, element[1]));
        validPossibles.push(new Array(element[0] + 1, element[1] + 1));
        validPossibles.push(new Array(element[0], element[1] + 1));
        validPossibles.push(new Array(element[0] - 1, element[1]));
        validPossibles.push(new Array(element[0], element[1] - 1));
        validPossibles.push(new Array(element[0] - 1, element[1] - 1));
    })
    const { allNodes } = await getAllNodes();
    validPossibles.map((e, i) => {
        if (!allNodes.includes(e)) {
            validPossibles.splice(i, 1);
        } 
        if (JSON.stringify(startNode) === JSON.stringify(e)) {
            validPossibles.splice(i, 1)
        }
    })
    validPossibles.forEach((vp, index) => {
        vp.map(coord => {
            if (coord < 0) {
                return validPossibles.splice(index, 1);
            }
        })
    })
    return db('dots').where({ id: 1 }).update({ validNodes: validPossibles });
}

function getAllNodes() {
    return db('dots').where({ id: 1 }).select('allNodes').first();
}

function setStartNode(node) {
    return db('dots').where({ id: 1 }).update({ startNode: node });
}

function getValidNodes() {
    return db('dots').where({ id: 1 }).select('validNodes').first();
}

function checkGameOver() {
    // Return True is validNodes is empty signifying a finished game, since there are no more valid moves
    // Otherwise, return False
    return db('dots').where({ id: 1 }).select('validNodes').length === 0
}

async function checkValidEnd(startNode, endNode) {
    // Check if node is a valid end node
    // Return true if node is valid end node
    const { validNodes } = await getValidNodes();
    if (endNode === startNode) {
        return false
    } else if (validNodes.includes(endNode) === false) {
        return false
    } else {
        return true
    }
}

async function checkValidStart(node) {
    // Check if node is a valid start node
    // Takes in a node array ex: [1,2]
    const { validNodes } = await getValidNodes();
    for (let i=0; i<validNodes.length; i++) {
        if (node === validNodes[i]) {
            return true
        }
    }
    return false
}

function getStartNode() {
    // Return the first record of the  startNode column in the dots table
    return db('dots').where({ id: 1 }).select('startNode').first();
}

async function removeFromAllNodes(nodes) {
    // Remove nodes after they were selected.
    let { allNodes } = await getAllNodes();
    nodes.map(element => {
        allNodes.map((e, i) => {
            if (JSON.stringify(element) === JSON.stringify(e)) {
                allNodes.splice(i, 1)
            }  
        })
    })
    return db('dots').where({ id: 1 }).update({ allNodes: allNodes });
}