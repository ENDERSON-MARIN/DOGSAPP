/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../../src/app.js');
const { Dog, database } = require('../../src/db.js');

const server = session(app);
const dog = {
    name: "Pug",
};

describe('Dog routes', () => {
  before(() => database.authenticate()
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  }));
  beforeEach(() => Dog.sync({ force: false })
    .then(() => Dog.create(dog)));
  describe('GET /dogs', () => {
    it('should get 200', () =>
      server.get('/dogs').expect(200)
    );
  });
});
