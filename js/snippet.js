function update() {

            plot.setData([x_plot, y_plot, z_plot]);

            plot.setupGrid();

            plot.draw();
            timeout = setTimeout(update, 10); // in milliseconds
        }

        update();


// Set up start/stop button
    $('#start_timer_button').on('click', function(e){
        e.preventDefault();
        if ($(this).hasClass('stop_button')) {
            // stop graph updates
            clearTimeout(timeout);

// Global variable?
// Set up Firebase reference for sensor data
var firebaseSensorData = new Firebase("https://quantifiedpony.firebaseio.com/");
var timeout;


// Example simple, resizeable Flot chart



    $(function () {
        var x = [[0, -3.761590156], [10, -3.761590156], [20, -3.761590156], [30, -3.761590156], [40, -0.726490566], 
                    [50, -0.726490566], [60,-0.726490566], [70, -0.726490566], [80, -3.806630856], [90, -3.806630856],
                    [100, -3.806630856], [110, -3.806630856], [120, -3.806630856], [130, -4.948665048]];

        var y = [[0, -9.103203469], [10, -9.103203469], [20, -9.103203469], [30, -9.103203469], [40, -16.60229214],
                    [50, -16.60229214], [60, -16.60229214], [70, -16.60229214], [80, -8.17574961], [90, -8.17574961], 
                    [100, -8.17574961], [110, -8.17574961], [120, -8.17574961], [130, -7.631817067]];
     
        var z = [[0, 4.644751221], [10, 4.644751221], [20, 4.644751221], [30, 4.644751221], [40, 0.161608612],
                    [50, 0.161608612], [60, 0.161608612], [70, 0.161608612], [80, 4.532822293], [90, 4.532822293],
                    [100, 4.532822293], [110, 4.532822293], [120, 4.532822293], [130, 0.473752507]];
        
        $.plot($("#placeholder"), [ x, y, z ]);
        
        window.onresize = function(event) {
            $.plot($("#placeholder"), [ x, y, z ]);
        }


    });