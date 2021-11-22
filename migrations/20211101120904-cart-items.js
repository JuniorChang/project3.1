'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('cart_items', {
    id: { 
      type: 'int',
      unsigned: true,
      primaryKey: true,
      autoIncrement: true
    },
    quantity:{
      type: 'int',
      unsigned: true
    },
    user_id:{
      type: 'int',
      unsigned: false,
      notNull:true,
      foreignKey:{
        name:'cart_item_user_fk',
        table: 'users',
        mapping:'id',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        }
      }
    },
    product_id:{
      type: 'int',
      notNull:true,
      unsigned: true,
      foreignKey:{
        name: 'cart_item_product_fk',
        table: 'coffee_products',
        rules:{
          onDelte:'CASCADE',
          onUpdata: 'RESTRICT'
        },
        mapping: 'id'
      }
    }
  });
};

exports.down = function(db) {
  return db.dropTable('cart_items');
};

exports._meta = {
  "version": 1
};
