const { Account } = require('../models');

const AccountController = {
  /**
    * @endpoint: POST /reset
    * @description: Reset accounts
  **/
  async reset(req, res) {
    await Account.truncate();
    return res.status(200).send();
  },
};

module.exports = AccountController;
