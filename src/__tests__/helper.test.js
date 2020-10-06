const helper = require("../helper");

var AWS = require("aws-sdk-mock");
const mockDescribeInstancesresponse = require("../mocks/mockDescribeInstancesresponse");

test("formats response to JSON:API 1.0", () => {
  let mockGroups = [
    { GroupName: "default", GroupId: "sg-1865f67f" },
    { GroupName: "launch-wizard-1", GroupId: "sg-06ac76b830d813b27" },
  ];

  let formattedResponse = {
    data: [
      {
        type: "securityGroup",
        id: "sg-1865f67f",
        attributes: {
          name: "default",
        },
      },
      {
        type: "securityGroup",
        id: "sg-06ac76b830d813b27",
        attributes: {
          name: "launch-wizard-1",
        },
      },
    ],
  };
  expect(helper.formatResponse(mockGroups)).toStrictEqual(formattedResponse);
});

test("getEc2List to return a list of Reservations", async () => {
  AWS.mock("EC2", "describeInstances", function (params, callback) {
    callback(null, mockDescribeInstancesresponse);
  });
  const params = {
    DryRun: false,
  };
  let result = await helper.getEc2List(params);
  expect(result).toStrictEqual(mockDescribeInstancesresponse);
  AWS.restore("EC2");
});

test("getEc2List to throw Error", async () => {
  AWS.mock("EC2", "describeInstances", function (params, callback) {
    callback(new Error("Mock Error"), null);
  });
  const params = {
    DryRun: false,
  };
  await expect(helper.getEc2List(params)).rejects.toThrow(
    new Error("Could not describeInstances EC2 instances Mock Error")
  );
  AWS.restore("EC2");
});
