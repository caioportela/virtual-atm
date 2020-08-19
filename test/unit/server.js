const should = require('should/as-function');
const logger = require('../../src/loaders/logger');
logger.level = 'crit';

describe('Unit | Server setup', () => {
  it('Should not be exposed', () => {
    delete require.cache[require.resolve('../../server')];
    process.env.NODE_ENV = 'development';

    const server = require('../../server');
    should(server).be.Object();
  });

  it('Should be exposed as function', () => {
    delete require.cache[require.resolve('../../server')];
    process.env.NODE_ENV = 'test';

    const server = require('../../server');
    should(server).be.Function();
  });
});
