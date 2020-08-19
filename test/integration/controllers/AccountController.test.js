const server = require('../../../server');
const request = require('supertest')(server);
const should = require('should/as-function');
const { Account } = require('../../../src/models');

describe('Integration | Controller | Account Controller', () => {
  describe('POST /reset', () => {
    it('Should truncate all tables', (done) => {
      request.post('/reset').expect(200)
      .end(async (err) => {
        if(err) { return done(err); }

        const accounts = await Account.findAll();

        should(accounts).be.Array();
        should(accounts.length).be.equal(0);

        done();
      });
    });
  });
});
