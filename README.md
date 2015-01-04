snooze-controller
=================

A generic Controller for SnoozeJS

## Installation
In your applications root direction install via npm.

    npm install snooze-controller --save

In you main.js file import the `snooze-controller` module. `snooze-controller` depends on `snooze-baselib` (this will import automatically when `snooze-controller` is imported).

    snooze.module('myApp', ['snooze-controller']);

## Entities

`snooze-controller` provides 1 Entity. `controller`.

#### Controller

A controller is a thin middleware that can be leveraged for other `EntityGroups`. Controllers are not injectable in any fashion because their use is intended for special use cases.

	snooze.module('myApp').controller('UsersCtrl', {
		'users': function($opts) {
			return [
				{
					name: 'John Doe',
					balance: '$1000'
				}
			];
		}
	});

Controllers can only be used through direct access of the EntityManager or $controllerManager config service.

```
var Ctrl = snooze.module('myApp').EntityManager.getEntity('UsersCtrl').instance;
```

```
snooze.module('myApp').config(function($controllerManager) {
    var Ctrl = $controllerManager.getController('UsersCtrl');
});
```

A Controller provides a set of methods. The methods should be constructed specifically for the callers use. In other words, you should see how the caller uses the Controller and write your methods how they intend for you to write them.

Controller methods can be called directly from the Controller (if you have access to it) or from the $controllerManager config service.

```
snooze.module('myApp').EntityManager.getEntity('UsersCtrl').instance.call('users', {foo: 'bar'});
```
```
snooze.module('myApp').config(function($controllerManager) {
    $controllerManager.getController('UsersCtrl').call('users', {foo: 'bar'});
    $controllerManager.call('UsersCtrl', 'users', {foo: 'bar'});
});
```

Controller methods are injectable functions. You can pass any injectable entity like `services` to them. A special injectable exists for a Controller called the `$opts` injectable. `$opts` is not defined as an entity anywhere in your application but is created and injectected at runtime containing information the caller passed to the controller.

    snooze.module('myApp')
        .controller('UsersCtrl', {
            'users': function($opts) {
                $opts.foo === 'bar'; // true
            }
        })
        .config(function($controllerManager) {
            $controllerManager.call('UsersCtrl', 'users', {foo: 'bar'});
        });

Since `$opts` is an injectable it doesn't matter if you include it or what order it is in the function parameters. All of the following examples are valid:

    snooze.module('myApp')
        .service('myService', function() {
            var users = [
                {
                    name: 'John Doe',
                    balance: '$1000'
                }
            ];
            
            return {
                getUsers: function() { return users; }
            };
        })
        .controller('UsersCtrl', {
            'users': function() {
                return [];
            },
            'users2': function($opts) {
                return [];
            },
            'users3': function(myService) {
                return myService.getUsers();
            },
            'users4': function($opts, myService) {
                return myService.getUsers();
            },
            'users5': function(myService, $opts) {
                return myService.getUsers();
            }
        });

You can also make a Controller private (doesn't transfer if the module is imported into another) by setting the `$private` property.

    snooze.module('myApp').controller('UsersCtrl', {
            '$private': true,
            'users': function() {
                return [];
            }
        });


## Implementing

Implementing Controllers gets you close to the metal of snooze. When implementing in a custom EntityGroup there is no way to inject a Controller. To get Controllers or the `$controllerManager` you should use the Module's `EntityManager.getEntity` method.

    // EXAMPLE IMPLEMENTATION
    
    var MyEntityGroup = new snooze.EntityGroup();
	MyEntityGroup.type = 'myEntityGroup';

	MyEntityGroup.compile = function(entity, entityManager) {
		var constructor = entity.constructor;
		var ctrlName = constructor.controller;
		
		var $controllerManager = entityManager.getEntity('$controllerManager');
		constructor.on('someEvent', function(evtName, params) {
		    $controllerManager.call(ctrlName, evtName, params);
		});
	};
	
	// EXAMPLE IMPLEMENTATION
	
	snooze.module('myApp')
	    .controller('Users', {
	        'someEvent': function($opts) {
	            // do something
	        }
	    })
    	.myEntityGroup('Something', {
    	    controller: 'Users'
    	});
    	
    // EXAMPLE IMPLEMENTATION
    
This could seem confusing or redundant. But see how this can save time and make things simpler for the developer in `snooze-socket`. https://github.com/iamchairs/snooze-socket

