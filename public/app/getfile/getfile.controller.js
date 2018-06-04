angular.module('getFile', ['ui.bootstrap', 'dialogs.main'])
        .controller('GetFileController', ['$scope', '$http', 'dialogs', '$window', function ($scope, $http, dialogs, window) {
                $scope.Path = "";
                $scope.showReturn = false;
                $scope.showDrives = false;
                $scope.DetailsDrives = [];
                $scope.DetailsFiles = [];

                $scope.ShowData = function (param, type) {
                    if (param !== "") {
                        if (type === "D") {
                            $scope.ListFiles(param);
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
                $scope.ListFiles = function (path) {
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
                        Path: fullPath
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

                $scope.confirmDownload = function (filePath, fileName) {
                    var dlg = dialogs.confirm(
                            'Desea continuar?',
                            'Desea descargar el archivo seleccionado?',
                            {animation: true, backdrop: true, keyboard: true, windowClass: 'full-center', size: 'sm'}
                    );
                    dlg.result.then(function (btnYes) {
                        $http({
                            url: '/api/getfile?Path=' + filePath + fileName,
                            method: "GET",
                            headers: {
                                'Content-type': 'application/json'
                            },
                            responseType: "arraybuffer"
                        })
                                .then(function (resp) {
                                    if (window.navigator.msSaveOrOpenBlob) {
                                        var blob = new Blob([resp.data], {type: 'application/binary'}); //csv data string as an array.
                                        // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
                                        window.navigator.msSaveBlob(blob, fileName);
                                    } else {
                                        var file = new Blob([resp.data], {type: 'application/binary'});
                                        var fileURL = URL.createObjectURL(file);
                                        var link = document.createElement('a');
                                        document.body.appendChild(link);
                                        link.setAttribute("type", "hidden");
                                        link.href = fileURL;
                                        link.download = fileName;
                                        link.click();
                                    }
                                }, function (err) {
                                    var error = JSON.parse(arrayBufferToString(err.data));
                                    dialogs.error(
                                            'Error.',
                                            'Error al obtener el archivo.<br>' +
                                            'ERR_NUM:' + error.errno + ' CODIGO:' + error.code,
                                            {animation: true, backdrop: true, keyboard: true, windowClass: 'full-center', size: 'sm'}
                                    );
                                });
                    }, function (btnNo) {
                        //EMPTY
                    });
                    return;
                };

                $scope.ShowData("");
            }]);