'use strict';
const AWS = require('aws-sdk');
const LambdaStorage = require('../lib/lambda-storage');
const lambdaHelper = require('../lib/lambda-helper');
const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = 'debug';

AWS.config.update({ region: 'ap-northeast-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient();

const storage = new LambdaStorage();


const scanTable = async (TableName) => {
  let scanResult = await dynamodb.scan({ TableName }).promise();
  let result = scanResult.Items;
  while ('LastEvaluatedKey' in scanResult) {
    const params = {
      TableName,
      ExclusiveStartKey: scanResult.LastEvaluatedKey
    }
    scanResult = await dynamodb.scan(params).promise();
    Array.prototype.push.apply(result, scanResult.Items);
  }
  return result;
}

// let serviceList = undefined;

// storage.setItem('serviceList', [{aa:'aa'},{bb:'bb'}]);
module.exports.getServices = async (event, context) => {
  try {
    logger.debug(process.env.SERVICETABLENAME);
    logger.debug(process.env.LAMBDACACHE);

    const params = { TableName: process.env.SERVICETABLENAME };

    let isCached = false;
    let serviceList;
    if (process.env.LAMBDACACHE === 'true') {
      const cachedData = storage.getItem('serviceList');
      if (cachedData === undefined) {
        serviceList = await scanTable(process.env.SERVICETABLENAME);
        storage.setItem('serviceList', serviceList);
      } else {
        serviceList = cachedData.value;
        isCached = true;
      }
    } else {
      serviceList = await scanTable(process.env.SERVICETABLENAME);
    }


    return lambdaHelper.response.success({
      Services: serviceList,
      Count: serviceList.length,
      isCached
    });
  } catch (error) {
    logger.error(error);
    return lambdaHelper.response.error('error!');
  }
};
