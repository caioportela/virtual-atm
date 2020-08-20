const logger = require('../loaders/logger');
const { Account } = require('../models');

const AccountController = {
  /**
    * @endpoint: POST /reset
    * @description: Reset accounts
  **/
  async reset(req, res) {
    await Account.truncate();
    return res.sendStatus(200);
  },

  async event(req, res) {
    const { amount, destination, origin, type } = req.body;

    try {
      if(!type) { throw 'Missing type'; }
      if(!amount) { throw 'Missing amount'; }

      if(type === 'deposit') {
        if(!destination) { throw 'Missing destination'; }

        const [account] = await Account.findOrCreate({
          where: { id: destination },
          defaults: { id: destination },
        });

        account.balance += parseInt(amount);
        await account.save();

        return res.created({ destination: account });
      }

      if(type === 'withdraw') {
        if(!origin) { throw 'Missing origin'; }

        const account = await Account.findOne({
          where: { id: origin },
        });

        if(!account) {
          return res.notFound();
        }

        account.balance -= parseInt(amount);
        await account.save();

        return res.created({ origin: account });
      }

      if(type === 'transfer') {
        if(!origin) { throw 'Missing origin'; }
        if(!destination) { throw 'Missing destination'; }

        const from = await Account.findOne({
          where: { id: origin },
        });

        if(!from) {
          return res.notFound();
        }

        const [to] = await Account.findOrCreate({
          where: { id: destination },
          defaults: { id: destination },
        });

        from.balance -= parseInt(amount);
        to.balance += parseInt(amount);

        await Promise.all([
          from.save(),
          to.save()
        ]);

        return res.created({ origin: from, destination: to });
      }

      throw 'Invalid type';
    } catch(e) {
      logger.error(`AccountController :: event\n${e}`);
      return res.badRequest(e);
    }
  },

  async getBalance(req, res) {
    const { account_id } = req.query;

    try {
      const account = await Account.findOne({
        where: { id: account_id },
      });

      if(!account) { throw 'Account not found'; }

      return res.ok(account.balance);
    } catch(e) {
      logger.error(`AccountController :: event\n${e}`);
      return res.notFound();
    }
  },
};

module.exports = AccountController;
