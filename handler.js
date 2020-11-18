'use strict';
const zifilinkEnvironment = require('./env');
const zifilinkConstants = require('./constants');
const zifilinkImports = require('./imports');

const requestCaller = async (requestType, token, ...args) => {
  const response = zifilinkConstants.appConstants.RESPONSE_FORMAT;

  let finalHeaders = zifilinkConstants.appConstants.AIKAAN_HEADER;
  if (token) {
    finalHeaders.headers['Cookie'] = `aicon-jwt=${token}`;
  }
  try {
    const finalArgs = args.filter(n => n)
    const returnData = await zifilinkImports.imports.requestTypes[requestType](...finalArgs, finalHeaders);
    response.statusCode = returnData.status;
    response.body = JSON.stringify(returnData.data);
  } catch (error) {
    response.statusCode = error.response.status;
    response.body = JSON.stringify({
      error: error.response.data
    });
  }
  return response;
}

module.exports.aikaanWrapper = async (event, context, callback) => {
  const aikaanRoute = event.path.split('v1/device-api')[1]
  console.log(aikaanRoute);
  const apiToHit = `${zifilinkEnvironment.environments.protocol}${zifilinkEnvironment.environments.baseAikaanUrl}${aikaanRoute}`;
  console.log(apiToHit);
  let response = zifilinkConstants.appConstants.RESPONSE_FORMAT;

  response = await requestCaller(event.httpMethod.toLowerCase(), event.headers['aicon-jwt'], apiToHit, event.body);

  callback(null, response);
};