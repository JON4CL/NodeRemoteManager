angular.module('eventLog', ['ui.bootstrap', 'dialogs.main'])
        .controller('eventlogController', ['$scope', '$http', 'dialogs', function ($scope, $http, dialogs) {
                $scope.eventList = [];
                //ARRAY RELATED TO DROPDOWN FOR VIEW FILTER
                //$scope.eventTypeFilter = [];
                //$scope.logTypeFilter = [];
                $scope.panelTypeByEventType = [
                    "panel-success",
                    "panel-danger",
                    "panel-warning",
                    "panel-info",
                    "panel-success",
                    "panel-danger"
                ];
                $scope.getFormatedDateToService = function (inputFormat) {
                    function pad(s) {
                        return (s < 10) ? '0' + s : s;
                    }
                    var d = new Date();
                    if (inputFormat) {
                        d = new Date(inputFormat);
                    }
                    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
                };
                $scope.formatTimeToUser = function (time) {
                    //20170113154640.000000-000
                    var year = time.substring(0, 4);
                    var month = time.substring(4, 6);
                    var day = time.substring(6, 8);
                    var hour = time.substring(8, 10);
                    var min = time.substring(10, 12);
                    var sec = time.substring(12, 14);
                    return "" + year + "/" + month + "/" + day + " " + hour + ":" + min + ":" + sec;
                };
                $scope.init = function () {
                    //INIT DATEPICKER
                    $('#startDate').datepicker({
                        format: 'dd/mm/yyyy',
                        todayHighlight: true,
                        autoclose: true,
                        endDate: $scope.getFormatedDateToService(),
                        defaultDate: $scope.getFormatedDateToService()
                    });
                    $('#endDate').datepicker({
                        format: 'dd/mm/yyyy',
                        todayHighlight: true,
                        autoclose: true,
                        endDate: $scope.getFormatedDateToService(),
                        defaultDate: $scope.getFormatedDateToService()
                    });
                    $('#startDate').data("datepicker").setDate($scope.getFormatedDateToService());
                    $('#endDate').data("datepicker").setDate($scope.getFormatedDateToService());
                    //GET EVENTS FROM THE DAY
                    $scope.getEvents();
                    //INIT EVENTTYPE LIST
                    $(document).on("click", ".labelCheck", function (event) {
                        var $target = $(event.currentTarget);
                        var val = $target.attr('data-value');
                        var $inp = $target.find('input');
                        if ($inp.prop('checked')) {
                            setTimeout(function () {
                                $inp.prop('checked', false);
                                $('.showLogFile-' + val).addClass("ng-hide");
                                $('.showEventType-' + val).addClass("ng-hide");
                            }, 0);
                        } else {
                            setTimeout(function () {
                                $inp.prop('checked', true);
                                $('.showLogFile-' + val).removeClass("ng-hide");
                                $('.showEventType-' + val).removeClass("ng-hide");
                            }, 0);
                        }
                        $(event.target).blur();
                        return false;
                    });
                };
                $scope.eventSourceList = [];
                $scope.fillEventSourceList = function (data) {
                    $scope.eventSourceList = [];
                    data.forEach(function (item, index, arr) {
                        if ($scope.eventSourceList.count === 0) {
                            $scope.eventSourceList.push(item.Logfile);
                        } else {
                            if ($scope.eventSourceList.indexOf(item.Logfile) === -1) {
                                $scope.eventSourceList.push(item.Logfile);
                            }
                        }
                    });
                };
                $scope.getEvents = function () {
                    //console.log("getEvents");
                    $scope.eventList = [];
                    var startDate = $scope.getFormatedDateToService($('#startDate').data("datepicker").getDate());
                    var endDate = $scope.getFormatedDateToService($('#endDate').data("datepicker").getDate());
                    //console.log(startDate);
                    //console.log(endDate);

                    var data = {
                        startDate: startDate,
                        endDate: endDate
                    };
                    var config = {
                        //NONE
                    };
                    $http.post('/api/geteventlog', data, config)
                            .then(function (resp) {
                                //console.log(resp.data);
                                $scope.eventList = [];
                                $scope.fillEventSourceList(resp.data);
                                $scope.eventList = resp.data;
                            }, function (err) {
                                dialogs.error(
                                        'Error.',
                                        'Error no controlado.<br>' +
                                        JSON.stringify(err.data),
                                        {animation: true, backdrop: true, keyboard: true, windowClass: 'full-center', size: 'sm'}
                                );
                                $scope.showReturn = false;
                                $scope.DetailsFiles = [];
                            });
                };
                //INIT DISPLAY
                $scope.init();
            }]);