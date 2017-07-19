angular.module('firebaseCtrl', ['chart.js'])

    .controller('firebaseController', function($scope, $firebaseArray, $http) {

        var vm = this;

        vm.name ='Marcelo';


        var firebaseRef = new Firebase('https://esp8266-50b55.firebaseio.com');

        firebaseRef.child('.info/connected').on('value', function(connectedSnap) {
            if (connectedSnap.val() === true) {
                //console.log('Conectado ao firebase')
                $scope.statusFirebase = 'Conectado'
            } else {
                //console.log('Não esta conectado ao Firebase')
                $scope.statusFirebase = 'Conectando ao servidor Firebase......'
            }
        });

        $http.get("https://esp8266-50b55.firebaseio.com/temperatura.json").then(function(res) {
            var resultado = res.data;
            //console.log(resultado)
        });




        var ref = new Firebase("https://esp8266-50b55.firebaseio.com/temperatura").limitToFirst(10);

        $scope.dados = $firebaseArray(ref);

        dados = $firebaseArray(ref);

        var dias= [];
        var horas = [];
        var temperaturas = [] ;
        var umidades = [];
        var result = [];

        dados.$loaded()
            .then(function(){
                angular.forEach(dados, function(data) {
                    var dados = data;
                    dias.push(dados.data);
                    horas.push(dados.hora);
                    temperaturas.push(dados.temperatura);
                    umidades.push(dados.umidade);
                })

                result.push(dias);
                result.push(horas);
                result.push(temperaturas);
                result.push(umidades);
                resut = JSON.stringify(result);
                //console.log(result[1]);

                $scope.labels = result[1];
                $scope.series = ['Temperatura', 'Umidade'];

                $scope.date = [
                    result[2],
                    result[3]
                ];

                var ctx = document.getElementById("myChart").getContext('2d');
                var myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: result[1],
                        datasets: [{
                            label: 'Temperatura',
                            data: result[2],
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255,99,132,1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero:true
                                }
                            }]
                        }
                    }
                });
            });
    });

