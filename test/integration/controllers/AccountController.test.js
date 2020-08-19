const server = require('../../../server');
const request = require('supertest')(server);
const should = require('should/as-function');
const { Account } = require('../../../src/models');

describe('Integration | Controller | Account Controller', () => {
  describe('POST /event', () => {
    it('Should fail without type', (done) => {
      request.post('/event').expect(400)
      .end((err, res) => {
        if(err) { return done(err); }

        should(res.text).be.equal('Missing type');

        done();
      });
    });

    it('Should fail without destination', (done) => {
      request.post('/event')
      .send({ type: 'deposit' })
      .expect(400)
      .end((err, res) => {
        if(err) { return done(err); }

        should(res.text).be.equal('Missing destination');

        done();
      });
    });

    it('Should fail without amount', (done) => {
      request.post('/event')
      .send({ type: 'deposit', destination: '100' })
      .expect(400)
      .end((err, res) => {
        if(err) { return done(err); }

        should(res.text).be.equal('Missing amount');

        done();
      });
    });

    it('Creates an account with initial balance', (done) => {
      request.post('/event')
      .send({ type: 'deposit', destination: '100', amount: 10 })
      .expect(201)
      .end((err, res) => {
        if(err) { return done(err); }

        should.exist(res.body.destination);
        should.exist(res.body.destination.balance);
        should(res.body.destination.balance).be.equal(10);

        done();
      });
    });

    it('Deposits into an existing account', (done) => {
      request.post('/event')
      .send({ type: 'deposit', destination: '100', amount: 10 })
      .expect(201)
      .end((err, res) => {
        if(err) { return done(err); }

        should.exist(res.body.destination);
        should.exist(res.body.destination.balance);
        should(res.body.destination.balance).be.equal(20);

        done();
      });
    });
  });

  describe('GET /balance', () => {
    it('Should fail for non-existing account', (done) => {
      request.get('/balance?account_id=1234').expect(404)
      .end((err, res) => {
        if(err) { return done(err); }

        should(res.body).be.equal(0);

        done();
      });
    });

    it('Get balance for existing account', (done) => {
      request.get('/balance?account_id=100').expect(200)
      .end((err, res) => {
        if(err) { return done(err); }

        should(res.body).be.equal(20);

        done();
      });
    });
  });

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
