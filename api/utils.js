module.exports = {
    setDefaults,
    setEnds,
    removeFromAllNodes,
    setValidNodes
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

function setDefaults(state) {
    return {
        firstClick: true,
        turn: 1,
        allNodes: allNodes(),
        validNodes: [],
        ends: [],
        startNode: []
    }
}

function setEnds(endsArray, ends) {
    // let { ends } = await getEnds();
    
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

function removeFromAllNodes(nodes, allNodes) {
    // Remove nodes after they were selected.
    // let { allNodes } = await getAllNodes();
    nodes.map(element => {
        allNodes.map((e, i) => {
            if (JSON.stringify(element) === JSON.stringify(e)) {
                allNodes.splice(i, 1)
            }  
        })
    })
    return allNodes;
}

function setValidNodes(ends, allNodes) {
    // Takes in the current end points and creates an array of all possible valid moves.
    // Then, we check those possibles against the known open or valid nodes. If they are not in the validNodes array, we remove them.
    // We then set validPossibles to the validNodes record.
    console.log(ends, allNodes)
    let validPossibles = []
    // let { ends } = await getEnds();
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
    // const { allNodes } = await getAllNodes();
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

    return uniques;
}