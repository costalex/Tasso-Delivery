const Slack = require('slack-node');
const Address = require('../config/models/address');
const Course = require('../config/models/course');

webhookUriTasso = "https://hooks.slack.com/services/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";
webhookUriCourier = "https://hooks.slack.com/services/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";

slackTasso = new Slack();
slackTasso.setWebhook(webhookUriTasso);


slackCourier = new Slack();
slackCourier.setWebhook(webhookUriCourier);

exports.saymsgAccount = function(msg) {
  slack.webhook({
   channel: "#new_account",
   username: "New User",
   text: msg
 }, function(err, response) {
 });
};

exports.saymsgCourse = function(msg, id) {
    getAddress(id, function(addresses) {
        //console.log(msg, addresses);
        slackTasso.webhook({
            channel: "#new_course",
            username: "Take Your Bike",
            text: msg + "\n" + addresses
        }, function(err, response) {
            //console.log(err);
        });
        slackCourier.webhook({
            channel: "#commandes",
            username: "TassoDelivery",
            text: msg + "\n" + addresses
        }, function(err, response) {
            //console.log(err);
        });
    })
}

exports.saymsgCompany = function(msg) {
  slackTasso.webhook({
   channel: "#new_company",
   username: "Accept My Company",
   text: msg
 }, function(err, response) {
 });
}

function getAddress(id, callback) {
    var   allAddresses = "";
    Course.findById(id, (err, course) => {
    if (err || course == undefined)
        callback("Error no course find");
    else {
        Address.findById(course.address.idstartaddress, (err, addressStart) => {
        if (addressStart) {
            allAddresses += "Start => " + addressStart.name + "\n";
        }
        Address.findById(course.address.idendaddress, (err, addressEnd) => {
        if (addressEnd) {
            allAddresses += "End => " + addressEnd.name + "\n";
        }
        callback(allAddresses);
    })
    })
    }
});
}