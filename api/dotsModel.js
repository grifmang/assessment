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
    // Then, we check those possibles against the known open or valid nodes. If they are not in the validNodes array, we remove them.
    // We then set validPossibles to the validNodes record.
    let validPossibles = []
    let { ends } = await getEnds();
    ends.map(element => {
        validPossibles.push(new Array(element[0] + 1, element[1]));
        validPossibles.push(new Array(element[0] + 1, element[1] + 1));
        validPossibles.push(new Array(element[0], element[1] + 1));
        validPossibles.push(new Array(element[0] - 1, element[1]));
        validPossibles.push(new Array(element[0], element[1] - 1));
        validPossibles.push(new Array(element[0] - 1, element[1] - 1));
        validPossibles.push(new Array(element[0] + 1, element[1] - 1));
        validPossibles.push(new Array(element[0] - 1, element[1] + 1));
    })
    // Remove arrays from validPossibles that do not match an array in allNodes
    const { allNodes } = await getAllNodes();
    validPossibles.map((element, index) => {
        let equals = false;
        for (let i=0; i<allNodes.length; i++) {
            if (JSON.stringify(element) === JSON.stringify(allNodes[i])) {
                equals = true;
                break;
            }
        }
        if (!equals) {
            validPossibles.splice(index, 1);
        }
    })
    // Remove arrays from validPossibles that match an array in ends
    validPossibles.map((e,i) => {
        if (e.length === ends[0].length && e.every((value, index) => value === ends[0][index]) === true) {
        validPossibles.splice(i, 1);
        } else if (e.length === ends[1].length && e.every((value, index) => value === ends[1][index]) === true) {
        validPossibles.splice(i, 1); 
        }
    })
    // Remove coords with negative values
    let ind=0;
    while (ind < validPossibles.length) {
      if (validPossibles[ind][0] < 0 || validPossibles[ind][1] < 0 ) {
        validPossibles.splice(ind, 1);
      } else {
        ind += 1;
      }
    }
    // Remove duplicates from validPossible
    let uniques = Array.from((new Map(validPossibles.map(arr => [arr.join(), arr]))).values());

    return db('dots').where({ id: 1 }).update({ validNodes: uniques });
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
    if (JSON.stringify(endNode) === JSON.stringify(startNode)) {
        return false
    }
    let possibleValids = []
    possibleValids.push(new Array(startNode[0] + 1, startNode[1]));
    possibleValids.push(new Array(startNode[0] + 1, startNode[1] + 1));
    possibleValids.push(new Array(startNode[0], startNode[1] + 1));
    possibleValids.push(new Array(startNode[0] - 1, startNode[1]));
    possibleValids.push(new Array(startNode[0], startNode[1] - 1));
    possibleValids.push(new Array(startNode[0] - 1, startNode[1] - 1));
    possibleValids.push(new Array(startNode[0] + 1, startNode[1] - 1));
    possibleValids.push(new Array(startNode[0] - 1, startNode[1] + 1));
    // Remove arrays from validPossibles that do not match an array in allNodes
    const { allNodes } = await getAllNodes();
    validNodes.map((element, index) => {
        let equals = false;
        for (let i=0; i<allNodes.length; i++) {
            if (JSON.stringify(element) === JSON.stringify(allNodes[i])) {
                equals = true;
                break;
            }
        }
        if (!equals) {
            validNodes.splice(index, 1);
        }
    })
    // Remove array from possibleValids 
    possibleValids.map((element, index) => {
        validNodes.map(e => {
            if (JSON.stringify(element) === JSON.stringify(e)) {
                possibleValids.splice(index, 1);
            }
        })
    })
        return false
    // }
    // return true
    
}

async function checkValidStart(node) {
    // Check if node is a valid start node
    // Takes in a node array ex: [1,2]
    const { validNodes } = await getValidNodes();
    for (let i=0; i<validNodes.length; i++) {
        if (JSON.stringify(node) === JSON.stringify(validNodes[i])) {
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