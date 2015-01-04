angular.module('adminModule')
        .controller('DeviceCtrl', function ($scope, $log, $routeParams, $location, Restangular) {
            $log.debug("Device Detail Controller *******************************");

            $scope.timeStart = [];
            $scope.timeEnd = [];
            for (var i = 0; i < 24; i++)
                $scope.timeStart.push(i);
            for (var i = 0; i < 60; i++)
                $scope.timeEnd.push(i);
            $scope.uniqueId = $routeParams.uniqueId;

            Restangular.one('device', $scope.uniqueId).get().then(function (device) {
                console.log(device);
                $scope.device = device; // Assign the result

                $scope.startHour = moment($scope.device.timeStart).hour();
                $scope.startMinute = moment($scope.device.timeStart).minute();
                $scope.endHour = moment($scope.device.timeEnd).hour();
                $scope.endMinute = moment($scope.device.timeEnd).minute();

                if ($scope.device.override === "HAYIR")
                    $scope.disableTime = true;
                else
                    $scope.disableTime = false;
            }, function () {
                $scope.back2Admin();
            });


            $scope.isCheckboxSelected = function () {
                if ($scope.device == null)
                    return false;
                var sonuc = $scope.device.override === "HAYIR";
                return sonuc;
            };

            // Save updated details of the device
            $scope.saveDevice = function (device) {

                var timeZoneOffset = new Date().getTimezoneOffset();
                var difHour = timeZoneOffset / 60;
                var difMin = timeZoneOffset % 60;
                var dateStart = new Date();
                dateStart.setHours($scope.startHour - difHour);
                dateStart.setMinutes($scope.startMinute - difMin);

                var dateEnd = new Date();
                dateEnd.setHours($scope.endHour - difHour);
                dateEnd.setMinutes($scope.endMinute - difMin);
                device.timeStart = dateStart;
                device.timeEnd = dateEnd;
                
                
                // Debug purposes
                console.log("Saving device: ");
                console.log(device);
                device.route = device.route + "/" + device.uniqueId;
                console.log(device.route);

                // Update device itself
                $scope.device.save().then(function (data) {
                    console.log("Device is successfully updated: " + data);
                    $scope.back2Admin();
                }, function (data) {
                    console.log("Error! Failed to update device: " + data);
                });
            };

            $scope.deleteDevice = function () {
                console.log("sil");
                Restangular.one('device', $scope.device.uniqueId).remove().then(function () {
                    console.log("silme başarılı");
                    $scope.back2Admin();
                });
            };

            // Return back to device listing main page
            $scope.back2Admin = function () {
                $location.path("/dashboard");
            };
        });