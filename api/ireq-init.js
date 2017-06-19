'use strict';

require('ireq');

ireq.init(__dirname);

ireq.bind('core', '/core');
ireq.bind('util', '/core/util');
ireq.bind('event', '/core/events');
ireq.bind('config', '/core/config');
ireq.bind('item', '/core/items');
ireq.bind('const', '/core/constants');
ireq.bind('effect', '/core/effects');
ireq.bind('repository', '/core/repositories');
