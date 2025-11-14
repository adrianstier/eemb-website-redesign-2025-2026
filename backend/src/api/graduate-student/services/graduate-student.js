'use strict';

/**
 * graduate-student service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::graduate-student.graduate-student');
