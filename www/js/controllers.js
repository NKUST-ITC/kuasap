var api_server = "";
var backup_sever = "";

//api_server = "http://localhost:5000/";
//api_server = "http://192.168.0.193:5000/";
api_server = "http://kuas.grd.idv.tw:14768/";
backup_server = "http://api.grd.idv.tw:14768/";

android_version = "1.3.10.1";
ios_version = "1.3.2";

relogin_quote = "請點選右上方齒輪重新登入";


versionCompare = function(left, right) {
    if (typeof left + typeof right != 'stringstring')
        return false;
    
    var a = left.split('.')
    ,   b = right.split('.')
    ,   i = 0, len = Math.max(a.length, b.length);
        
    for (; i < len; i++) {
        if ((a[i] && !b[i] && parseInt(a[i]) > 0) || (parseInt(a[i]) > parseInt(b[i]))) {
            return 1;
        } else if ((b[i] && !a[i] && parseInt(b[i]) > 0) || (parseInt(a[i]) < parseInt(b[i]))) {
            return -1;
        }
    }
    
    return 0;
};



angular.module('starter.controllers', ['ionic', 'LocalStorageModule'])


.controller('AppCtrl', function($scope, $rootScope, $window, $ionicModal) {
    $scope.main = {
        is_login: false,
        func: "",
        server_status: [false, 400, 400]
    };



    $scope.score_select = [{'text': '103學年度第1學期', 'value': '103,1'}, {'text': '102學年度第1學期', 'value': '102,1'}, {'text': '102學年度第2學期', 'value': '102,2'}, {'text': '102學年度暑修', 'value': '102,4'}, {'text': '101學年度第1學期', 'value': '101,1'}, {'text': '101學年度第2學期', 'value': '101,2'}, {'text': '101學年度寒修', 'value': '101,3'}, {'text': '101學年度暑修', 'value': '101,4'}, {'text': '100學年度第1學期', 'value': '100,1'}, {'text': '100學年度第2學期', 'value': '100,2'}, {'text': '100學年度寒修', 'value': '100,3'}, {'text': '100學年度暑修', 'value': '100,4'}, {'text': '99學年度第1學期', 'value': '99,1'}, {'text': '99學年度第2學期', 'value': '99,2'}, {'text': '99學年度寒修', 'value': '99,3'}, {'text': '99學年度暑修', 'value': '99,4'}, {'text': '98學年度第1學期', 'value': '98,1'}, {'text': '98學年度第2學期', 'value': '98,2'}, {'text': '98學年度寒修', 'value': '98,3'}, {'text': '98學年度暑修', 'value': '98,4'}];
    $rootScope.arg01 = "103";
    $rootScope.arg02 = "1";

    $ionicModal.fromTemplateUrl('templates/select.html', function(modal) {
        $scope.modalCtrl = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-up',
        focusFirstInput: true
    });

    $scope.modalData = {
        "score_msg" : '103學年度第1學期',
        "course_msg": '103學年度第1學期',
        "leave_msg" : '103學年度第1學期',
    };

    $scope.changeArgs = function(arg01, arg02) {
        $rootScope.arg01 = arg01;
        $rootScope.arg02 = arg02;
    };

    $scope.openModal = function(func) { 
        $scope.modalCtrl.show();
        $scope.main.func = func;
    };

    $scope.facebook = function() {
        if (ionic.Platform.isAndroid()) {
            appAvailability.check(
                'com.facebook.katana', // URI Scheme
                function() {           // Success callback
                    window.open('fb://profile/100000257989689', '_system', 'location=no');   
                },
                function() {           // Error callback
                    window.open('https://facebook.com/louie.lu.180', '_system', 'location=no');      
                }
            );
        } else if (ionic.Platform.isIOS()) {
            appAvailability.check(
                'fb://', // URI Scheme
                function() {           // Success callback
                    window.open('fb://profile/100000257989689', '_system', 'location=no');   
                },
                function() {           // Error callback
                    window.open('https://facebook.com/louie.lu.180', '_system', 'location=no');      
                }
            );
        } else {
            window.open('https://facebook.com/louie.lu.180', '_system', 'location=no');
        };
    };

    $scope.github = function() {
        window.open("https://www.github.com/grapherd", '_system', 'location=no');
    };
})



