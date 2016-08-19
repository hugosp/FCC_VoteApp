$(document).ready(function() {


    //draw('57b61e14399e2b156f2ceded');

    $("canvas").each(function(index) {
        draw($(this).attr('id'));
    });

    function draw(id) {
        $.ajax({
            url: "/poll/" + id,
            success: function(result) {
                var ctx = $('#' + id);
                var data = [],
                    labels = [];

                for (var i = 0; i < result[0].answers.length; i++) {
                    data.push(result[0].answers[i].votes);
                    labels.push(result[0].answers[i].answer);
                }

                var myChart = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: labels,
                        datasets: [{
                            data: data,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.5)',
                                'rgba(54, 162, 235, 0.5)',
                                'rgba(255, 206, 86, 0.5)',
                                'rgba(75, 192, 192, 0.5)',
                                'rgba(153, 102, 255, 0.5)',
                                'rgba(255, 159, 64, 0.5)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        maintainAspectRatio: true,
                        responsive: false,
                    }
                });
            }
        });
    }
});
