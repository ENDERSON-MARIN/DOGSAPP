const { Dog, database } = require('../../src/db.js');
const { expect } = require('chai');

describe('Dog model', () => {
  before(() => database.authenticate()
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    }));
  describe('Validators', () => {
    beforeEach(() => Dog.sync({ force: false }));
    describe('name', () => {
      it('should throw an error if name is null', (done) => {
        Dog.create({})
          .then(() => done(new Error('It requires a valid name')))
          .catch(() => done());
      });
      it('should work when its a valid name', () => {
        Dog.create({ name: 'Pug' });
      });
    });
    describe('height_min', () => {
      it('should throw an error if height_min is null', (done) => {
        Dog.create({})
          .then(() => done(new Error('It requires a valid height_min')))
          .catch(() => done());
      });
      it('should work when its a valid height_min', () => {
        Dog.create({ height_min: 36 });
      });
    });
    describe('height_max', () => {
      it('should throw an error if height_max is null', (done) => {
        Dog.create({})
          .then(() => done(new Error('It requires a valid height_max')))
          .catch(() => done());
      });
      it('should work when its a valid height_max', () => {
        Dog.create({ height_max: 66 });
      });
    });
    describe('weight_min', () => {
      it('should throw an error if weight_min is null', (done) => {
        Dog.create({})
          .then(() => done(new Error('It requires a valid weight_min')))
          .catch(() => done());
      });
      it('should work when its a valid weight_min', () => {
        Dog.create({ weight_min: 46 });
      });
    });
    describe('weight_max', () => {
      it('should throw an error if weight_max is null', (done) => {
        Dog.create({})
          .then(() => done(new Error('It requires a valid weight_max')))
          .catch(() => done());
      });
      it('should work when its a valid weight_max', () => {
        Dog.create({ weight_max: 76 });
      });
    });
  });
});
