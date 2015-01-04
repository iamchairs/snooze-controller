(function() {
	var snooze = require('snooze');

	snooze.module('snooze-controller', ['snooze-baselib'])
		.registerEntitiesFromPath('entities/*.js')
		.registerEntityGroupsFromPath('entityGroups/*.js');
})();