module.exports = {
    setDefaults,
    setEnds,
    removeFromAllNodes,
    setValidNodes,
    setVisited,
    checkEnds,
    checkHorizMulti,
    checkVertMulti,
    checkVisited,
    checkGameOver,
    checkDistance,
    checkValid
}

function checkValid(validNodes, node) {
    let equals = false;
    for (const [key, value] of Object.entries(validNodes)) {
        value.map(element => {
            if (JSON.stringify(node) === JSON.stringify(element)) {
                equals = true;
            }
        })
    }
    return equals;
}

function allNodes() {
    let nodes = [];
    for (let i=0; i<4; i++) {
      for (let j=0; j<4; j++) {
        nodes.push(Array(i, j));
      }
    }
    return nodes;
  }

function setDefaults() {
    // validNodes is going to have to be altered to hashtable to reflect both nodes instead of one array with all valid nodes
    return {
        firstClick: true,
        turn: 1,
        allNodes: allNodes(),
        validNodes: [],
        ends: [],
        startNode: [],
        visitedNodes: []
    }
}

function removeFromAllNodes(nodes, allNodes, visitedNodes) {
    // Remove nodes after they were selected.
    nodes.map(element => {
        allNodes.map((e, i) => {
            if (JSON.stringify(element) === JSON.stringify(e)) {
                allNodes.splice(i, 1)
            }  
        })
    })
    return allNodes;
}

function checkDiagMulti(end) {
    // return all possible diagonals from end node
    const possibles = [];
    const checkNode = node => {
        let invalid = false;
        node.forEach(element => {
            if (element > 3 || element < 0) {
                invalid = true;
            }
        })
        return invalid;
    }
    // This could probably be one function for a drier approach
    for (let i=0; i<4; i++) {
        if (i===0) {
            let curr = end;
            while (!checkNode(curr)) {
                possibles.push(curr)
                curr = [curr[0] - 1, curr[1] - 1]
            }
        } else if (i===1) {
            let curr = end;
            while (!checkNode(curr)) {
                possibles.push(curr)
                curr = [curr[0] + 1, curr[1] - 1]
            }
        } else if (i===2) {
            let curr = end;
            while (!checkNode(curr)) {
                possibles.push(curr)
                curr = [curr[0] - 1, curr[1] + 1]
            }
        } else {
            let curr = end;
            while (!checkNode(curr)) {
                possibles.push(curr)
                curr = [curr[0] + 1, curr[1] + 1]
            }
        }
    }
    return possibles;
}

function checkVertMulti(end) {
    let verticals = [];
    for (let i=0; i<4; i++) {
        if (end[0] !== i) {
            verticals.push(Array(i, end[1]));
        }
    }
    return verticals;
}

function checkHorizMulti(end) {
    let horizontals = []
    for (let i=0; i<4; i++) {
        if (i !== end[1]) {
            horizontals.push(Array(end[0], i));
        }
    }
    return horizontals;
}

function setValidNodes(ends, allNodes, visited, startNode) {
    // Takes in the current end points and creates an array of all possible valid moves.
    // Then, we check those possibles against the known open or valid nodes. If they are not in the validNodes array, we remove them.
    // We then set validPossibles to the validNodes record.
    if (ends.length === 0) {
        ends = Array(startNode);
    }
    let validPossiblesObject = {}
    // add all one node possibles to validPossibles based on the ends
    ends.map(element => {
        let validPossibles = []
        checkHorizMulti(element).forEach(e => {
            validPossibles.push(e)
        });
        checkVertMulti(element).forEach(e => {
            validPossibles.push(e)
        });
        checkDiagMulti(element).forEach(e => {
            validPossibles.push(e)
        });
        
        validPossiblesObject[JSON.stringify(element)] = validPossibles
    })
    // Remove arrays from validPossibles that do not match an array in allNodes
    for (const [key, value] of Object.entries(validPossiblesObject)) {
        value.map((element, index) => {
            let equals = false;
            for (let i=0; i<allNodes.length; i++) {
                if (JSON.stringify(element) === JSON.stringify(allNodes[i])) {
                    equals = true;
                    break;
                }
            }
            if (!equals) {
                value.splice(index, 1);
            }
        })
    }
    // Remove arrays from validPossibles that match an array in ends
    for (const [key, value] of Object.entries(validPossiblesObject)) {
        value.map((e,i) => {
            if (ends[0] && e.length === ends[0].length && e.every((value, index) => value === ends[0][index]) === true) {
            value.splice(i, 1);
            } else if (ends[1] && e.length === ends[1].length && e.every((value, index) => value === ends[1][index]) === true) {
            value.splice(i, 1); 
            }
        })
    }
    // Remove coords with negative values and values > 3
    for (const [key, value] of Object.entries(validPossiblesObject)) {
        let ind=0;
        while (ind < value.length) {
        if (value[ind][0] < 0 || value[ind][1] < 0  || value[ind][0] > 3 || value[ind][1] > 3) {
            value.splice(ind, 1);
        } else {
            ind += 1;
        }
        }
    }
    // Remove duplicates from validPossible
    for (const [key, value] of Object.entries(validPossiblesObject)) {
        let uniques = Array.from((new Map(value.map(arr => [arr.join(), arr]))).values());

        // Remove nodes from uniques that exist in visited
        uniques.forEach((node, index) => {
            if (checkVisited(visited, node)) {
                uniques.splice(index, 1);
            }
        })
        validPossiblesObject[key] = uniques;
    }
    return validPossiblesObject;
}

