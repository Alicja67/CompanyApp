const Employee = require('../employees.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');


describe('Employee', () => {
  before(async () => {
    
    try {
      await mongoose.connect('mongodb://localhost:27017/companyDBtest', { useNewUrlParser: true, useUnifiedTopology: true });
    } catch(err) {
      console.error(err);
    }
  });

  describe('Reading data', () => {
    before(async () => {
      const testEmpOne = new Employee({ firstName: 'firstName#1', lastName: 'lastName#1', department: 'department#1' });
      await testEmpOne.save();

      const testEmpTwo = new Employee({ firstName: 'firstName#2', lastName: 'lastName#2', department: 'department#2' });
      await testEmpTwo.save();
    });

    it('should return all the data with "find" method', async () => {
      const employees = await Employee.find();
      const expectedLength = 2;
      expect(employees.length).to.be.equal(expectedLength);
    });

    it('should return proper document by various params with "findOne" method', async () => {
      const employee = await Employee.findOne( { firstName: 'firstName#1', lastName: 'lastName#1', department: 'department#1' });
      expect(employee.firstName).to.be.equal('firstName#1');
      expect(employee.lastName).to.be.equal('lastName#1');
      expect(employee.department).to.be.equal('department#1');
    });

    after(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Creating data', () => {

    it('should insert new document with "insertOne" method', async () => {
      const newEmployee = await new Employee({ firstName: 'firstName#1', lastName: 'lastName#1', department: 'department#1'});
      await newEmployee.save();
      const savedEmployee = await Employee.findOne({  firstName: 'firstName#1', lastName: 'lastName#1', department: 'department#1' });
      expect(savedEmployee).to.not.be.null;
    });

    after(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Updating data', () => {

    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: 'firstName#1', lastName: 'lastName#1', department: 'department#1' });
      await testEmpOne.save();
    
      const testEmpTwo = new Employee({ firstName: 'firstName#2', lastName: 'lastName#2', department: 'department#2'  });
      await testEmpTwo.save();
    });


    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne({ firstName: 'firstName#1'}, { $set: { firstName: 'firstName--'}});
      const updatedEmployee = await Employee.findOne({ firstName: 'firstName--' });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => {
      const employee = await Employee.findOne({ firstName: 'firstName#1'});
      employee.firstName = 'firstName--';
      await employee.save();
      
      const updatedEmployee = await Employee.findOne({ firstName: 'firstName--'});
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany({}, { $set: { firstName: 'Updated' }});
      const updatedEmployees = await Employee.find({ firstName: 'Updated'});
      expect(updatedEmployees.length).to.be.equal(2);
    });

    afterEach(async () => {
        await Employee.deleteMany();
      });
    });

    describe('Removing data', () => {

      beforeEach(async () => {
        const testEmpOne = new Employee({ firstName: 'firstName#1', lastName: 'lastName#1', department: 'department#1' });
        await testEmpOne.save();
      
        const testEmpTwo = new Employee({ firstName: 'firstName#2', lastName: 'lastName#2', department: 'department#2'  });
        await testEmpTwo.save();
      });

      it('should properly remove one document with "deleteOne" method', async () => {
        await Employee.deleteOne({ firstName: 'firstName#1' });
        const deletedEmployee = await Employee.findOne({ firstName: 'firstName#1' });
        expect(deletedEmployee).to.be.null;
      });

      it('should properly remove one document with "remove" method', async () => {
        await Employee.findOne({ firstName: 'firstName#1' });
        await Employee.remove();
        const deletedEmployee = await Employee.findOne({ firstName: 'firstName#1' });
        expect(deletedEmployee).to.be.null;
      });

      it('should properly remove multiple documents with "deleteMany" method', async () => {
        await Employee.deleteMany();
        const deletedEmployees = await Employee.find();
        expect(deletedEmployees.length).to.be.equal(0);
      });

      afterEach(async () => {
        await Employee.deleteMany();
      });
    });
  });
