'use strict';
const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');
const lambdaHelper = require('../lib/lambda-helper');
const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = 'debug';

const Validator = require('jsonschema').Validator;
const v = new Validator();


AWS.config.update({ region: 'ap-northeast-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.get = async (event, context) => {
    try {
        if (!('id' in event.pathParameters)){
            return lambdaHelper.response.error('pathParameter Error');
        }
        const id = event.pathParameters.id;

        const params = {
            TableName: process.env.SERVICETABLENAME,
            Key: { id }
        }

        const result = await dynamodb.get(params).promise();
        logger.debug(result);

        if ('Item' in result) {
            return lambdaHelper.response.success(result.Item);
        } else {
            return lambdaHelper.response.error('incorrect id');
        }
    } catch (error) {
        logger.error(error);
        return lambdaHelper.response.error('error');
    }
}

const postSchema = {
    description: 'post validation',
    type: 'object',
    additionalProperties: false,
    properties: {
        name: { type: 'string' }
    },
    required: ['name']
};


module.exports.post = async (event, context) => {
    try {
        const body = JSON.parse(event.body);
        const validationResult = v.validate(body, postSchema);
        if(validationResult.errors.length > 0) {
            return lambdaHelper.response.error('parameter error');
        }

        const id = uuidv4();
        logger.error(id);
        const params = {
            TableName: process.env.SERVICETABLENAME,
            Item: {
                id: id,
                servicename: body.name,
                lastupdated: (new Date()).getTime(),
                latestversion: 'undefined',
            },
            Expected: {
                id: { Exists: false }
            }
        }
        const result = await dynamodb.put(params).promise();
        logger.debug('postResult', result);
        return lambdaHelper.response.success(params);
    } catch (error) {
        logger.error(error);
        return lambdaHelper.response.error(JSON.stringify(error));
    }
}


const putSchema = {
    description: 'post validation',
    type: 'object',
    additionalProperties: false,
    properties: {
        name: { type: 'string' },
        latestversion: {type: 'string'}
    }
};

module.exports.put = async (event, context) => {
    //TODO: duplicate username check
    try {
        if (!('id' in event.pathParameters) || !('name' in event.pathParameters)) {
            return lambdaHelper.response.error('pathParameter Error');
        }
        const id = event.pathParameters.id;
        const name = event.pathParameters.name;

        const params = {
            TableName: process.env.SERVICETABLENAME,
            Key: { id },
            UpdateExpression: 'set #servicename = :servicename',
            ConditionExpression: 'attribute_exists(id)',
            ExpressionAttributeNames: { '#servicename': 'servicename'},
            ExpressionAttributeValues: {
                ':servicename': name
            }
        }

        const result = await dynamodb.update(params).promise();
        logger.debug('putREsult', result);
        return lambdaHelper.response.success({
            id,
            name
        });
    } catch (error) {
        if ('ConditionalCheckFailedException' in error) {
            return lambdaHelper.response.error('may not exist serviceid');
        }
        return lambdaHelper.response.error(JSON.stringify(error));
    }
}

module.exports.delete = async (event, context) => {
    try {
        if (!('id' in event.pathParameters)) {
            return lambdaHelper.response.error('pathParameter Error');
        }
        const id = event.pathParameters.id;

        const params = {
            TableName: process.env.SERVICETABLENAME,
            Key: { id }
        }

        const result = await dynamodb.delete(params).promise();
        logger.debug(result);
        return lambdaHelper.response.success({message: 'If Item does not exist, this api returns successCode'});
    } catch (error) {
        return lambdaHelper.response.error(JSON.stringify(error));
    }
}