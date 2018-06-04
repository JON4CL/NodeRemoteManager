angular.module('sendFile', ['ngFileUpload', 'ui.bootstrap', 'dialogs.main'])
        .controller('SendFileController', ['$scope', '$http', 'Upload', 'dialogs', '$q', function ($scope, $http, Upload, dialogs, $q) {
                // UPLOADER FUNCTIONS
                $scope.$watch('files', function () {
                    $scope.upload($scope.files);
                });
                $scope.upload = function (files) {
                    $scope.files = files;
                };
                $scope.uploadAll = function () {
                    //VALIDAR SI SE SELECCIONO UN DIRECTORIO
                    if ($scope.Path === "") {
                        dialogs.error(
                                'Directorio Invalido.',
                                'Seleccione un directorio.',
                                {animation: true, backdrop: true, keyboard: true, windowClass: 'full-center', size: 'sm'}
                        );
                        return;
                    } else {
                        var dlg = dialogs.confirm(
                                'Desea continuar?',
                                'Desea enviar los elementos?',
                                {animation: true, backdrop: true, keyboard: true, windowClass: 'full-center', size: 'sm'}
                        );
                        dlg.result.then(function (btnYes) {
                            if ($scope.files && $scope.files.length) {
                                $scope.progressPercent = 0;
                                $scope.progressCount = 0;
                                $q.all($scope.files.map(function (thing) {
                                    var deferred = $q.defer();
                                    var prom = Upload.upload({
                                        url: '/api/uploadfile',
                                        data: {file: thing},
                                        params: {finalPath: $scope.Path}
                                    });
                                    prom.then(function (resp) {
                                        $scope.progressPercent = parseInt(100.0 / $scope.files.length * (++$scope.progressCount));
                                    });
                                    deferred.resolve(prom);
                                    return deferred.promise;
                                })).then(function (responses) {
                                    var resultLog = '<table class="table  table-condensed table-bordered">';
                                    for (i = 0; i < responses.length; i++) {
                                        if (responses[i].data.error_code === 0) {
                                            resultLog = resultLog +
                                                    '<tr class="success"><td>' +
                                                    '<span class="glyphicon glyphicon-ok-sign" aria-hidden="true" style="color:green"></span> ' + responses[i].config.data.file.name + '</div>' +
                                                    '</td></tr>';
                                        } else {
                                            resultLog = resultLog +
                                                    '<tr><td>' +
                                                    '<span class="glyphicon glyphicon-remove-sign" aria-hidden="true" style="color:red"></span> ' + responses[i].config.data.file.name + '</div>' +
                                                    '</td></tr>' +
                                                    '<tr class="danger"><td>' + responses[i].data.err_desc +
                                                    '</td></tr>';
                                        }
                                    }
                                    resultLog = resultLog + '</table>';

                                    var dlg = dialogs.notify(
                                            'Proceso completo.',
                                            'La tarea se ha completado con el siguiente resultado:</BR>' +
                                            resultLog,
                                            {animation: true, backdrop: true, keyboard: true, windowClass: 'full-center'}
                                    );
                                    dlg.result.then(function (btn) {
                                        //CLEAN ALL
                                        $scope.ShowData("");
                                        $scope.files = [];
                                        $scope.Path = "";
                                        $scope.progressPercent = 0;
                                    }, function (btn) {
                                        //EMPTY
                                    });
                                });
                            }
                        }, function (btnNo) {
                            //EMPTY
                        });
                    }
                };
                $scope.removeItem = function (itemHash) {
                    var dlg = dialogs.confirm(
                            'Remover elemento?',
                            'Desea remover este elemento de la lista?',
                            {animation: true, backdrop: true, keyboard: true, windowClass: 'full-center', size: 'sm'}
                    );
                    dlg.result.then(function (btnYes) {
                        angular.forEach($scope.files, function (obj, index) {
                            if (obj.$$hashKey === itemHash) {
                                $scope.files.splice(index, 1);
                                return;
                            }
                        });
                    }, function (btnNo) {
                        //EMPTY
                    });
                    return;
                };
                $scope.removeAllItems = function () {
                    var dlg = dialogs.confirm(
                            'Remover elementos?',
                            'Desea remover todos los elementos de la lista?',
                            {animation: true, backdrop: true, keyboard: true, windowClass: 'full-center', size: 'sm'}
                    );
                    dlg.result.then(function (btnYes) {
                        $scope.files = [];
                    }, function (btnNo) {
                        //EMPTY
                    });
                    return;
                };
                $scope.Path = "";
                $scope.showReturn = false;
                $scope.showDrives = false;
                $scope.DetailsDrives = [];
                $scope.DetailsFiles = [];
                $scope.ShowData = function (param, type) {
                    if (param !== "") {
                        if (type === "D") {
                            $scope.ListFolders(param);
                        }
                    } else {
                        $scope.GetDrives();
                    }
                };
                $scope.GetDrives = function () {
                    $http.post('/api/getdrives')
                            .then(function (resp) {
                                //HIDE FILE LIST
                                $scope.showReturn = false;
                                $scope.DetailsFiles = [];
                                //SHOW DRIVE LIST
                                $scope.DetailsDrives = [];
                                $scope.DetailsDrives = resp.data;
                                $scope.showDrives = true;
                            }, function (err) {
                                dialogs.error(
                                        'Error.',
                                        'Error no controlado.<br>' +
                                        JSON.stringify(err.data),
                                        {animation: true, backdrop: true, keyboard: true, windowClass: 'full-center', size: 'sm'}
                                );
                            });
                };
                $scope.ListFolders = function (path) {
                    var fullPath = "";
                    //HIDE DRIVE LIST
                    $scope.DetailsDrives = [];
                    $scope.showDrives = false;
                    //NORMALIZA DIRECTORIO
                    if (path) {
                        fullPath = path.trim();
                        if (fullPath.length > 0 && !fullPath.endsWith("\\")) {
                            fullPath += "\\";
                        }
                    }
                    //COMPLETA EL PATH CON EL DRILLDOWN SELECCIONADO
                    //O RETORNA UN NIVEL
                    if (fullPath.indexOf("..") !== -1) {
                        fullPath = fullPath.substr(0, fullPath.length - 3);
                        fullPath = fullPath.split('\\').slice(0, -2).join('\\');
                        if (fullPath === "") {
                            $scope.Path = "";
                            $scope.ShowData("");
                            $scope.DetailsFiles = [];
                            return;
                        } else {
                            fullPath += "\\";
                        }
                    }

                    $scope.Path = fullPath;
                    var data = {
                        Path: fullPath,
                        Folders: "Y",
                        Files: "Y"
                    };
                    var config = {
                        //NONE
                    };
                    $http.post('/api/listfiles', data, config)
                            .then(function (resp) {
                                $scope.showReturn = true;
                                $scope.DetailsFiles = [];
                                $scope.DetailsFiles = resp.data;
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
                $scope.formatBytes = function (bytes, decimals) {
                    if (bytes === 0 || bytes === "" || bytes === "0") {
                        return '0 Byte';
                    }
                    var k = 1000; // or 1024 for binary
                    var dm = decimals + 1 || 3;
                    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
                    var i = Math.floor(Math.log(bytes) / Math.log(k));
                    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
                };
                //INIT DISPLAY
                $scope.ShowData("");
            }]);