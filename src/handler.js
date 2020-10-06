'use strict';
const AWS = require("aws-sdk");
const region = process.env.AWS_REGION
AWS.config.update({ region: region});
const ec2 = new AWS.EC2({ apiVersion: "2016-11-15" });

const securityGroupsList = [];

module.exports.listEC2SecurityGroups = async (event) => {
  let ec2List = await getEc2List();
  ec2List.Reservations.forEach(reservation => {
    reservation.Instances.forEach(instance => {
      securityGroupsList.push(...instance.SecurityGroups)
    })
  });
  return {
    statusCode: 200,
    body: JSON.stringify(securityGroupsList),
  };
};

const getEc2List = async () => {
  var params = {
    DryRun: false,
  };
  try {
    let data = await ec2.describeInstances(params).promise();
    console.log("EC2 Instances", data);
    return data;
  } catch (e) {
    throw new Error(`Could not describeInstances EC2 instances ${e.message}`);
  }
}