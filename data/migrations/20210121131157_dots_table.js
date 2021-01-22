
exports.up = function(knex) {
  return knex.schema.createTable("dots", table => {
    table.integer('id');
    table.boolean('firstClick').defaultTo(true);
    table.integer('turn').defaultTo(1);
    table.string('ends', 255);
    table.string('validNodes', 255);
    table.string('visitedNodes', 255);
    table.string('allNodes', 255);
    table.string('startNode', 255);
  })
};

exports.down = function(knex) {
  return knex.schema
  .dropTableIfExists('dots');
};