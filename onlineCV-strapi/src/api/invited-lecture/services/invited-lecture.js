'use strict';

/**
 * invited-lecture service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::invited-lecture.invited-lecture');
