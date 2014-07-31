/* TO DO

accomplished:
x) learn how to "read" Firebase data
x) make sensor data visible in observer mode (via text)
x) send sensor data to Flot real time plot
x) fix seizure inducing quality of the real time plot

**AHHH THE SHINY BUTTON CSS ISN'T WORKING ANYMORE***

o) Set a "start/stop" button Firebase reference in observer mode to control data collection
o) redirect data to python script for step counting
o) send scalar accelerometer points to Flot real time plot
o) display step counts in real time
o) figure out how to save "runs"
o) figure out how to "replay" runs

Random bugs:
Start/stop button won't work if you toggle to observe mode and come back to ride mode. Will magically
fix itself when you toggle between modes again. 

Shiny button CSS isn't working anymore. :()


*/


// Set up Firebase reference for sensor data
var firebaseSensorData = new Firebase("https://quantifiedpony.firebaseio.com/");
var timeout;

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

    firebaseSensorData.set({
        milliseconds: [],
        x: [],
        y: [],
        z: [],
        alpha: [],
        beta: [],
        gamma: []
    });

    console.log("successfully created firebaseSensorData object")

    // Set up local sensor data object (for temporary testing purposes)
    var sensorData = {
        "milliseconds": [],
        "x": [],
        "y": [],
        "z": [],
        "alpha": [],
        "beta": [],
        "gamma": []
    };

    console.log("successfully created the sensorData object");

   // Set up start/stop button
    $('#start_timer_button').on('click', function(e){
        if ($(this).hasClass('stop_button')) {
            // stop graph updates
            clearTimeout(timeout);
            $(this).text('start').removeClass('stop_button');
            // Insert what happens when user presses stop button
            gyro.stopTracking();
            // Display last collected raw data point upon pressing 'stop'
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
                // Display raw data in text format (will probably remove this later)
                document.getElementById("sensor_data").innerHTML =
                    "x: " + o.x + "<br/>"
                    + "y: " + o.y + "<br/>"
                    + "z: " + o.z + "<br/>"
                    + "alpha: " + o.alpha + "<br/>" 
                    + "beta: " + o.beta + "<br/>" 
                    + "gamma: " + o.gamma;
                
                    // Push data to local JS object for easy reference (will probably remove this later)
                    sensorData.milliseconds.push(milliseconds);
                    sensorData.x.push(o.x);
                    sensorData.y.push(o.y);
                    sensorData.z.push(o.z);
                    sensorData.alpha.push(o.alpha);
                    sensorData.beta.push(o.beta);
                    sensorData.gamma.push(o.gamma);

                    // Push data to Firebase reference
                    firebaseSensorData.push({
                        milliseconds: [milliseconds],
                        x: [o.x],
                        y: [o.y],
                        z: [o.z],
                        alpha: [o.alpha],
                        beta: [o.beta],
                        gamma: [o.gamma]
                    });

                    // Time is measured incrementally, not using datetime - might not be accurate
                    // Should I implement this differently?
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
            
            milliseconds = milliseconds + gyro.frequency;
        });
    }
}


function sensorPlot(){
    var x_plot = [];
    var y_plot = [];
    var z_plot = [];
    var alpha_plot = [];
    var beta_plot = [];
    var gamma_plot = [];
    
    // Grab data from Firebase
    firebaseSensorData.on('child_added', function(snapshot) {
        var readData = snapshot.val();
        x_read = readData.x;
        y_read = readData.y;
        z_read = readData.z;
        alpha_read = readData.alpha;
        beta_read = readData.beta;
        gamma_read = readData.gamma;
        ms_read = readData.milliseconds;

        // Display data in text format
        document.getElementById("read_data").innerHTML =
                "x: " + x_read + "<br/>"
                + "y: " + y_read + "<br/>"
                + "z: " + z_read + "<br/>"
                + "alpha: " + alpha_read + "<br/>" 
                + "beta: " + beta_read + "<br/>" 
                + "gamma: " + gamma_read;

        // Push to plotting data in x, y format (time, sensor value)
        x_plot.push([ms_read, x_read]);
        y_plot.push([ms_read, y_read]);
        z_plot.push([ms_read, z_read]);
        alpha_plot.push([ms_read, alpha_read]);
        beta_plot.push([ms_read, beta_read]);
        gamma_plot.push([ms_read, gamma_read]);

        });
        
        // Plot data
        var plot = $.plot("#placeholder", [ x_plot, y_plot, z_plot ], {
            series: {
                shadowSize: 0   // Drawing is faster without shadows
            },
            yaxis: {
                min: -20,
                max: 20
            },
            xaxis: {
                show: true
            }

        });

        function update() {

            plot.setData([x_plot, y_plot, z_plot]);

            plot.setupGrid();

            plot.draw();
            timeout = setTimeout(update, 10); // in milliseconds
        }

        update();

}