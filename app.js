var todomvc = angular.module('todomvc', ['firebase']);

todomvc.controller('TodoCtrl', function TodoCtrl($scope, $location, $firebase) {
	var fireRef = new Firebase('https://firebasingtodos.firebaseio.com/');
	$scope.todos = $firebase(fireRef).$asArray();
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
		$scope.originalTodo = angular.extend({}, $scope.editedTodo);
	};

	// update todo for changes we made
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

	// delete all todos that have been completed
	$scope.clearCompletedTodos = function(){
		angular.forEach($scope.todos, function(todo){
			if (todo.completed){
				$scope.todos.$remove(todo);
			}
		});
	};

	// toggle completion status for all todos
	$scope.markAll = function(allCompleted){
		console.log(allCompleted)
		angular.forEach($scope.todos, function(todo){
			todo.completed = allCompleted;
			console.log(todo)
			$scope.todos.$save(todo);
		});
		
	};
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