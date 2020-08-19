const logger = require('../loaders/logger');
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

  async event(req, res) {
    const { amount, destination, origin, type } = req.body;

    try {
      if(!type) { throw 'Missing type'; }

      if(type === 'deposit') {
        if(!destination) { throw 'Missing destination'; }
        if(!amount) { throw 'Missing amount'; }

        const [account] = await Account.findOrCreate({
          where: { id: destination },
          defaults: { id: destination },
        });

        account.balance += parseInt(amount);
        await account.save();

        return res.created({ destination: account });
      }
    } catch(e) {
      logger.error(`AccountController :: event\n${e}`);
      return res.badRequest(e);
    }
  },
};

module.exports = AccountController;
