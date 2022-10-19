const request = require('supertest');
const express = require('express');

const {sequelize} = require('../../../db');
const routes = require('./index');
const CausesController = require('./controller');

const app = express();

app.use(express.json())
app.use(routes);

describe('Causes Routes', () => {

  beforeEach(async () => {
    await sequelize.sync({ force: true })
  })

  test('should get a cause', async () => {
    const controller = new CausesController();
    await controller.createCause({name: "Animal Shelter"}, 1);
    const resp = await request(app).get('/causes/1');
    expect(resp.body).toEqual(expect.objectContaining({name: "Animal Shelter"}));
  });

  test('should get a list of causes', async () => {
    const controller = new CausesController();
    await controller.createCause({name: "Animal Shelter 1"}, 1);
    await controller.createCause({name: "Animal Shelter 2 "}, 1);
    await controller.createCause({name: "Animal Shelter 3"}, 1);
    await controller.createCause({name: "Animal Shelter 4"}, 1);
    const resp = await request(app).get('/causes');
    expect(resp.body.length).toBe(4);
  });

  test('should create a cause', async () => {
    const causeObj = {
      name: 'Animal Shelter Create'
    }
    await request(app).post('/causes/new').send(causeObj);
    const resp = await request(app).get('/causes/1');
    expect(resp.body).toEqual(expect.objectContaining({name: "Animal Shelter Create"}));
  });
  
  test('should delete a cause', async () => {
    const controller = new CausesController();
    await controller.createCause({name: "Animal Shelter"}, 1);
    const resp = await request(app).get('/causes/1');
    expect(resp.body).toEqual(expect.objectContaining({name: "Animal Shelter"}));
    await request(app).delete('/causes/1');
    //const resp2 = await request(app).get('/causes/1');
    //expect(resp2.body).toEqual(expect.not.objectContaining({name: "Animal Shelter"}));
  });

});