angular.module('mqttCtrl', ['angularMoment'])

    .controller('mqttController', function($scope, $firebaseArray, $http) {
        
        var vm = this;
        $scope.time = moment().format('LLLL');

        var current_time = new moment ().format("HH:mm");

        vm.name ='Marcelo';

        client = new Paho.MQTT.Client("m12.cloudmqtt.com", Number(30310), "esp8266");
        // set callback handlers
        client.onConnectionLost = onConnectionLost;
        client.onMessageArrived = onMessageArrived;


        // connect the client
        var options = {
            useSSL: true,
            userName: "bpfkktrd",
            password: "zdu9SCC_2duo",
            cleanSession: true,
            onSuccess:onConnect,
            onFailure:doFail
        }

        //client.connect({onSuccess:onConnect});
        client.connect(options);

        $scope.statusMqtt = 'Conectando ao servidor Mqtt...'

        // called when the client connects
        function onConnect() {
            // Once a connection has been made, make a subscription and send a       message.
            $scope.statusMqtt = 'Conectado'
            //console.log("Conectado ao Broker com sucesso");
            client.subscribe("io.m2m/arduino/lightsensor");
            client.subscribe("v1/devices/me/telemetry");
            client.subscribe("owntracks/bpfkktrd/J7");
            client.subscribe("wemos");

            //message = new Paho.MQTT.Message("Hello");
            //message.destinationName = "World";
            //client.send(message);
        }

        function doFail(){
            //console.log("dofail");
            $scope.statusMqtt = 'Conexão Perdida'
        }
        // called when the client loses its connection
        function onConnectionLost(responseObject) {
            if (responseObject.errorCode !== 0) {
                //console.log("onConnectionLost:"+responseObject.errorMessage);
                //console.log('Broker desconectado...')
            }
        }

        // called when a message arrives
        function onMessageArrived(message) {

            //console.log('Message Arrived: ' + message.payloadString);
            //console.log('Topic:     ' + message.destinationName);

            if (message.destinationName == "wemos"){
                //console.log("wemos: " + message.payloadString);
                var wemos = angular.fromJson(message.payloadString);
                $scope.wemos = wemos;
                //console.log($scope.wemos);

                $scope.luz = wemos.luz;

                if($scope.luz == 0){
                    $scope.statusLuz = 'OFF'
                }else{
                    $scope.statusLuz = 'ON'
                }
            }


            if(message.destinationName == 'v1/devices/me/telemetry'){
                var temp = angular.fromJson(message.payloadString);
                $scope.temp = temp;
                //console.log($scope.temp);
                $scope.temperatura = temp.temperature;
                $scope.umidade = temp.humidity;

                if( $scope.temperatura > 40){
                    swal({
                            title: "Que calor esta fazendo",
                            text: "Deseja ligar o ar condicionado?",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonClass: "btn-danger",
                            confirmButtonText: "Sim, ligar!",
                            cancelButtonText: "Não, agora não!",
                            closeOnConfirm: false,
                            closeOnCancel: false
                        },
                        function(isConfirm) {
                            if (isConfirm) {
                                swal("Deleted!", "Your imaginary file has been deleted.", "success");
                            } else {
                                swal("Cancelled", "Your imaginary file is safe :)", "error");
                            }
                        });
                }

            }

            if(message.destinationName == 'owntracks/bpfkktrd/J7'){
                //console.log("wemos: " + message.payloadString);
                var gps = angular.fromJson(message.payloadString);
                $scope.gps = gps;
                //console.log($scope.gps);
                $scope.bateria = gps.batt;
                var data = gps.tst;

                $scope.data = new Date(data * 1000)

                var mapOptions = {
                    zoom: 15,
                    center: new google.maps.LatLng(gps.lat, gps.lon),
                    mapTypeId: google.maps.MapTypeId.SATTELITE,

                    scrollwheel: false, // Disable Mouse Scroll zooming (Essential for responsive sites!)
                    // All of the below are set to true by default, so simply remove if set to true:
                    panControl:false, // Set to false to disable
                    mapTypeControl:false, // Disable Map/Satellite switch
                    scaleControl:false, // Set to false to hide scale
                    streetViewControl:false, // Set to disable to hide street view
                    overviewMapControl:false, // Set to false to remove overview control
                    rotateControl:false // Set to false to disable rotate control
                }

                $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

                $scope.markers = [];

                var cities = [
                    {
                        city : 'Casa',
                        desc : 'Minha residência!' + gps.tst,
                        lat : -16.715971,
                        long : -49.368871
                    },
                    {
                        city : 'Marcelo',
                        desc : 'Ultima localização: ' + $scope.data,
                        lat : gps.lat,
                        long : gps.lon
                    }
                ];

                var infoWindow = new google.maps.InfoWindow();

                var createMarker = function (info){

                    var marker = new google.maps.Marker({
                        map: $scope.map,
                        position: new google.maps.LatLng(info.lat, info.long),
                        title: info.city
                    });
                    marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';

                    google.maps.event.addListener(marker, 'click', function(){
                        infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                        infoWindow.open($scope.map, marker);
                    });

                    $scope.markers.push(marker);

                }

                for (i = 0; i < cities.length; i++){
                    createMarker(cities[i]);
                }

                $scope.openInfoWindow = function(e, selectedMarker){
                    e.preventDefault();
                    google.maps.event.trigger(selectedMarker, 'click');
                }

            }

        }


        $scope.liga = function() {
            message = new Paho.MQTT.Message("0");
            message.destinationName = "/ESP/LED";
            client.send(message);
        };

        $scope.desliga = function() {
            message = new Paho.MQTT.Message("1");
            message.destinationName = "/ESP/LED";
            client.send(message);
        };
    });

