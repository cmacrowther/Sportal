$(function () {
    $('.navbar-toggle').click(function () {
        $('.navbar-nav').toggleClass('slide-in');
        $('.side-body').toggleClass('body-slide-in');
        $('#search').removeClass('in').addClass('collapse').slideUp(200);

        /// uncomment code for absolute positioning tweek see top comment in css
        //$('.absolute-wrapper').toggleClass('slide-in');
        
    });
   
   // Remove menu for searching
   $('#search-trigger').click(function () {
        $('.navbar-nav').removeClass('slide-in');
        $('.side-body').removeClass('body-slide-in');

        /// uncomment code for absolute positioning tweek see top comment in css
        //$('.absolute-wrapper').removeClass('slide-in');

    });
});

angular.module('dashboard.controllers')
    .controller('DashboardController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {

            var passObject = { user_id: $rootScope.userObject.id }

            $http({
	    		method: 'POST',
	    		url: 'api/get_user_teams',
	    		headers: {'Content-Type': 'application/json'},
	    		data: JSON.stringify(passObject)
	    	})
	    	.success(function(data){
                console.log(data);
            })

    }])