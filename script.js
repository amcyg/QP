/* TO DO

1) learn how to "read" Firebase data
2) make sensor data visible in observer mode (via text)
3) send sensor data to Flot real time plot
4) redirect data to python script for step counting
5) send scalar accelerometer points to Flot real time plot
6) display step counts in real time
7) figure out how to save "runs"
8) figure out how to "replay" runs

Other things:
*Address random bug, where start/stop button won't work if you toggle
back to observe mode, only to work again if you cycle through the toggle again.

*Ask for a code review - refactor code to make it more modular?

*/


// Control text display based on toggle position
function toggleswitch(state){
    if(state=='observe'){
        document.getElementById("observe_mode").style.display="block";
        document.getElementById("ride_mode").style.display="none";
        document.getElementById("start_mode").style.display="none";
        sensorPlot();
    }
    else if(state=='ride'){
        document.getElementById("observe_mode").style.display="none";
        document.getElementById("ride_mode").style.display="block";
        document.getElementById("start_mode").style.display="none";
        sensorTest();
    }
}


// Pull data off sensors
function sensorTest(){

    // Set up Firebase reference for sensor data
    var firebaseSensorData = new Firebase("https://quantifiedpony.firebaseio.com/");

    firebaseSensorData.set({
      milliseconds: [],
      x: [],
      y: [],
      z: [],
      alpha: [],
      beta: [],
      gamma: []
    });

    // set up sensor data object
    var sensorData = {
        "milliseconds": [],
        "x": [],
        "y": [],
        "z": [],
        "alpha": [],
        "beta": [],
        "gamma": []
    };

    console.log("successfully created the SensorData dictionary");

    // Set up start/stop button
    $('#start_timer_button').on('click', function(e){
        e.preventDefault();
        if ($(this).hasClass('stop_button')) {
                $(this).text('start').removeClass('stop_button');
                // Insert what happens when user presses stop button
                gyro.stopTracking();
                document.getElementById("sensor_data").innerHTML = 
                    "Tracking stopped. <br/>" 
                    + "x: " + sensorData.x[sensorData.x.length-1] + "<br/>"
                    + "y: " + sensorData.y[sensorData.y.length-1] + "<br/>"
                    + "z: " + sensorData.z[sensorData.z.length-1] + "<br/>"
                    + "alpha: " + sensorData.alpha[sensorData.alpha.length-1] + "<br/>"
                    + "beta: " + sensorData.beta[sensorData.beta.length-1] + "<br/>"
                    + "gamma: " + sensorData.gamma[sensorData.gamma.length-1];
                console.log(sensorData);
        } else {
            $(this).text('stop').addClass('stop_button');
            // Insert what happens when user presses start button
            gyro.frequency = 10;
            milliseconds = 0;
            gyro.startTracking(function(o) {
                document.getElementById("sensor_data").innerHTML =
                    "x: " + o.x + "<br/>"
                    + "y: " + o.y + "<br/>"
                    + "z: " + o.z + "<br/>"
                    + "alpha: " + o.alpha + "<br/>" 
                    + "beta: " + o.beta + "<br/>" 
                    + "gamma: " + o.gamma;
                
                    sensorData.milliseconds.push(milliseconds);
                    sensorData.x.push(o.x);
                    sensorData.y.push(o.y);
                    sensorData.z.push(o.z);
                    sensorData.alpha.push(o.alpha);
                    sensorData.beta.push(o.beta);
                    sensorData.gamma.push(o.gamma);

                    firebaseSensorData.push({
                        milliseconds: [milliseconds],
                        x: [o.x],
                        y: [o.y],
                        z: [o.z],
                        alpha: [o.alpha],
                        beta: [o.beta],
                        gamma: [o.gamma]
                    });

                    milliseconds = milliseconds + gyro.frequency;
            });
        }
    });
}


function collectData(sensorData){
    if(window.DeviceMotionEvent==undefined){
        document.getElementById("sensor_data").innerHTML = "Sorry, no sensor data found."
    }
    else { 
        gyro.frequency = 10; // 10 ms = 100 Hz
        milliseconds = 0;
        gyro.startTracking(function(o) {
            // o.x, o.y, o.z for accelerometer
            // o.alpha, o.beta, o.gamma for gyro
            document.getElementById("sensor_data").innerHTML = 
                "x: " + o.x + "<br/>" 
                + "y: " + o.y + "<br/>" 
                + "z: " + o.z + "<br/>" 
                + "alpha: " + o.alpha + "<br/>" 
                + "beta: " + o.beta + "<br/>" 
                + "gamma: " + o.gamma
            sensorData.milliseconds.push(milliseconds);
            sensorData.x.push(o.x);
            sensorData.y.push(o.y);
            sensorData.z.push(o.z);
            sensorData.alpha.push(o.alpha);
            sensorData.beta.push(o.beta);
            sensorData.gamma.push(o.gamma);
            //sensorData.push([milliseconds, o.x, o.y, o.z, o.alpha, o.beta, o.gamma]);
            //console.log(sensorData);
            milliseconds = milliseconds + gyro.frequency;
        });
    }
}

// Chart dummy data using Flot
function sensorPlot(){

    $(function () {
        // var time = [0, 10, 20, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140];

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
}