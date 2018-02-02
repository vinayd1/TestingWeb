var loc;
var map;
var service;
var info = document.getElementById('Info');
var count = 0;
var infoWindowPrev;
var body = document.getElementsByTagName('body');

function initMap(){

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,
        center: {lat: -34.397, lng: 150.644}
    });
    service = new google.maps.places.PlacesService(map);
    let geocoder = new google.maps.Geocoder();

    marker = new google.maps.Marker();
    infoWindowPrev = new google.maps.InfoWindow;

    document.getElementById('submit').addEventListener('click', function() {
        geocodeAddress(geocoder,map);
    });
    document.getElementById('find').addEventListener('click',function(){
        findNearbyLocations();
    })
}


function geocodeAddress(geocoder, resultsMap) {
    let address = document.getElementById('address').value;
    geocoder.geocode({'address': address}, function(results, status) {
        if (status === 'OK') {
            resultsMap.panTo(results[0].geometry.location);
            loc = results[0].geometry.location;
            resultsMap.setZoom(6);

            marker.setPosition(results[0].geometry.location);
            marker.setMap(resultsMap);

        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

function findNearbyLocations(){


    service.nearbySearch({

        location: loc,
        radius:10000,
        type: ['food']
    }, function(results, status){

        if(status === 'OK')
        {
            for(var i = 0; i<results.length; i++)
            {
                service.getDetails({
                    placeId:results[i].place_id,
                }, function(result, status){
                    if(status === 'OK')
                        putMarker(result);
                })
            }
        }
        else{
            alert('Search Unsuccessful because:\n' + status);
        }
    });

}

function putMarker(result){

    let marker = new google.maps.Marker({
        position: result.geometry.location,
        map:map,
    });
    let infoWindow = new google.maps.InfoWindow;
    infoWindow.setContent(`<div><strong>${result.name}</strong><br>${result.vicinity}</div>`);
    map.setZoom(12);
    marker.addListener('click',function(){
        count++;

        if(count%2 !== 0)
        infoWindow.open(map,marker);
         else
             infoWindowPrev.close();
        infoWindowPrev = infoWindow;

        showDetails(this,result);
    });
}

function displayTime(result){

    console.log('secybitch');
    if(result.opening_hours.open_now)
        info.innerHTML += `<span style="color:rgba(0,128,0,0.42)"><span style="width:3px;height:3px;border-radius:50%;background-color:green;"> </span> Open Now</span>`;

    for(var i =0; i<result.opening_hours.weekday_text.length; i++)
        info.innerHTML += result.opening_hours.weekday_text + '\n';
}

function showDetails(marker,result){

    console.log(result);
    info.innerHTML = `<i class="large material-icons" onclick="info.classList.remove('animate');infoWindowPrev.close(); count++;" style="display:block;float:left; font-size:50px; ">close</i>
                        <div style="color:rgba(244,255,248,0.77);text-align:center;">
                            <h1>${result.name}</h1><div style="display:flex"> <div style="display:flex; flex-flow:column;">${result.formatted_address}<br><br><div style="color:rgba(236,255,242,0.67)">${result.formatted_phone_number}</div></div> <img class="pic" src="${result.photos[0].getUrl({maxWidth: 200})}"></div>
                        </div>
                        <hr>    
                        <div style="display:flex">
                             <div style="width:70%">
                                     <h3 onload="displayTime(${result});">Opening Timings</h3>

                            </div>
                            <div style="width:30%;">
                                     <i style="color:yellow; font-size:54px;" class="large material-icons">star</i><b style="bottom:10px;font-family:'Roboto', 'sans-serif';font-weight:bolder !important;text-shadow:1px 1px white;">${result.rating}</b>
                            </div>
                        </div> `;


    info.classList.toggle('animate');
}