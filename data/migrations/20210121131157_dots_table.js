
exports.up = function(knex) {
  return knex.schema.createTable("dots", table => {
    table.integer('id');
    table.string('validNodes', 255);
    table.string('visitedNodes', 255);
    table.string('startNode', 255);
  })
};

exports.down = function(knex) {
  return knex.schema
  .dropTableIfExists('startNode')
  .dropTableIfExists('visitedNodes')
  .dropTableIfExists('validNodes');
};