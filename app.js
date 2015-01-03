var todomvc = angular.module('todomvc', ['firebase']);

todomvc.controller('TodoCtrl', function TodoCtrl($scope, $location, $firebase) {
	var fireRef = new Firebase('https://firebasingtodos.firebaseio.com/');
	$scope.todos = $firebase(fireRef).$asArray();
	console.log($scope.todos)
	$scope.newTodo = '';
	$scope.editedTodo = null;

	$scope.$watch('todos', function(){
		var total = 0;
		var remaining = 0;
		$scope.todos.forEach(function(todo){
			total++;
			if (todo.completed === false) {
				remaining++;
			}
		});
		$scope.totalCount = total;
		$scope.remainingCount = remaining;
		$scope.completedCount = total - remaining;
		$scope.allChecked = remaining === 0;
	}, true);

	$scope.addTodo = function(){
		var newTodo = $scope.newTodo.trim();
		if (!newTodo.length) {
			return;
		}
		// push to firebase
		$scope.todos.$add({
			title: newTodo,
			completed: false
		});
		$scope.newTodo = '';
	};

	$scope.editTodo = function(todo){
		$scope.editedTodo = todo;
		console.log($scope.editedTodo)
		$scope.originalTodo = angular.extend({}, $scope.editedTodo);
	};

	$scope.doneEditing = function(todo){
		$scope.editedTodo = null;
		var title = todo.title.trim();
		if (title) {
			$scope.todos.$save(todo);
		} else {
			$scope.removeTodo(todo);
		}
	};

	$scope.removeTodo = function(todo){
		$scope.todos.$remove(todo);
	};

	// $scope.toggleCompleted = function(id){
	// 	var todo = $scope.todos[id];
	// 	todo.completed = !todo.completed;
	// 	$scope.todos.$save(id);
	// };

	// $scope.clearCompletedTodos = function () {
	// 	angular.forEach($scope.todos, function(todo){
	// 		if (todo.completed){
	// 			$scope.todos.$remove(todo);
	// 		}
	// 	});
	// };

	// $scope.markAll = function (allCompleted) {
	// 	angular.forEach($scope.todos, function(todo){
	// 		todo.completed = !allCompleted;
	// 	});
	// 	$scope.todos.$save();
	// };
});


// TODO focus and blur directives
todomvc.directive('todoFocus', function todoFocus($timeout){
	return function(scope, elem, attrs){
		scope.$watch(attrs.todoFocus, function(newVal){
			if (newVal){
				$timeout(function(){
					// sets focus to edit input field
					elem[0].focus();
				}, 0, false);
			}
		});
	};
});

todomvc.directive('todoBlur', function () {
	return function (scope, elem, attrs) {
		elem.bind('blur', function(){
			// run function we pass in to attribute on blur
			scope.$apply(attrs.todoBlur);
		});
	};
});