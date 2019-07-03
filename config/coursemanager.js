var Course = require('../config/models/course');
var Address = require('../config/models/address')

exports.detailssend = function(course, next)
{
  Address.findOne({'_id': course.address.idstartaddress}, function(err, address_sender) {
    if (address_sender != null)
    {
      Address.findOne({'_id' : course.address.idendaddress}, function(err, address_recipent) {
        if (address_recipent != null)
        {
          var details = {distance: course.details.distance, refcourse: course.link.refcourse, option: course.security.option,
            startaddress: {
              name: address_sender.name,
              lng : address_sender.details.lng,
              lat : address_sender.details.lat,
            },
            endaddress : {
              name: address_recipent.name,
              lng : address_recipent.details.lng,
              lat: address_recipent.details.lat,
            },
            sender:{
              firstname: course.sender.firstname,
              lastname: course.sender.lastname,
              phone: course.sender.phone,
              instruction: course.sender.instruction,
            },
            recipient: {
              firstname: course.recipient.firstname,
              lastname: course.recipient.lastname,
              phone: course.recipient.phone,
              instruction: course.recipient.instruction,
            }};
            next(details);
          }
        });
      }
    });
  }

  exports.detailssendhistorycourier = function(course, next)
  {
    Address.findOne({'_id': course.address.idstartaddress}, function(err, address_sender) {
      if (address_sender != null)
      {
        Address.findOne({'_id' : course.address.idendaddress}, function(err, address_recipent) {
          if (address_recipent != null)
          {
            var details = {distance: course.details.distance, refcourse: course.link.refcourse, price: course.details.pricecourier, endcoursetime: course.details.endcoursetime,
              time:{
                day: course.details.endcoursetime.getDate(),
                month: course.details.endcoursetime.getMonth()+1,
                year: course.details.endcoursetime.getFullYear(),
                hour: course.details.endcoursetime.getHours(),
                minute: course.details.endcoursetime.getMinutes(),
              },
              startaddress: {
                name: address_sender.name,
                lng : address_sender.details.lng,
                lat : address_sender.details.lat,
              },
              endaddress : {
                name: address_recipent.name,
                lng : address_recipent.details.lng,
                lat: address_recipent.details.lat,
              }};
              next(details);
            }
          });
        }
      });
    }

  exports.Coursenoterminedsend = function(course, next)
  {
    Address.findOne({'_id': course.address.idstartaddress}, function(err, address_sender) {
      if (address_sender != null)
      {
        Address.findOne({'_id' : course.address.idendaddress}, function(err, address_recipent) {
          if (address_recipent != null)
          {
            var details = {startaddress: address_sender.name, endaddress: address_recipent.name,
              distance: course.details.distance, refcourse: course.link.refcourse, option: course.security.option,
              step : course.details.step,
              price: course.details.price,
              validatetime : course.details.validatetime,
              time:{
                day: course.details.validatetime.getDate(),
                month: course.details.validatetime.getMonth()+1,
                year: course.details.validatetime.getFullYear(),
                hour: course.details.validatetime.getHours(),
                minute: course.details.validatetime.getMinutes(),
              },
              sender:{
                firstname: course.sender.firstname,
                lastname: course.sender.lastname,
                phone: course.sender.phone,
                instruction: course.sender.instruction,
              },
              recipient: {
                firstname: course.recipient.firstname,
                lastname: course.recipient.lastname,
                phone: course.recipient.phone,
                instruction: course.recipient.instruction,
              }};
              next(details);
            }
          });
        }
      });
    }

    exports.detailssendreload = function(course, next)
    {
      Address.findOne({'_id': course.address.idstartaddress}, function(err, address_sender) {
        if (address_sender != null)
        {
          Address.findOne({'_id' : course.address.idendaddress}, function(err, address_recipent) {
            if (address_recipent != null)
            {
              if (course.details.startcoursetime == undefined)
              {
                var details = {course: true, distance: course.details.distance, refcourse: course.link.refcourse, option: course.security.option,
                  validate : false,
                  startaddress: {
                    name: address_sender.name,
                    lng : address_sender.details.lng,
                    lat : address_sender.details.lat,
                  },
                  endaddress : {
                    name: address_recipent.name,
                    lng : address_recipent.details.lng,
                    lat: address_recipent.details.lat,
                  },
                  sender:{
                    firstname: course.sender.firstname,
                    lastname: course.sender.lastname,
                    phone: course.sender.phone,
                    instruction: course.sender.instruction,
                  },
                  recipient: {
                    firstname: course.recipient.firstname,
                    lastname: course.recipient.lastname,
                    phone: course.recipient.phone,
                    instruction: course.recipient.instruction,
                  }};
                  next(details);
                }
                else {
                  var details = {course: true, distance: course.details.distance, refcourse: course.link.refcourse, option: course.security.option,
                    validate : true,
                    startaddress: {
                      name: address_sender.name,
                      lng : address_sender.details.lng,
                      lat : address_sender.details.lat,
                    },
                    endaddress : {
                      name: address_recipent.name,
                      lng : address_recipent.details.lng,
                      lat: address_recipent.details.lat,
                    },
                    sender:{
                      firstname: course.sender.firstname,
                      lastname: course.sender.lastname,
                      phone: course.sender.phone,
                      instruction: course.sender.instruction,
                    },
                    recipient: {
                      firstname: course.recipient.firstname,
                      lastname: course.recipient.lastname,
                      phone: course.recipient.phone,
                      instruction: course.recipient.instruction,
                    }};
                    next(details);
                  }
                }
              });
            }
          });
        }

        exports.Managenotification = function(course, next)
        {
          Address.findOne({'_id': course.address.idstartaddress}, function(err, address_sender) {
            if (address_sender != null)
            {
              Address.findOne({'_id' : course.address.idendaddress}, function(err, address_recipent) {
                if (address_recipent != null)
                {
                  var details = {
                    time:{
                      day: course.details.validatetime.getDate(),
                      month: course.details.validatetime.getMonth()+1,
                      year: course.details.validatetime.getFullYear(),
                      hour: course.details.validatetime.getHours(),
                      minute: course.details.validatetime.getMinutes(),
                    },
                    validatetime : course.details.validatetime,
                    step: course.details.step,
                    refcourse: course.link.refcourse
                  };
                    next(details);
                  }
                });
              }
            });
          }
