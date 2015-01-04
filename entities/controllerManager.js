(function() {
	var snooze = require('snooze');

	snooze.module('snooze-controller').service('$controllerManager', function() {
		var controllers = {};

		function getController(nm) {
			var Ctrl = controllers[nm];
			if(Ctrl) {
				return Ctrl.instance;
			}

			return;
		};

		function addController(entity) {
			controllers[entity.getName()] = entity;
		};

		function call(nm, method, params) {
			var Ctrl = getController(nm);

			if(Ctrl) {
				Ctrl.call(method, params);
			} else {
				throw new Error('Tried to call: ' + method + ' on undefined Controller: ' + nm);
			}
		};

		var $config = {
			getController: getController,
			addController: addController,
			call: call
		};

		return {
			'$configurable': true,
			'$injectable': false,
			'$private': false,
			'$config': $config
		};
	});
})();