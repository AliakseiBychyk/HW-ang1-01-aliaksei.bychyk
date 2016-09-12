(function() {
	"use strict";

	// app
	angular.module("app", ["ngSanitize"])
		.controller("Todo", Todo)
		.directive("todoList", todoList)
		.factory("todoService", todoService)
		.filter("checkedItems", checkedItems)
		.run(runApp)
		.value("model", {
			"user": "Vitaliy",
			"userPhoto": "images/VZ.jpg" //,
			/*"items": [
				{ action: "Estimate...", done: false },
				{ action: "Create...", done: false },
				{ action: "Edit...", done: true },
				{ action: "Delete...", done: false }
			]*/
		});

	function Todo(model, todoService) {
		let $ctrl = this;
		$ctrl.todo = model;
		Object.assign($ctrl, todoService);

		console.log($ctrl.todo);

		$ctrl.myHTML = "<span>Vitaliy</span>";
		$ctrl.showComplete = false; 
	}

	function todoList() {
		return {
			templateUrl: "table.html"
		};
	}

	function todoService() {
		return {
			addNewItem,
			incompleteCount,
			warningLevel
		};

		function addNewItem(items, newItem) {
			if (newItem && newItem.action) {
				items.push({
					"action": newItem.action,
					"done": false
				});

				newItem.action = "";
			}
		}

		function incompleteCount(items) {
			let count = 0;

			angular.forEach(items, (item) => {
				if (!item.done) count++;
			});

			return count;
		}

		function warningLevel(items) {
			return incompleteCount(items) < 3
				? "label-success"
				: "label-warning";
		}
	}

	function checkedItems() {
		return function(items, showComplete) {
			let resArr = [];

			if (angular.isArray(items)) {
				angular.forEach(items, (item) => {
					if (!item.done || showComplete) {
						resArr.push(item);
					}
				});
				return resArr;
			}
			else {
				return items;
			}
		};
	}

	function runApp($http, model) {
		$http
			.get("todo.json")
			.then(response => model.items = response.data);
	}

	// bootstrap app
	angular.element(document).ready(function() {
		angular.bootstrap(document, ["app"]);
	});

})();