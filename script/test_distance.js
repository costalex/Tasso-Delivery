service = new google.maps.DistanceMatrixService();
service.getDistanceMatrix(
    {
        origins: [new google.maps.LatLng(44.8516608,-0.5862795)],
        destinations: [new google.maps.LatLng(44.8454388,-0.5769527)],
        travelMode: google.maps.TravelMode.DRIVING,
        avoidHighways: false,
        avoidTolls: false
    },
    callback
);

function callback(response, status) {
    var orig = document.getElementById("orig"),
        dest = document.getElementById("dest"),
        dist = document.getElementById("dist");
        time = document.getElementById("time");

    if(status=="OK") {
        dest.value = response.destinationAddresses[0];
        orig.value = response.originAddresses[0];
        //console.log(response);
        dist.value = response.rows[0].elements[0].distance.text;
        time.value = response.rows[0].elements[0].duration.text;
    } else {
        alert("Error: " + status);
    }
}
