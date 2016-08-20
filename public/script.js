var ansNr = 3;

$(document).ready(function() {
    $('#more').click(function(){
        $(".addform").append('<span class="label">Answer '+ansNr+'<input type="text" name="answer">');
        ansNr++;
    });

    $('.ans').click(function() {
        var cId = $(this).attr('data-canvasID');
        var id = $(this).attr('data');
        var ans = $(this).html();
        var nuffer = $(this).attr('data-votes');

        $.ajax({
            url: '/vote/' + id + '/' + ans,
            success: function(result) {
                console.log(id + ' : '+ans);
                nuffer++;
                //$(this).html(nuffer);
                $(this).attr('data-votes',nuffer);
                draw(cId);
                console.log(nuffer);
            }
        });
    });

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
                Chart.defaults.global.legend.display = false;
                //Chart.defaults.global.tooltips.enabled = false;
                var myChart = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: labels,
                        datasets: [{
                            data: data,
                            backgroundColor: [
                                'rgba(217, 102, 102, 0.9)',
                                'rgba(129, 172, 139, 0.9)',
                                'rgba(242, 229, 162, 0.9)',
                                'rgba(248, 152, 131, 0.9)',
                                'rgba(153, 102, 255, 0.9)',
                                'rgba(255, 159, 64, 0.9)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        title: {
                            display: true,
                            text: result[0].question,
                            fontColor: 'white',
                            fontSize: 22,
                            fontStyle: 'Normal',
                            fontFamily: "'Roboto','Helvetica Neue','Helvetica','Arial',sans-serif"
                        },
                        maintainAspectRatio: true,
                        responsive: false,
                    }
                });
            }
        });
    }
});
