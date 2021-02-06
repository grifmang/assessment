const e = require("express");

module.exports = {
    setDefaults,
    setEnds,
    removeFromAllNodes,
    setValidNodes,
    setVisited,
    checkEnds,
    checkHorizMulti,
    checkVertMulti,
    checkVisited
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

function removeFromAllNodes(nodes, allNodes) {
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

// function checkDiagMulti(end) {

// }

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

function setValidNodes(ends, allNodes) {
    // Takes in the current end points and creates an array of all possible valid moves.
    // Then, we check those possibles against the known open or valid nodes. If they are not in the validNodes array, we remove them.
    // We then set validPossibles to the validNodes record.
    let validPossibles = []
    // add all one node possibles to validPossibles based on the ends
    ends.map(element => {
        validPossibles.push(new Array(element[0] + 1, element[1]));
        validPossibles.push(new Array(element[0] + 1, element[1] + 1));
        validPossibles.push(new Array(element[0], element[1] + 1));
        validPossibles.push(new Array(element[0] - 1, element[1]));
        validPossibles.push(new Array(element[0], element[1] - 1));
        validPossibles.push(new Array(element[0] - 1, element[1] - 1));
        validPossibles.push(new Array(element[0] + 1, element[1] - 1));
        validPossibles.push(new Array(element[0] - 1, element[1] + 1));
        checkHorizMulti(element).forEach(e => {
            validPossibles.push(e)
        });
        checkVertMulti(element).forEach(e => {
            validPossibles.push(e)
        });
        // checkDiagMulti(element).forEach(e => {
        //     validPossibles.push(e)
        // });
    })
    // Remove arrays from validPossibles that do not match an array in allNodes
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
    // Remove coords with negative values and values > 3
    let ind=0;
    while (ind < validPossibles.length) {
      if (validPossibles[ind][0] < 0 || validPossibles[ind][1] < 0  || validPossibles[ind][0] > 3 || validPossibles[ind][1] > 3) {
        validPossibles.splice(ind, 1);
      } else {
        ind += 1;
      }
    }
    // Remove duplicates from validPossible
    let uniques = Array.from((new Map(validPossibles.map(arr => [arr.join(), arr]))).values());
    return uniques;
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