const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs');
const config = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, '../config.yml')));
process.env.SERVICETABLENAME = 'swagger-dev-swagger-dynamo-serviceinfo';
process.env.VERSIONTABLENAME = 'swagger-dev-swagger-dynamo-versioninfo';
process.env.LAMBDACACHE = 'true';
process.env.DYNAMODBLOCAL = 'true';
process.env.AWS_REGION = config.region;

const handlerHelper = require('./utils/handler-helper');
const handler = require(path.resolve(__dirname, '../src/serviceCRUD'));


describe('CRUD', () => {
    it('get', async () => {
        const response = await handler.get(handlerHelper.createEvent({},{id:'aaa'}, null), {});
        expect(response.statusCode).not.toBe(200);
    })

    it('get', async () => {
        const response = await handler.get(handlerHelper.createEvent({}, { id: '524f25fe-b711-3ae8-b7b8-93fffaaeb4e0' }, null), {});
        expect(response.statusCode).toBe(200);
    })

    it('get', async () => {
        const response = await handler.get(handlerHelper.createEvent({}, {}, null), {});
        expect(response.statusCode).not.toBe(200);
    })

    it('post', async () => {
        const response = await handler.post(handlerHelper.createEvent({name: 'test'}, {}, null), {});
        expect(response.statusCode).toBe(200);
    })

    it('put', async () => {
        const response = await handler.put(handlerHelper.createEvent({}, { id: 'aaa'}, null), {});
        expect(response.statusCode).not.toBe(200);
    })

    it('put', async () => {
        const response = await handler.put(handlerHelper.createEvent({}, { id: '66a36e77-fd00-3779-8097-17841f998f4d', name: 'testtest1' }, null), {});
        expect(response.statusCode).toBe(200);
    })

    it('put', async () => {
        const response = await handler.put(handlerHelper.createEvent({}, { name: 'testtest' }, null), {});
        expect(response.statusCode).not.toBe(200);
    })

    it('put', async () => {
        const response = await handler.put(handlerHelper.createEvent({}, { id:'xxx', name: 'testtest23' }, null), {});
        expect(response.statusCode).not.toBe(200);
    })
    
    it('delete', async () => {
        const response = await handler.delete(handlerHelper.createEvent({}, { id:'bb3c2a58-b5e6-4fb4-a22a-9c5e2c5ad32a'}, null), {});
        console.log(response);
        expect(response.statusCode).toBe(200);
    })
})