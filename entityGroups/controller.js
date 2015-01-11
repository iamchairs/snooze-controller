(function() {
	var snooze = require('snooze');
	var _ = require('lodash');

	var Controller = new snooze.EntityGroup();
	Controller.type = 'controller';

	Controller.compile = function(entity, entityManager) {
		var constructor = entity.constructor;
		if(constructor !== null && typeof constructor === 'object' && constructor.length === undefined) {
			var $controllerManager = entityManager.getEntity('$controllerManager');
			$controllerManager.instance.$config.addController(entity);

			var methods = {};
			for(var method in constructor) {
				if(method === '$private') {
					entity.$private = constructor[method];
				} else {
					methods[method] = constructor[method];
				}
			}

			entity.instance = {
				getMethods: function() {
					return methods;
				},
				call: function(method, params) {
					if(methods[method]) {
						entityManager.run(methods[method], {'$opts': params});
					} else {
						throw new Error('Tried to call undefined method: ' + method + ' on Controller: ' + users);
					}
				}
			};
		} else {
			throw new Error('Controller constructor expected to be an object.');
		}
	};

	Controller.registerDependencies = function(entity, entityManager) {
		var finalDeps = [];
		var constructor = entity.constructor;
		for(var method in constructor) {
			var func = constructor[method];
			var deps = snooze.Util.getParams(func);

			for(var i = 0; i < deps.length; i++) {
				var dep = deps[i];
				if(dep !== '$opts') {
					finalDeps.push(dep);
				}
			}
		}

		entity.dependencies = finalDeps;
	};

	module.exports = Controller;
})();