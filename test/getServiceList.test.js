const path = require('path');
const handler = require(path.resolve(__dirname, '../src/serviceHandler'));

process.env.SERVICETABLENAME = 'swagger-dev-swagger-dynamo-serviceinfo';
process.env.VERSIONTABLENAME = 'swagger-dev-swagger-dynamo-versioninfo';
process.env.LAMBDACACHE = 'true'

describe('SERVICE', () => {
    it('get service list', async() => {
        const response = await handler.getServices({}, {});
        console.log(response);
    })
})