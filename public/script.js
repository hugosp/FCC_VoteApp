var ansNr = 3;

$(document).ready(function() {
    $('#more').click(function(){
        $(".addform").append('<span class="label">Answer '+ansNr+'<input type="text" name="answer">');
        ansNr++;
    });

    $('.indexTopic').click(function(){
        window.location.href = '/view/'+$(this).attr('data-id');
    });

    $('.vote').click(function() {
        var cId = $(this).attr('data-canvasID');
        var id = $(this).attr('data');
        $.ajax({
            url: '/vote/' + id,
            success: function(result) {
                (result.error == false) ?  draw(cId) : alert(result.message);
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
                        maintainAspectRatio: true,
                        responsive: true,
                    }
                });
            }
        });
    }
});
