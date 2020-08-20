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

    it('Should fail with invalid type', (done) => {
      request.post('/event').send({ type: 'invalid', amount: 10 })
      .expect(400)
      .end((err, res) => {
        if(err) { return done(err); }

        should(res.text).be.equal('Invalid type');

        done();
      });
    });

    it('Should fail without amount', (done) => {
      request.post('/event')
      .send({ type: 'deposit' })
      .expect(400)
      .end((err, res) => {
        if(err) { return done(err); }

        should(res.text).be.equal('Missing amount');

        done();
      });
    });

    it('Should fail to deposit without destination', (done) => {
      request.post('/event')
      .send({ type: 'deposit', amount: 20 })
      .expect(400)
      .end((err, res) => {
        if(err) { return done(err); }

        should(res.text).be.equal('Missing destination');

        done();
      });
    });

    it('Should fail to withdraw without origin', (done) => {
      request.post('/event')
      .send({ type: 'withdraw', amount: 140 })
      .expect(400)
      .end((err, res) => {
        if(err) { return done(err); }

        should(res.text).be.equal('Missing origin');

        done();
      });
    });

    it('Should fail to withdraw from non-existing account', (done) => {
      request.post('/event')
      .send({ type: 'withdraw', origin: '200', amount: 140 })
      .expect(404)
      .end((err, res) => {
        if(err) { return done(err); }

        should(res.body).be.equal(0);

        done();
      });
    });

    it('Should fail to transfer without origin', (done) => {
      request.post('/event')
      .send({ type: 'transfer', amount: 140 })
      .expect(400)
      .end((err, res) => {
        if(err) { return done(err); }

        should(res.text).be.equal('Missing origin');

        done();
      });
    });

    it('Should fail to transfer without destination', (done) => {
      request.post('/event')
      .send({ type: 'transfer', origin: '2', amount: 140 })
      .expect(400)
      .end((err, res) => {
        if(err) { return done(err); }

        should(res.text).be.equal('Missing destination');

        done();
      });
    });

    it('Should fail to transfer from non-existing account', (done) => {
      request.post('/event')
      .send({ type: 'transfer', origin: '2', destination: '300', amount: 140 })
      .expect(404)
      .end((err, res) => {
        if(err) { return done(err); }

        should(res.body).be.equal(0);

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

    it('Withdraws from account', (done) => {
      request.post('/event')
      .send({ type: 'withdraw', origin: '100', amount: 5 })
      .expect(201)
      .end((err, res) => {
        if(err) { return done(err); }

        should.exist(res.body.origin);
        should.exist(res.body.origin.balance);
        should(res.body.origin.balance).be.equal(15);

        done();
      });
    });

    it('Tranfers from existing account to new account', (done) => {
      request.post('/event')
      .send({
        type: 'transfer',
        origin: '100',
        destination: '300',
        amount: 10
      })
      .expect(201)
      .end((err, res) => {
        if(err) { return done(err); }

        should.exist(res.body.origin);
        should(res.body.origin.balance).be.equal(5);

        should.exist(res.body.destination);
        should(res.body.destination.balance).be.equal(10);

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

        should(res.body).be.equal(5);

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