function checkVisited(visited, node) {
    let equals = false;
    visited.forEach(e => {
        if (JSON.stringify(node) === JSON.stringify(e)) {
            equals = true;
        }
    })
    return equals;
}

function checkEnds(ends, node) {
    let equals = false;
    ends.forEach(end => {
        if (JSON.stringify(end) === JSON.stringify(node)) {
            equals = true;
        }
    })
    return equals;
}

function setVisited(visited, nodes) {
    if (visited.length === 0) {
        return nodes
    } else {
        let equals;
        nodes.forEach(node => {
            equals = false;
            visited.forEach(vn => {
                if (JSON.stringify(vn) === JSON.stringify(node)) {
                    equals = true;
                }
            })
            if (!equals) {
                visited.push(node);       
            }
        })
        return visited;
    }
}

function setEnds(endsArray, ends) {
    if (ends.length > 0) {
        ends.forEach((element, index) => {
            if (JSON.stringify(element) === JSON.stringify(endsArray[1])) {
                ends.splice(index, 1);
                ends.push(endsArray[0]);
            }  
        })
        return ends;
    } else {
        return endsArray;
    }
}

function checkGameOver(valid, visited) {
    for (const [key, value] of Object.entries(valid)) {
        count = 0;
        value.forEach(vn => {
            visited.forEach(visNode => {
                if (JSON.stringify(vn) === JSON.stringify(visNode)) {
                    count += 1;
                }
            })
        })
        if (count === value.length) {
            return true;
        } else {
            return false;
        }
    }
}

function checkDistance(startNode, endNode) {
    let returnNodes = [];
    const sum = node => {
        return node.reduce((first, second) => first + second, 0);
    }
    let zero = Math.max(startNode[0], endNode[0]) - Math.min(startNode[0], endNode[0]);
    let one = Math.max(startNode[1], endNode[1]) - Math.min(startNode[1], endNode[1]);
    if (zero > 1 && one > 1) {
        // diagonal
        if (endNode[0] > 1 && endNode[1] > 1) {
            // example [2,2]
            for (x=startNode[0]+1, y=startNode[1]+1; x<endNode[0],y<endNode[1]; x++, y++) {
                returnNodes.push([x, y]);
            }
        } else if (endNode[0] < 1 && endNode[1] < 1) {
            // example [0,0]
            for (x=endNode[0]+1, y=endNode[1]+1; x<startNode[0],y<startNode[1]; x++, y++) {
                returnNodes.push([x, y]);
            }
        } else if (endNode[0] > 1) {
            // example [2,0]
            for (x=startNode[0]-1, y=startNode[1]+1; x<endNode[0],y<endNode[1]; x--, y++) {
                returnNodes.push([x, y]);
            }
        } else if (endNode[1] > 1) {
            // example [0,2]
            for (x=startNode[0]+1, y=startNode[1]-1; x<endNode[0],y<endNode[1]; x++, y--) {
                returnNodes.push([x, y]);
            }
        }
    }
    if (zero > 1 && one <= 1) {
        // horizontal
        const high = Math.max(sum(startNode), sum(endNode));
        if (sum(startNode) === high) {
            // startNode is higher
            for (let i=endNode[0]+1; i<startNode[0]; i++) {
                returnNodes.push([i, endNode[1]]);
            }
        } else {
            // endNode is higher
            for (let i=startNode[0]+1; i<endNode[0]; i++) {
                returnNodes.push([i, endNode[1]]);
            }
        }
    }
    if (one > 1 && zero <= 1) {
        // vertical
        const high = Math.max(sum(startNode), sum(endNode));
        if (sum(startNode) === high) {
            // startNode is higher
            for (let i=endNode[1]+1; i<startNode[1]; i++) {
                returnNodes.push([endNode[0], i]);
            }
        } else {
            // endNode is higher
            for (let i=startNode[1]+1; i<endNode[1]; i++) {
                returnNodes.push([endNode[0], i]);
            }
        }
    }
    return returnNodes;
}