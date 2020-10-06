"use strict";
var _ = require("lodash");
const helper = require("./helper");

module.exports.listEC2SecurityGroups = async () => {
  var securityGroupsList = [];
  let ec2List = await helper.getEc2List();
  ec2List.Reservations.forEach((reservation) => {
    reservation.Instances.forEach((instance) => {
      securityGroupsList = _.unionWith(
        securityGroupsList,
        instance.SecurityGroups,
        _.isEqual
      );
    });
  });
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/vnd.api+json",
    },
    body: JSON.stringify(helper.formatResponse(securityGroupsList)),
  };
};