const { course } = require("../models");

module.exports = {
    auth: require("./auth"),
    course: require("./course-route"),
}