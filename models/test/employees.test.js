const Employee = require('../employees.model.js');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employee', () => {
  it('should throw an error if any arg is missing', () => {
    const cases = [
      {
        firstName: 'John',
        lastName: 'Doe',
      },
      {
        firstName: 'John',
        department: 'IT',
      },
      {
        lastName: 'Doe',
        department: 'IT',
      },
    ];

    for (let type of cases) {
      const emp = new Employee(type);
      emp.validate((err) => {
        expect(err.errors).to.exist;
      });
    }
  });

  it('should throw an error if "firstName" is not a string', () => {
    const cases = [{}, []];
    for (let test of cases) {
      const emp = new Employee({
        fisrtName: test,
        lastName: 'Doe',
        department: 'Marketing',
      });

      emp.validate((err) => {
        expect(err.errors).to.exist;
      });
    }
  });

  it('should throw an error if "lastName" is not a string', () => {
    const cases = [{}, []];
    for (let test of cases) {
      const emp = new Employee({
        fisrtName: 'John',
        lastName: test,
        department: 'Marketing',
      });

      emp.validate((err) => {
        expect(err.errors).to.exist;
      });
    }
  });

  it('should throw an error if "department" is not a string', () => {
    const cases = [{}, []];
    for (let test of cases) {
      const emp = new Employee({
        fisrtName: 'John',
        lastName: 'Doe',
        department: test,
      });

      emp.validate((err) => {
        expect(err.errors).to.exist;
      });
    }
  });

  it('should not throw an error if "name" is okay', () => {
    const cases = [
      {
        firstName: 'John',
        lastName: 'Doe',
        department: 'Marketing',
      },
      {
        firstName: 'Amelia',
        lastName: 'Sanders',
        department: 'IT',
      },
    ];
    for (let test of cases) {
      const emp = new Employee(test);

      emp.validate((err) => {
        expect(err).to.not.exist;
      });
    }
  });

  after(() => {
    mongoose.models = {};
  });
});