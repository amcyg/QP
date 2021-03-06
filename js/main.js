// Set up Firebase references (main + buttons + data)
var firebaseMain = new Firebase("https://quantifiedpony.firebaseio.com/");
var firebaseStartStop = firebaseMain.child('buttons/startstop');
var firebaseSensorData = firebaseMain.child('data');
var firebaseSavedRuns = firebaseMain.child('saved');
var firebaseFileName = firebaseMain.child('filename');

// Set timeout to prevent plot 'seizure mode'
var timeout;

// Default Firebase button state
firebaseStartStop.set('stop');


// Set up sensor data collection
firebaseSensorData.set([]);

// Set up local sensor data object (for temporary testing purposes)
var sensorData = {
    "milliseconds": [],
    "time_in_ms": [],
    "x": [],
    "y": [],
    "z": [],
    "alpha": [],
    "beta": [],
    "gamma": []
};

// Control text display based on toggle position
function toggleswitch(state) {
    $('body').removeClass('splash');

    if (state === 'observe') {
        document.getElementById("observe_mode").style.display = "block";
        document.getElementById("ride_mode").style.display = "none";
        document.getElementById("start_mode").style.display = "none";
        sensorPlot();
    } else if (state === 'ride') {
        document.getElementById("observe_mode").style.display = "none";
        document.getElementById("ride_mode").style.display = "block";
        document.getElementById("start_mode").style.display = "none";
        sensorTest();
    }
}

// RIDE MODE: Pull data off sensor
function sensorTest() {

    // Set up Firebase listener for button state
    firebaseStartStop.on("value", function (snapshot) {
        // For STOP button
        if (snapshot.val() === 'stop') {
            // Stop graph updates
            clearTimeout(timeout);
            // Stop pulling data from sensor
            gyro.stopTracking();
            // Display last collected raw data point upon pressing 'stop'
            document.getElementById("sensor_data").innerHTML = 
                "Tracking stopped.<br/>" 
                + "x: " + sensorData.x[sensorData.x.length - 1] + "<br/>"
                + "y: " + sensorData.y[sensorData.y.length - 1] + "<br/>"
                + "z: " + sensorData.z[sensorData.z.length - 1] + "<br/>"
                + "alpha: " + sensorData.alpha[sensorData.alpha.length - 1] + "<br/>"
                + "beta: " + sensorData.beta[sensorData.beta.length - 1] + "<br/>"
                + "gamma: " + sensorData.gamma[sensorData.gamma.length - 1];
            // If data was collected, save it to Firebase
            if (sensorData.milliseconds.length > 0) {
                // Set Firebase save button to true
                saveData(sensorData);
            }
        }

        // For START button
        if (snapshot.val() === 'start') {
            gyro.frequency = 10;
            milliseconds = 0;
            gyro.startTracking(function (o) {
                // Display raw data in text format (will probably remove this later)
                var now = Date.now();
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
                sensorData.time_in_ms.push(now);

                // Push data to Firebase reference
                firebaseSensorData.push({
                    milliseconds: milliseconds,
                    x: o.x,
                    y: o.y,
                    z: o.z,
                    alpha: o.alpha,
                    beta: o.beta,
                    gamma: o.gamma,
                    time_in_ms: now
                });

                milliseconds = milliseconds + gyro.frequency;
        });
        
        }
    });
}

// OBSERVE MODE: Plot data collected by sensor in ride mode
function sensorPlot() {
    var x_plot = [];
    var y_plot = [];
    var z_plot = [];
    var acceleration_plot = [];
    var alpha_plot = [];
    var beta_plot = [];
    var gamma_plot = [];

    // Set up Firebase-linked remote start/stop button
    $('#start_timer_button').on('click', function(e){
        // If user presses 'stop' button, do this!
        if ($(this).hasClass('stop_button')) {
            // Set Firebase button reference to 'stop'
            firebaseStartStop.set('stop');
            $(this).text('start').removeClass('stop_button');
  
        // If user presses 'start' button, do this!
        } else {
            // Set Firebase button reference to 'start'
            firebaseFileName.set(prompt("File name: ", "Demo Day Test"));
            firebaseStartStop.set('start');
            $(this).text('stop').addClass('stop_button');
        }
    });

    // Set up showing and hiding previous runs
    firebaseSavedRuns.on('value', function(snapshot){
        var html = ""
        snapshot.forEach( function(childSnapshot) { 
            var file_name = childSnapshot.val().file_name;
            console.log(file_name);
            html += "<div class='file'><a onclick='readData(\"" + childSnapshot.name() + "\")'>" + file_name + "</a><span onclick='firebaseDelete(\"" + childSnapshot.name() + "\")' class=\"glyphicon glyphicon-remove\"></span></div>";
        });
        document.getElementById("previous_runs").innerHTML = html;
    });

    var stepCounter = null;

    firebaseStartStop.on("value", function (snapshot) {
        if (snapshot.val() == 'start') {
            stepCounter = new StepCounter();
        }
    });

    var lastFrame = new Date().getTime();

    // Grab data from Firebase
    firebaseSensorData.on('child_added', function(point_snapshot) {
        var readData = point_snapshot.val();
        x_read = readData.x;
        y_read = readData.y;
        z_read = readData.z;
        alpha_read = readData.alpha;
        beta_read = readData.beta;
        gamma_read = readData.gamma;
        ms_read = readData.milliseconds;

        var x = stepCounter.push(readData);
        var acceleration = x[0];
        var steps = x[1];

        // Display steps
        document.getElementById("show_steps").innerHTML = "<b>Steps: " + steps + "</b>";

        // Push to plotting data in x, y format (time, sensor value)
        x_plot.push([ms_read, x_read]);
        y_plot.push([ms_read, y_read]);
        z_plot.push([ms_read, z_read]);
        acceleration_plot.push([ms_read, acceleration]);
        alpha_plot.push([ms_read, alpha_read]);
        beta_plot.push([ms_read, beta_read]);
        gamma_plot.push([ms_read, gamma_read]);

        // Update Flot chart every 25 ms
        if (new Date().getTime() - lastFrame > 25) {
            update();
            lastFrame = new Date().getTime();
        };
    });
    
    // Plot data
    var plot = $.plot("#placeholder", [ x_plot, y_plot, z_plot, acceleration_plot ], {
        series: {
            shadowSize: 0   // Drawing is faster without shadows
        },
        yaxis: {
            // min: -20,
            // max: 20
            // commented out so that Flot adjusts y-axis automatically
        },
        xaxis: {
            show: true
        }

    });

    function update() {
        plot.setData([x_plot, y_plot, z_plot, acceleration_plot ]);

        plot.setupGrid();

        plot.draw();
    }
    update();

}

