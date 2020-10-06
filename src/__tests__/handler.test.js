const handler = require("../handler");
const helper = require("../helper");

var AWS = require("aws-sdk-mock");
const mockDescribeInstancesresponse = require("../mocks/mockDescribeInstancesresponse");

const mockListEC2SecurityGroupsResponse = require("../mocks/mockListEC2SecurityGroupsResponse");

test("listEC2SecurityGroups to return a valid response", async () => {
  AWS.mock("EC2", "describeInstances", function (params, callback) {
    callback(null, mockDescribeInstancesresponse);
  });
  let response = await handler.listEC2SecurityGroups();
  expect(response.body).toEqual(
    JSON.stringify(mockListEC2SecurityGroupsResponse)
  );
  AWS.restore("EC2");
});
