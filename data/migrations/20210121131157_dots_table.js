
exports.up = function(knex) {
  return knex.schema.createTable("dots", table => {
    table.integer('id');
    table.boolean('firstClick').defaultTo(true);
    table.integer('turn').defaultTo(1);
    table.specificType('ends', 'integer[][]');
    table.specificType('validNodes', 'integer[]');
    // table.string('visitedNodes', 255);
    table.specificType('allNodes', 'integer[][]');
    table.specificType('startNode', 'integer[]');
  })
};

exports.down = function(knex) {
  return knex.schema
  .dropTableIfExists('dots');
};