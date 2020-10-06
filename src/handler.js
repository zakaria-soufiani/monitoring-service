'use strict';
var _ = require('lodash');
const AWS = require("aws-sdk");
const region = process.env.AWS_REGION;
AWS.config.update({ region: region});
const ec2 = new AWS.EC2({ apiVersion: "2016-11-15" });

var securityGroupsList = [];

module.exports.listEC2SecurityGroups = async (event) => {
  let ec2List = await getEc2List();
  ec2List.Reservations.forEach(reservation => {
    reservation.Instances.forEach(instance => {
      securityGroupsList = _.unionWith(securityGroupsList, instance.SecurityGroups, _.isEqual)
    })
  });
  return {
    statusCode: 200,
    body: JSON.stringify(formatResponse(securityGroupsList)),
  };
};

const formatResponse = (groups) => {
  let response = {
    data: []
  }
  groups.forEach(group => {
    let formattedGroup = {
      type: 'securityGroup',
      id: group.GroupId,
      attributes: {
        name: group.GroupName
      }
    }
    response.data.push(formattedGroup)
  })
  return response
}

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