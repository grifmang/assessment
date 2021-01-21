// Create 2D matrix of game grid for seeding the valid nodes record
function allNodes() {
  let nodes = [];
  for (let i=0; i<4; i++) {
    for (let j=0; j<4; j++) {
      nodes.push(Array(i, j));
    }
  }
  return nodes;
}

exports.seed = function(knex) {
  return knex('dots').truncate()
    .then(function () {
      return knex('dots').insert([
        {id: 1, validNodes: allNodes(), visitedNodes: '', startNode: ''}
      ]);
    });
};
