// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
/*jslint browser: true, devel: true */
// the 2nd parameter is an array of 'requires'
var angular;
var app = angular.module('snapchat', ['ionic']);
var lol;
var localStorage;
var navigator;
var onSuccess;
var onFail;
var ft;
var win;
var fail;
var options;
var params;
var FileTransfer;
var alert;
var console;
var logged;
// Simple POST request example (passing data) :

/* _______________________CONTROLLERS*/
app.controller('InscriptionController', function ($scope, $http) {
    "use strict";
    $scope.signUp = function () {
        $http.post('http://remikel.fr/api.php?option=inscription', {'email': $scope.email, 'password': $scope.password}).success(function (data) {
            if (data.error === false) {
                $scope.error = "Inscription réussit, veuillez vous connecté";
            } else {
                $scope.error = data.error;
            }
        }).error(function (data) {
            $scope.error = data.error;
        });
    };
});

app.controller('ConnexionController', function ($scope, $http, $location) {
    "use strict";
    $scope.signIn = function () {
        $http.post("http://remikel.fr/api.php?option=connexion", {'email': $scope.email, 'password': $scope.password}).success(function (data) {
            if (data.error === false) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('email', $scope.email);
                $location.path('/');
            } else {
                $scope.error = data.error;
            }

        }).error(function (data) {
            $scope.error = data.error;
        });
    };
});
app.controller('SnapController', function ($scope, $location, $http, $rootScope) {
    "use strict";
    $scope.pic = function () {
        function onSuccess(imageURI) {
            $rootScope.imageSRC = imageURI;
            $scope.$apply();
        }
        navigator.camera.getPicture(onSuccess, onFail, {quality: 50, targetWidth: 400, targetHeight: 400 });
    };
    $scope.sendTo = function () {
        $http.post("http://remikel.fr/api.php?option=toutlemonde", {'email': localStorage.email, 'token': localStorage.token }).success(function (data) {
            $scope.contact = data.data;
            $location.path('sendto');
        }).error(function (data) {
            $scope.error = data.error;
        });
    };
    $scope.send = function ($id) {
        console.log($id);
        options = {
            fileKey: "file",
            fileName: "image.jpeg",
            mimeType: "image/jpeg"
        };

        params = {
            email: localStorage.email,
            u2: $id,
            temps: 10,
            token: localStorage.token
        };
        console.log($rootScope.imageSRC);
        options.params = params;

        win = function win() {
            $location.path('/');
        };
        fail = function fail(err) {
            console.log('non' + err);
        };

        ft = new FileTransfer();
        ft.upload($rootScope.imageSRC, encodeURI("http://remikel.fr/api.php?option=image"), win, fail, options);
        $location.path('/');
    };

    $scope.logout = function () {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        $location.path('connexion');
    };
});

app.controller('ContactController', function ($scope, $http) {
    "use strict";
    $http.post("http://remikel.fr/api.php?option=toutlemonde", {'email': localStorage.email, 'token': localStorage.token }).success(function (data) {
        $scope.contact = data.data;
    }).error(function (data) {
        $scope.error = data.error;
    });
});

app.controller('ViewController', function ($scope, $http) {
    "use strict";
    $http.post("http://remikel.fr/api.php?option=newsnap", {'email': localStorage.email, 'token': localStorage.token }).success(function (data) {
        $scope.snap = data.data;
        console.log($scope.snap);
    }).error(function (data) {
        $scope.error = data.error;
    });
});

/*_________________________ROUTE_______________________________*/
app.config(function ($stateProvider, $urlRouterProvider) {
    "use strict";
    var connect = function ($q, $location) {
        var deferred = $q.defer();
        if (localStorage.token) {
            deferred.resolve();
        } else {
            deferred.reject();
            lol = setTimeout(function () {
                $location.path('connexion');
            }, 0);
        }
        return deferred.promise;
    };
    logged = function ($q, $location) {
        var deferred = $q.defer();
        if (!localStorage.token) {
            deferred.resolve();
        } else {
            deferred.reject();
            $location.path('/');
        }
        return deferred.promise;
    };

    $urlRouterProvider.otherwise('/');

    $stateProvider.state('inscription', {
        url: '/inscription',
        templateUrl: 'templates/home.html',
        controller : "InscriptionController",
        resolve: {
            connected : logged
        }
    });

    $stateProvider.state('connexion', {
        url: '/connexion',
        templateUrl: 'templates/connexion.html',
        controller : "ConnexionController",
        resolve: {
            connected : logged
        }
    });

    $stateProvider.state('snap', {
        url: '/',
        templateUrl: 'templates/snap.html',
        controller : "SnapController",
        resolve: {
            connected : connect
        }
    });

    $stateProvider.state('contact', {
        url: '/contact',
        templateUrl: 'templates/contact.html',
        controller : "ContactController",
        resolve: {
            connected : connect
        }
    });

    $stateProvider.state('sendto', {
        url: '/sendto',
        templateUrl: 'templates/sendTo.html',
        controller : "SnapController",
        resolve: {
            connected : connect
        }
    });
    $stateProvider.state('view', {
        url: '/view',
        templateUrl: 'templates/view.html',
        controller : "ViewController",
        resolve: {
            connected : connect
        }
    });
});