function saveData( sensorData ) {

    // Convert sensorData to JSON string
    stringifiedSensorData = JSON.stringify(sensorData);

    // Compress using LZW encoding
    compressedSensorData = lzw_encode(stringifiedSensorData);

    // Push to Firebase
    firebaseFileName.once("value", function(snapshot) {
        firebaseSavedRuns.push({
            file_name: snapshot.val(),
            json_string: compressedSensorData,
            time_in_ms: new Date().getTime()
        });
    });
}

function firebaseDelete( snapshotID ) {
    firebaseSavedRuns.child(snapshotID).remove();
}

// Replaying data in Flot
function readData( snapshotID ) {
    var stepCounter = new StepCounter();

    // Pull from Firebase
    firebaseSavedRuns.child(snapshotID).once("value", function(snapshot) {
        // Decompress using LZW encoding
        var decoded = lzw_decode(snapshot.child('json_string').val());
        // Convert JSON string to raw sensorData (JSON.parse)
        var parsed = JSON.parse(decoded);

        var x_plot = [], y_plot = [], z_plot = [], a_plot = [];

        var plot = $.plot("#placeholder", [ x_plot, y_plot, z_plot, a_plot ], {
            series: {
                shadowSize: 0   // Drawing is faster without shadows
            },
            yaxis: {
                // min: -20,
                // max: 20
                // commented out so that Flot adjusts y-axis automatically
            },
            // Set x-axis bounds to the bounds of the data
            xaxis: {
                show: true,
                min: parsed.milliseconds[0],
                max: parsed.milliseconds[parsed.milliseconds.length-1]
            }

        });

        plot.setupGrid();

        plot.draw();

        var i = 0;

        // Every 10 ms, take a point from the loaded data and put it into the plot
        var timer = setInterval(function() {
            x_plot.push([parsed.milliseconds[i], parsed.x[i]]);
            y_plot.push([parsed.milliseconds[i], parsed.y[i]]);
            z_plot.push([parsed.milliseconds[i], parsed.z[i]]);

            var temp = stepCounter.push({x: parsed.x[i], y: parsed.y[i], z: parsed.z[i]})
            var acceleration = temp[0];
            var steps = temp[1];

            document.getElementById("show_steps").innerHTML = "<b>Steps: " + steps + "</b>";

            a_plot.push([parsed.milliseconds[i], acceleration]);

            plot.setData([x_plot, y_plot, z_plot, a_plot]);
            plot.setupGrid();
            plot.draw();

            // When we've gone through all the points, clear the interval
            i += 1;
            if (i == parsed.milliseconds.length) {
                clearInterval(timer);
            }
        }, 10);
    });  

}


// Experiment in compression
// URL: https://stackoverflow.com/questions/294297/javascript-implementation-of-gzip

// LZW-compress a string
function lzw_encode(s) {
    var dict = {};
    var data = (s + "").split("");
    var out = [];
    var currChar;
    var phrase = data[0];
    var code = 256;
    for (var i=1; i<data.length; i++) {
        currChar=data[i];
        if (dict[phrase + currChar] != null) {
            phrase += currChar;
        }
        else {
            out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
            dict[phrase + currChar] = code;
            code++;
            phrase=currChar;
        }
    }
    out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
    for (var i=0; i<out.length; i++) {
        out[i] = String.fromCharCode(out[i]);
    }
    return out.join("");
}

// Decompress an LZW-encoded string
function lzw_decode(s) {
    var dict = {};
    var data = (s + "").split("");
    var currChar = data[0];
    var oldPhrase = currChar;
    var out = [currChar];
    var code = 256;
    var phrase;
    for (var i=1; i<data.length; i++) {
        var currCode = data[i].charCodeAt(0);
        if (currCode < 256) {
            phrase = data[i];
        }
        else {
           phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
        }
        out.push(phrase);
        currChar = phrase.charAt(0);
        dict[code] = oldPhrase + currChar;
        code++;
        oldPhrase = phrase;
    }
    return out.join("");
}
