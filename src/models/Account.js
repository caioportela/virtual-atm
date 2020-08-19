const { DataTypes, Model } = require('sequelize');

class Account extends Model {
  static init(sequelize) {
    return super.init({
      balance: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
    },{
      sequelize,
      tableName: 'account',
      timestamps: false,
    });
  }
}

module.exports = Account;
