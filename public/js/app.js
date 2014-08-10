elmenusApp = angular.module('elmenusApp', ['ngRoute']);

elmenusApp.value("apiBaseUrl", "/api/");

elmenusApp.config(function($routeProvider){

	$routeProvider.
		when('/',{
			'controller': 'HomeController',
			'templateUrl': '/partials/home.html'
		})
		.when('/menus/:menuId', {
			'controller': 'MenuController',
			'templateUrl': '/partials/menu.html'
		})
		.when('/menus/:menuId/categories/:categoryId', {
			'controller': 'CategoryController',
			'templateUrl': '/partials/category.html'
		})
		.when('/search', {
			'controller': 'SearchController',
			'templateUrl': 'partials/search.html'
		})
		.otherwise({ redirectTo: '/' });
});

elmenusApp.factory('menuFactory', function($http,apiBaseUrl){
	factory = {};

	factory.getMenus = function(){
		return $http.get(apiBaseUrl+'menus');
	}
	factory.getMenu = function(menuId){
		return $http.get(apiBaseUrl+'menus/'+menuId);
	}

	return factory;
});
elmenusApp.factory('categoryFactory', function($http,apiBaseUrl){
	factory = {};
	
	factory.getCategories = function(menuId){
		return $http.get(apiBaseUrl+'categories', {params: {menu_id: menuId}});
	}
	factory.getCategory = function(categoryId){
		return $http.get(apiBaseUrl+'categories/'+categoryId);
	}

	return factory;
});
elmenusApp.factory('itemFactory', function($http,apiBaseUrl){
	factory = {};
	
	factory.getItems = function(categoryId){
		return $http.get(apiBaseUrl+'items',{params: {category_id: categoryId, include_sizes: 1}});
	}
	factory.getSearchItems = function(searchKeyword){
		return $http.post(apiBaseUrl+'items/search',{keyword: searchKeyword});	
	}
	return factory;
});

elmenusApp.controller('HomeController', function($scope, menuFactory){
	menuFactory.getMenus().success(function(menus){
		$scope.menus = menus;
	});
});
elmenusApp.controller('MenuController', function($scope, $routeParams, menuFactory, categoryFactory){
	
	menuFactory.getMenu($routeParams.menuId).success(function(menu){
		$scope.menu = menu;
	});
	categoryFactory.getCategories($routeParams.menuId).success(function(categories){
		$scope.categories = categories;
	});
});
elmenusApp.controller('CategoryController', function($scope, $routeParams, menuFactory, categoryFactory, itemFactory){
	
	menuFactory.getMenu($routeParams.menuId).success(function(menu){
		$scope.menu = menu;
	});
	categoryFactory.getCategory($routeParams.categoryId).success(function(category){
		$scope.category = category;
	});
	itemFactory.getItems($routeParams.categoryId).success(function(items){
		$scope.items = items;
	})
});
elmenusApp.controller('SearchController', function($scope, itemFactory){
	$scope.refreshSearch = function(){
		itemFactory.getSearchItems($scope.searchKeyword).success(function(items){
			console.log(items);
			$scope.results = items;
		});
	}
});
