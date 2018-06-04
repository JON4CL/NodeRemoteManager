var srmApp = angular.module('srmApp', ['ngRoute', 'getFile', 'sendFile', 'eventLog', 'getStatus', 'screenshot']);

// configure our routes
srmApp.config(function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider
            // route for the status page
            .when('/getstatus', {
                templateUrl: 'app/getstatus/getstatus.html',
                controller: 'getstatusController'
            })

            // route for the windows event log page
            .when('/geteventlog', {
                templateUrl: 'app/eventlog/eventlog.html',
                controller: 'eventlogController'
            })

            // route for the execute command page
            .when('/execute', {
                //templateUrl : 'templates/contact.html',
                //controller  : 'contactCtrl'
                template: "<h1>EXECUTE</h1>"
            })

            // route for the screenshot page
            .when('/screenshot', {
                templateUrl: 'app/screenshot/screenshot.html',
                controller: 'screenshotController'
            })

            // route for the restart page
            .when('/restart', {
                template: "<h1>RESTART</h1>"
            })

            // route for the get/view file page
            .when('/getfile', {
                templateUrl: 'app/getfile/getfile.html',
                controller: 'GetFileController'
            })

            // route for the send/upload file page
            .when('/sendfile', {
                templateUrl: 'app/sendfile/sendfile.html',
                controller: 'SendFileController'
            })

            .otherwise({
                template: "NOON{{$locationProvider.path()}}"
            });
});

//GLOBAL $SCOPE FUNCTION
srmApp.run(function ($rootScope) {
    $rootScope.formatBytes = function (bytes, decimals) {
        if (bytes === 0 || bytes === "" || bytes === "0") {
            return '0 Byte';
        }
        var k = 1000; // or 1024 for binary
        var dm = decimals + 1 || 3;
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };
});
