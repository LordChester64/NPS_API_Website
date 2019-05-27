//var config = JSON.parse(env);

function getCampgroundDescription(){
    var searchParams = new URLSearchParams(window.location.href.split("?")[1]);
    for (let p of searchParams){
        console.log(p);
    }
    var parkCode = searchParams.get("parkCode");
    var campgroundID = searchParams.get("campgroundID");
    getCampgroundInfo(parkCode).then(campgroundInfo => {
        buildCampgroundDetails(campgroundInfo, campgroundID);
    });
}


async function getCampgroundInfo(code) {
    const response = await fetch(`https://developer.nps.gov/api/v1/campgrounds?parkCode=${code}&api_key=${config.API_Key}`);
    const responseData = await response.json();
    return await responseData.data;
}

function buildCampgroundDetails(campgroundInfo, campgroundID){
    console.log(campgroundInfo);
    campgroundList = "";
    countOfCampgrounds = campgroundInfo.length;
    for (i = 0; i < countOfCampgrounds; i++){
        if (campgroundID === campgroundInfo[i].id){
            //campgroundList += `<li class="campgroundItem"><a href="CampCard.html">${campgroundInfo[i].name}</a></li><hr />`;
            thisCampground = campgroundInfo[i];
            break;
        }
    }
    document.getElementById("campgroundName").innerText = `${thisCampground.name}`;
    document.getElementById("campgroundNameHeading").innerText = `About ${thisCampground.name}:`;
    document.getElementById("campgroundDescription").innerText = `${thisCampground.description}\n`;
    document.getElementById("campgroundDirectionsHeading").innerText = `Directions:\n`;
    document.getElementById("campgroundDirections").innerText = `${thisCampground.directionsoverview}`;
    document.getElementById("campgroundReservationLink").innerHTML = `<a href="${thisCampground.regulationsurl}">Regulations for the campsite</a>`;
    displayMap(thisCampground);
    
}

function displayMap(thisCampground) {
    var point = parseLatLong(thisCampground.latLong);
    console.log(point.lat);
    console.log(point.long);
    console.log(config.MAP_KEY);
    mapboxgl.accessToken = `${config.MAP_KEY}`;
    var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    center: [point.long, point.lat], // starting position [lng, lat]
    zoom: 9 // starting zoom
});
}

function parseLatLong(latLong){
    var point = {lat: 0,long: 0};
    if (latLong.length > 0){
        var coordinates = latLong.split(",");
        point.lat = parseFloat(coordinates[0].split(":")[1]);
        point.long = parseFloat(coordinates[1].split(":")[1].replace("}", ""));
    }
    return point;
}



