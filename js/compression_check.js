var test = new Firebase("https://quantifiedpony.firebaseio.com/saved/-JTScihqA3AlZdWmtnRN");
test.once('value', function(v) { window.theValue = v.val() });
decompressed = lzw_decode(theValue.json_string)
parsed = JSON.parse(decompressed)