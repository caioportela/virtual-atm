const { Account } = require('../models');

const AccountController = {
  /**
    * @endpoint: POST /reset
    * @description: Reset accounts
  **/
  async reset(req, res) {
    await Account.truncate();
    return res.ok();
  },
};

module.exports = AccountController;
