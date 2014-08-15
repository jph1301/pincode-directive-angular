myModule = angular.module("myModule", []);

myModule.directive("pinCode", function () {
    return {
        restrict: 'E',
        templateUrl: '../directiveTemplate.html',
        controller: function ($scope, $element, $http) {
            /*
             message.type = 0 for success
             message.type = 1 for failure

             */
            $scope.message = {};

            /* use $http  service or something to get this password from db or something and
             than store it in the same manner as below */


            $scope.attempted = 0;
            $scope.numbers = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
            /* for digit printing */
            $scope.selected = [];

            /*  method called for password matching  , getting true or false as a response from
            route /password sending password and matching at server

            */
            $scope.matchPassword = function () {
               var url_to_get_password = 'password';
                $http.post(url_to_get_password, {"password": $scope.selected.join("")}).success(function (data) {

                    $scope.response = data.success;
                }).then(function () {

                    if ($scope.response) {

                        $scope.message.type = 0;
                        $scope.message.text = 'Success,Password Matched.';
                        setTimeout(function () {
                            $scope.clearAll();
                            $scope.$digest();

                        }, 2000);
                    }

                });



            }

        },
        link: function (scope, el, attr) {
            $scope = scope;
            $element = el;
            scope.attempts = el.attr("attempts") || 3;
            scope.howMany = el.attr("length") || 4;
            scope.dots = [];
            scope.loginTitle = el.attr("loginTitle") || 'My pin';
            for (a = 0; a < scope.howMany; a++) {
                scope.dots.push(a);
            }

            /*  looking the screen when no of attempts exceeds                                        */
            scope.lockPin = function () {
                el.find("ul").eq(1).css({display: "none"});
                $scope.message = {};
                $scope.message.type = 1;
                $scope.message.text = 'Your phone is locked';
                //$scope.$digest();

            };


            /* clearing the attempts(dots) / entered attempts */
            $scope.clearAll = function () {
                $scope.message = {};
                $scope.selected = [];
                el.find("ul").find("li").removeClass('filled');

            };

            /* main function of this directing incrementing attempts checking for lenght etc and calling match password etc*/
            $scope.selectDigit = function (num) {
                if($scope.selected.length<$scope.howMany)
                el.find("ul").find("li").eq($scope.selected.length).addClass('filled');

                $scope.selected.push(num);
                $scope.matchPassword()


                $scope.howMany = $element.attr("length");

                if ($scope.selected.length >= $scope.howMany) {
                    $scope.message = {};

                    if (!$scope.matchPassword()) {
                        $scope.message.type = 1;
                        //$scope.message.text = 'you cant enter more than ' + $scope.howMany + ' characters';
                        $scope.message.text = 'Password Didint matched';

                        setTimeout(function () {
                            $scope.clearAll();

                            console.log($scope.attempted);
                            if ($scope.attempts == $scope.attempted) {
                                $scope.lockPin();
                            }
                            $scope.attempted++;
                            $scope.message = {};
                            $scope.$digest();

                        }, 2000);
                    }
                    else {

                        $scope.message.type = 0;
                        $scope.message.text = 'Success, Password Matched.';
                        setTimeout(function () {
                            $scope.clearAll();
                            $scope.$digest();

                        }, 2000);
                    }
                }


            };


        }
    };

});

