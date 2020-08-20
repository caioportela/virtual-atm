const { DataTypes, Model } = require('sequelize');

class Account extends Model {
  static init(sequelize) {
    return super.init({
      balance: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      }
    },{
      sequelize,
      tableName: 'account',
      timestamps: false,
    });
  }
}

module.exports = Account;
