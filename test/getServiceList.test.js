const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs');
const config = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, '../config.yml')));
process.env.SERVICETABLENAME = 'swagger-dev-swagger-dynamo-serviceinfo';
process.env.VERSIONTABLENAME = 'swagger-dev-swagger-dynamo-versioninfo';
process.env.LAMBDACACHE = 'true';
process.env.DYNAMODBLOCAL = 'true';
process.env.AWS_REGION = config.region;

const handler = require(path.resolve(__dirname, '../src/serviceHandler'));

describe('SERVICE', () => {
    it('get service list', async() => {
        const response = await handler.getServices({}, {});
        console.log(response);
    })
})