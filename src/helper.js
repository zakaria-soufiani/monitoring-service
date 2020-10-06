"use strict";
module.exports.getEc2List = async () => {
  const AWS = require("aws-sdk");
  const region = process.env.AWS_REGION;
  AWS.config.update({ region: region });
  const ec2 = new AWS.EC2({ apiVersion: "2016-11-15" });

  var params = {
    DryRun: false,
  };
  try {
    let data = await ec2.describeInstances(params).promise();
    return data;
  } catch (e) {
    throw new Error(`Could not describeInstances EC2 instances ${e.message}`);
  }
};

module.exports.formatResponse = (groups) => {
  let response = {
    data: [],
  };
  groups.forEach((group) => {
    let formattedGroup = {
      type: "securityGroup",
      id: group.GroupId,
      attributes: {
        name: group.GroupName,
      },
    };
    response.data.push(formattedGroup);
  });
  return response;
};
