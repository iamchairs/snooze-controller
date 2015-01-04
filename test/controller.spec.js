describe('Entity', function() {
	'use strict';

	var Entity;
	var snooze;
	var should = require('should');

	snooze = require('snooze');
	require('../main.js');
	snooze.module('myApp', ['snooze-controller']);

	beforeEach(function() {
		snooze.module('myApp').EntityManager.removeEntity('users');
		snooze.module('myApp').configs.length = 0;
	});

	it('should be defined', function() {
		(typeof snooze.module('myApp').controller).should.not.equal('undefined');
	});

	it('should have $controllerManager', function() {
		snooze.module('myApp').EntityManager.getEntity('$controllerManager').should.not.equal(undefined);
	});

	it('should define multiple methods', function(done) {
		snooze.module('myApp')
			.controller('users', {
				'/users': function($opts) {},
				'/user/:id': function($opts) {}
			})
			.EntityManager.compile();

		snooze.module('myApp')
			.config(function($controllerManager) {
				Object.keys($controllerManager.getController('users').getMethods()).length.should.equal(2);
				done();
			})
			.doConfigs();
	});

	it('should call a controller method', function(done) {
		snooze.module('myApp')
			.controller('users', {
				'/users': function($opts) {
					$opts.foo.should.equal('bar');
				}
			})
			.EntityManager.compile();

		snooze.module('myApp')
			.config(function($controllerManager) {
				$controllerManager.getController('users').call('/users', {foo: 'bar'});
				done();
			})
			.doConfigs();
	});

	it('should call a controller method with injected values', function(done) {
		snooze.module('myApp')
			.controller('users', {
				'/users': function($opts, myService) {
					$opts.foo.should.equal('bar');
					myService.bar.should.equal('baz');
				}
			})
			.service('myService', function() {
				return {
					bar: 'baz'
				};
			})
			.EntityManager.compile();

		snooze.module('myApp')
			.config(function($controllerManager) {
				$controllerManager.getController('users').call('/users', {foo: 'bar'});
				done();
			})
			.doConfigs();
	});

	it('should call a controller method using the $controllerManager', function(done) {
		snooze.module('myApp')
			.controller('users', {
				'/users': function($opts, myService) {
					$opts.foo.should.equal('bar');
					myService.bar.should.equal('baz');
				}
			})
			.service('myService', function() {
				return {
					bar: 'baz'
				};
			})
			.EntityManager.compile();

		snooze.module('myApp')
			.config(function($controllerManager) {
				$controllerManager.call('users', '/users', {foo: 'bar'});
				done();
			})
			.doConfigs();
	});

	it('should return undefined on a non-existant controller', function(done) {
		snooze.module('myApp')
			.config(function($controllerManager) {
				(typeof $controllerManager.getController('test')).should.equal('undefined');
				done();
			})
			.doConfigs();
	});

	it('should throw an error on trying to call an undefined controller', function(done) {
		snooze.module('myApp')
			.config(function($controllerManager) {
				var thrown = false;
				try {
					$controllerManager.call('users', '/users', {});
				} catch(e) {
					thrown = true;
				}

				thrown.should.equal(true);

				done();
			})
			.doConfigs();
	});

	it('should throw an error on trying to call an undefined method on a controller', function(done) {
		snooze.module('myApp')
			.controller('users', {})
			.config(function($controllerManager) {
				var thrown = false;
				try {
					$controllerManager.call('users', '/users', {});
				} catch(e) {
					thrown = true;
				}

				thrown.should.equal(true);

				done();
			})
			.doConfigs();
	});
});