const CausesController = require('./controller');
const { sequelize } = require('../../../db');

describe('Causes Controller', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });
  test('should create a cause', async () => {
    const causeObj = {
      name: 'Animal Shelter',
    };
    const controller = new CausesController();
    const resp = await controller.createCause(causeObj);
    const cause = await controller.getCause(resp.id);
    expect(cause.name).toBe('Animal Shelter');
  });

  test('should delete a cause', async () => {
    const causeObj = {
      name: 'Animal Shelter',
    };
    const controller = new CausesController();
    const resp = await controller.createCause(causeObj, 1);
    const cause = await controller.getCause(resp.id);
    expect(cause.name).toBe('Animal Shelter');
    
    await controller.deleteCause(resp.id);

    const deletedCause = await controller.getCause(resp.id);

    expect(deletedCause).toBeFalsy();
  });
  
  test('should index causes for a user', async () => {
    const controller = new CausesController();
    await controller.createCause({
      name: 'Animal Shelter',
    }, 1);
    await controller.createCause({
      name: 'Animal Shelter 2',
    }, 1);
    await controller.createCause({
      name: 'Animal Shelter 3',
    }, 1);
    await controller.createCause({
      name: 'Hospital 1',
    }, 2);
    const causes = await controller.indexForUser(1);
    expect(causes.length).toBe(3);
  });
});