.controller('ModalCtrl', function($scope, $rootScope,AuthFactory) {

  $scope.hideModal = function() {
    $scope.modalCtrl.hide();
  };
  
  $scope.changeArgs = function(item, msg) {
    $rootScope.arg01 = item.value.split(",")[0];
    $rootScope.arg02 = item.value.split(",")[1];

    if ($scope.main.func == "score") {
        $scope.modalData.score_msg = item.text;
        $rootScope.score();
    } else if ($scope.main.func == "course") {
        $scope.modalData.course_msg = item.text;
        $rootScope.course();
    } else if ($scope.main.func == "leave") {
        $scope.modalData.leave_msg = item.text;
        $rootScope.leave();
    }

    $scope.modalCtrl.hide();
  };
  
})


.factory('AuthFactory', function($q, $http, $rootScope, localStorageService) {
    var factory = {};

    factory.is_login = function() {
        return $http({
            url: api_server + 'ap/is_login',
            method: "POST"
        });
    };

    factory._is_login = function() {
        var defer = $q.defer();
        $http({
            url: api_server + 'ap/is_login',
            method: "POST"
        })
        .success(function(data) {
            if (data == "true") {
                defer.resolve(1);
            } else {
                defer.resolve(0);
            }
        })
        .error(function() {
            defer.resolve(-1);
        });

        return defer.promise;
    };


    factory.logout= function() {
        var defer = $q.defer();
        $http({
            url: api_server + 'ap/logout',
            method: "POST"
        })
        .success(function() {
            defer.resolve(1);
        });

        return defer.promise;
    };

    factory.checkVersion = function() {
        if (ionic.Platform.isIOS()) {
            return $http({
                url: api_server + "ios_version",
                method: "GET"
            });
        } else {
            return $http({
                url: api_server + "android_version",
                method: "GET"
            });
        }
    };

    factory.checkFixed = function() {
        return $http.get(backup_server + "fixed");
    };

    factory.checkBackup = function() {
        return $http.get(backup_server + "backup");
    };

    factory.checkServerStatus = function() {
        return $http.get(api_server + "status")
    }


    factory.login = function(username, password) {
        return $http({
            url: api_server + "ap/login",
            method: "POST",
            data: $.param({
                "username": username,
                "password": password
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    };

    factory.course = function() {
        return $http({
            url: api_server + "ap/query",
            method: "POST",
            data: $.param({
                "fncid": "ag222",
                "arg01": $rootScope.arg01,
                "arg02": $rootScope.arg02
            }),
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        });
    };

    factory.score = function() {
        return $http({
            url: api_server + "ap/query",
            method: "POST",
            data: $.param({
                "fncid": "ag008",
                "arg01": $rootScope.arg01,
                "arg02": $rootScope.arg02,
                "arg03": localStorageService.get("username")
            }),
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        });
    };

    factory.leave = function() {
        return $http({
            url: api_server + "leave",
            method: "POST",
            data: $.param({
                "arg01": $rootScope.arg01,
                "arg02": $rootScope.arg02
            }),
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        });
    };

    factory.bus_query = function(date) {
        return $http({
            url: api_server + "bus/query",
            method: "POST",
            data: $.param({
                "date": date
            }),
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        });
    };

    factory.bus_booking = function(busId, action) {
        return $http({
            url: api_server + "bus/booking",
            method: "POST",
            data: $.param({
                "busId": busId,
                "action": action
            }),
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        });
    };

    return factory;
})


.controller("AuthCtrl", function($q, $scope, $rootScope, $window, $ionicPopup, localStorageService, AuthFactory) {
    $scope.version = ionic.Platform.isIOS() ? ios_version : android_version;
    $scope.username = localStorageService.get("username");
    $scope.password = localStorageService.get("password");
    $scope.remember_password = localStorageService.get("remember") == "1" ? true : false;
    $scope.is_fixed = "";


    $scope.forceUpdate = function() {
        var store = ionic.Platform.isIOS() ? "Apple Store" : "Google Play";
        var version = ionic.Platform.isIOS() ? ios_version : android_version;

        console.log(store);
        console.log(api_server);


        AuthFactory.checkVersion()
        .success(function(store_version) {
            if (versionCompare(store_version, version) > 0) {
                console.log(store_version, version);
                $ionicPopup.confirm({
                    title: "檢測到新版本的高應校務通",
                    template: " \
                     <div class='alert-dialog'> \
                     要到 " + store + " 安裝新版嗎？</div>",
                     okText: "安裝新版本",
                     cancelText: "離開程式"
                }).then(function(res) {
                    if (res) {
                        if (ionic.Platform.isIOS()) {
                            $window.location = "https://itunes.apple.com/tw/app/gao-ying-xiao-wu-tong/id893131497?l=zh&mt=8";
                        } else {
                            $window.location = "market://details?id=com.kuas.ap";
                        }
                    } else {
                        ionic.Platform.exitApp();
                    }
                });
            }
        });
    };

    $scope.is_login = function() {
        var defer = $q.defer();
        AuthFactory.is_login()
        .success(function(data) {
            console.log(data == "true");
            if (data == "true") {
                defer.resolve(1);
            } else {
                defer.resolve(0);
            }
        })
        .error(function() {
            defer.resolve(-1);
        });

        return defer.promise;
    };

    $scope.checkBackupOnline = function() {
        AuthFactory.checkBackup()
        .success(function(data) {
            if (data == '1') {
                api_server = backup_server;
                console.log(api_server);
            }
        });
    };

    $scope.checkFixed = function() {
        AuthFactory.checkFixed()
        .success(function(data) {
            $scope.is_fixed = data;
        });
    };

    $scope.checkLogin = function() {
        $scope.is_login()
        .then(function(data) {
            if (data == 1) {
                $scope.main.is_login = true;
            } else {
                $scope.main.is_login = false;
            }
        });
    };

    $scope.checkServerStatus = function() {
        $scope.main.server_status = [false, 400, 400];
        AuthFactory.checkServerStatus()
        .success(function(data) {
            $scope.main.server_status = data;
        });
    };

    $scope.triggleRememberPassword = function() {
        $scope.remember_password = !$scope.remember_password;
    };

    $scope.logout = function() {
        console.log("logout");
        AuthFactory.logout()
        .then(function() {
            $scope.main.is_login = false;
        });
    };


    $scope.login = function() {
        AuthFactory.login($scope.username, $scope.password)
        .success(function(data) {
            if (data == "true") {
              $scope.main.is_login = "You have login";
              $rootScope.username = $scope.username;

              // Save username to localStorage when login.
              localStorageService.set("username", $scope.username);

              // Save password to localStorage when remember_password is checked
              if ($scope.remember_password === true) {
                localStorageService.set("remember", "1");
                localStorageService.set("password", $scope.password);
              } else {
                localStorageService.set("remember", "0");
                localStorageService.set("password", "");
              }

            } else {
              $scope.main.is_login = false;
              window.plugins.toast.showShortBottom('登入失敗，請在嘗試一次');
            }

        })
        .error(function (response, data, status, header) {
            $scope.checkFixed();
            if (data == "404" || data == "500") {
                window.plugins.toast.show("伺服器出現問題，請稍候嘗試");
            } else {
                window.plugins.toast.show("網路不穩定問題，請稍候嘗試...");
            }
        });
    };

    $scope.course = function() {
        // Show prepare and hide function
        $scope.prepare = true;
        $scope.loading = true;

        // Check is login ?
        var promise = $scope.is_login();
        promise.then(function(data) {
            console.log(data);
            if (data === 0) {
                $scope.quote = relogin_quote;

                // Dirty hack, need fix......
                $scope.loading = true;

                return;
             } else if (data == -1) {
                window.plugins.toast.show("網路不穩定問題，請稍候嘗試...");
                return;
            } else {
                // Start loading
                $scope.loading = true;


                // Start fetching data
                AuthFactory.course()
                .success(function(data) {
                    if (data != "false") {
                        $scope.prepare = false;
                        $scope.content = data;
                    }
                })
                .error(function(e) {
                    $scope.loading = true;
                    $scope.main.is_login = false;
                    console.log($scope.main.is_login);
                });
            }
        });
    };
    $rootScope.course = $scope.course;

    $scope.score = function() {
        // Show prepare and hide function
        $scope.prepare = true;
        $scope.loading = true;


        // Check is login ?
        var promise = $scope.is_login();
        promise.then(function(data) {
            console.log(data);
            if (data === 0) {
                $scope.loading = true;
                $scope.quote = relogin_quote;
                return;
             } else if (data == -1) {
                // NEED to be implanted, $scope.network_error = true;
                $scope.loading = true;
                $scope.quote = "伺服器出現問題，請稍候再嘗試一次";
                window.plugins.toast.show("網路不穩定問題，請稍候嘗試...");
                return;
            } else {
                // Start loading
                $scope.loading = true;

                // Start fetching data
                AuthFactory.score()
                .success(function(data) {
                    if (data != "false") {
                        $scope.prepare = false;
                        $scope.content = data;
                    }
                })
                .error(function(e) {
                    $scope.loading = true;
                });
            }
        });
    };
    $rootScope.score = $scope.score;

    $scope.leave = function() {
        // Show prepare and hide function
        $scope.prepare = true;
        $scope.loading = true;


        // Check is login ?
        var promise = $scope.is_login();
        promise.then(function(data) {
            if (data === 0) {
                $scope.quote = relogin_quote;

                // Dirty hack, need fix......
                $scope.loading = true;

                return;
             } else if (data == -1) {
                $window.plugins.toast.show("網路不穩定問題，請稍候嘗試...");
                return;
            } else {
                // Start loading
                $scope.loading = true;

                // Start fetching data
                AuthFactory.leave()
                .success(function(data) {
                    $scope.prepare = false;
                    $scope.content = data;
                })
                .error(function(e) {
                    $scope.loading = true;
                    $scope.main.is_login = false;
                });
            }
        }); 
    };
    $rootScope.leave = $scope.leave;

})

.controller("CourseCtrl", function($scope, $ionicPopup, $window) {
    $scope.course_time = {"M": "", "第1節": "08:10 - 09:00", "第2節": "09:10 - 10:00", "第3節": "10:10 - 11:00", "第4節": "11:10 - 12:00", "A": "", "第5節": "13:30 - 14:20", "第6節": "14:30 - 15:20", "第7節": "15:30 - 16:20", "第8節": "16:30 - 17:20", "B": "", "第11節": "18:30 - 19:20", "第12節": "19:25 - 20:15", "第13節": "20:20 - 21:00", "第14節": "21:15 - 22:05"};

 
    $scope.showTime = function(i) {
        if ($scope.course_time[i] !== "") {
            $window.plugins.toast.showShortBottom(i + ": " + $scope.course_time[i]);
        }
    };
    
    $scope.showCourse = function(course_name, course_teacher, course_classroom) {
        var coursePopup = $ionicPopup.alert({
            content: " \
            <div class='alert-dialog'> \
                <p>課程名稱: " + course_name + 
                "<p>授課老師: " + course_teacher + 
                "<p>教室位置: " + course_classroom + 
           "</div>"
        });
    };
})

.controller("ScoreCtrl", function($scope, $ionicPopup) {

})


.controller("BusCtrl", function($scope, $ionicPopup, $window, AuthFactory) {
    //$scope.data = [{'EndEnrollDateTime': '2014-06-29 16:20', 'endStation': '燕巢', 'busId': '22567', 'reserveCount': '7', 'runDateTime': '07:20', 'isReserve': '-1', 'limitCount': '999'}, {'EndEnrollDateTime': '2014-06-29 17:50', 'endStation': '燕巢', 'busId': '22627', 'reserveCount': '17', 'runDateTime': '08:50', 'isReserve': '-1', 'limitCount': '999'}, {'EndEnrollDateTime': '2014-06-30 08:00', 'endStation': '燕巢', 'busId': '22687', 'reserveCount': '0', 'runDateTime': '13:00', 'isReserve': '-1', 'limitCount': '999'}, {'EndEnrollDateTime': '2014-06-29 17:00', 'endStation': '建工', 'busId': '22747', 'reserveCount': '0', 'runDateTime': '08:00', 'isReserve': '-1', 'limitCount': '999'}, {'EndEnrollDateTime': '2014-06-30 07:15', 'endStation': '建工', 'busId': '22807', 'reserveCount': '1', 'runDateTime': '12:15', 'isReserve': '-1', 'limitCount': '999'}, {'EndEnrollDateTime': '2014-06-30 11:45', 'endStation': '建工', 'busId': '22867', 'reserveCount': '23', 'runDateTime': '16:45', 'isReserve': '-1', 'limitCount': '999'}];
    $scope.data = [];
    $scope.before_date = "";
    $scope.no_bus = false;
    $scope.collapsed = true;
    $scope.loading = false;

    $scope.init = function() {
        AuthFactory.is_login()
        .success(function(data) {
            if (data == "true") {
                $scope.main.is_login = "true";
            } else {
                $scope.main.is_login = false;
                $scope.quote = relogin_quote;
            }
        });

        return "true";
    };

    $scope.get_today = function() {
        var date = new Date();
         
        // GET YYYY, MM AND DD FROM THE DATE OBJECT
        var yyyy = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();
         
        // CONVERT mm AND dd INTO chars
        var mmChars = mm.split('');
        var ddChars = dd.split('');
         
        // CONCAT THE STRINGS IN YYYY-MM-DD FORMAT
        var datestring = yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]);

        $scope.date = datestring;
    };

    $scope.slideToggle = function(date) {
        if (date != $scope.before_date) {
            $scope.collapsed = !$scope.collapsed;
        }

        if (date && date != $scope.before_date) {
            $scope.loading = true;
            AuthFactory.bus_query(date)
            .success(function(data) {
                $scope.data = data;
                $scope.no_bus = $scope.data.length ? false: true;
                $scope.before_date = date;
                $scope.loading = false;
            });
        }
    };

    $scope.change_src = function(src) {
        if (src == 'j') {
            $scope.jiangong = true;
            $scope.yanchao = false;
        } else if (src == 'y') {
            $scope.jiangong = false;
            $scope.yanchao = true;
        }
    };

    $scope.get_src = function() {
        return $scope.source;
    };

    $scope.book = function(d) {
        action = d['isReserve'];
        busId = d['busId'];
        runDate = d['runDateTime'];

        $ionicPopup.confirm({
            title: "確定要 " + (!~action ? "預定" : "取消") + " 本校車車次？",
            template: "<div class='alert-dialog'><p>" + (!~action ? '要預定從' : '要取消從')  + (d['endStation'] == '燕巢' ? '建工到燕巢</p>' : '燕巢到建工</p>') + d['Time'] + " 的校車嗎?</div>",
            okText: !~action ? "預定校車" : "取消校車",
            cancelText: "返回"
        }).then(function(res) {
            if (!res) {
                return;
            } else {
                if (!~action) {
                    AuthFactory.bus_booking(busId, "")
                    .success(function(data) {
                        $window.plugins.toast.showShortBottom(unescape(JSON.parse(data)));
                    });

                } else {
                    AuthFactory.bus_booking(runDate, "un")
                    .success(function(data) {
                        $window.plugins.toast.showShortBottom(unescape(JSON.parse(data)));
                    });
                }

                AuthFactory.bus_query($scope.before_date)
                .success(function(data) {
                    $scope.data = [];
                    $scope.data = data;
                    $scope.no_bus = $scope.data.length ? false: true;
                });
            }
        });

    };
})

.controller("EventsCtrl", function($scope, $http, $ionicPopup, $ionicScrollDelegate) {
    $scope.title = "";
    $scope.phones = [
        {"title": "高雄應用科技大學總機", "number": "(07) 381-4526"},
        {"title": "建工校安專線", "number": "0916-507-506"},
        {"title": "燕巢校安專線", "number": "0925-350-995"},
        {"title": "事務組", "number": "(07) 381-4526 #2650"},
        {"title": "營繕組", "number": "(07) 381-4526 #2630"},
        {"title": "課外活動組", "number": "(07) 381-4526 #2525"},
        {"title": "諮商輔導中心", "number": "(07) 381-4526 #2541"},
        {"title": "圖書館", "number": "(07) 381-4526 #3100"},
        {"title": "建工校外賃居服務中心", "number": "(07) 381-4526 #3420"},
        {"title": "燕巢校外賃居服務中心", "number": "(07) 381-4526 #8615"},
    ];

    $scope.schedules = [{'events': ['(9/8) 中秋節放假一天', '(9/9- 9/11) 日間部新生始業輔導', '(9/9- 9/11) 日間部新生體檢', '(9/12) 教學研討會 （導師會議、導師輔導知能研習）'], 'week': '預備週'}, {'events': ['(9/15) 日間部、進修推廣處開學'], 'week': '第一週'}, {'events': ['(10/10) 國慶日 放假 一天'], 'week': '第四週'}, {'events': ['(10/26) 校運會', '(10/30) 校慶放假一天', '(10/31) 校運會補假ㄧ天'], 'week': '第七週'}, {'events': ['(11/10 ～ 11/15) 日間部、進修推廣處期中考試'], 'week': '第九週'}, {'events': ['(11/17) 103 學年度第一次校務會議'], 'week': '第十週'}, {'events': ['(1/1) 開國紀念日放假ㄧ天', '(1/2) 調整放假'], 'week': '第十六週'}, {'events': ['(1/5) 103 學年度第二次校務會議'], 'week': '第十七週'}, {'events': ['(1/12 ～ 1/17) 日間部、進修推廣處期末考試'], 'week': '第十八週'}, {'events': ['(2/18 - 23) 春節放假'], 'week': '預備週'}, {'events': ['(2/23) 補假一天(補2/21春節初三)', '(2/24) 教學研討會（導師會議、導師輔導知能研習）', '(2/25) 日間部、進修推廣處開學', '(2/27) 補假一天(補2/28和平紀念日)'], 'week': '第一週'}, {'events': ['(4/3) 補假一天(補4/4兒童節)'], 'week': '第六週'}, {'events': ['(4/6) 補假一天(補4/5民族掃墓節)'], 'week': '第七週'}, {'events': ['(4/20 ～ 4/25) 日間部、進修推廣處期中考試'], 'week': '第九週'}, {'events': ['(4/27) 103 學年度第三次校務會議'], 'week': '第十週'}, {'events': ['(6/13) 畢業典禮'], 'week': '第十六週'}, {'events': ['(6/19) 補假一天(補6/20端午節)', '(6/15) 103 學年度第四次校務會議'], 'week': '第十七週'}, {'events': ['(6/24~6/30) 日間部、進修推廣處期末考試'], 'week': '第十八週'}];
    
    $scope.news = [];
    $scope.page = 1;

    $scope.change_title = function(title) {
        $scope.title = title;
    };

    $scope.change_page = function(action) {
        if (action > 0) {
            $scope.page += 1;
        } else if (action < 0) {
            $scope.page -= 1;
            if ($scope.page < 1) {
                $scope.page = 1;
                return;
            }
        }
        $scope.notification();
        $ionicScrollDelegate.scrollTop();
    };

    $scope.notification = function() {
        $scope.title = "最新消息";
        $scope.loading = true;
        $scope.quote = "";
        $http.get(api_server + "notification/" + $scope.page)
        .success(function(data) {
            $scope.news = data;
            $scope.loading = false;
        })
        .error(function(data) {
            $scope.quote = "網路不給力，無法讀取最新消息";
        });
    };

    $scope.to_link = function(link) {
        window.open(link, '_system', 'location=no');
    };


    $scope.dial = function(phone) {
        number = phone.number.replace(" #", ",");
        $ionicPopup.confirm({
            title: "撥出電話",
            template: "<div class='alert-dialog'>確定要撥給「" + phone.title + "」?</div>",
            okText: "撥出",
            cancelText: "返回"
        }).then(function(res) {
            if (!res) {
                return;
            } else {
                if (ionic.Platform.isAndroid()) {
                    document.location.href = "tel:" + number;
                }
            }
        });

    };
});