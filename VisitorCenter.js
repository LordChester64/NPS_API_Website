//var config = JSON.parse(env);

function getVisitorCenterDescription(){
    var searchParams = new URLSearchParams(window.location.href.split("?")[1]);
    for (let p of searchParams){
        console.log(p);
    }
    var parkCode = searchParams.get("parkCode");
    var visitorCenterID = searchParams.get("visitorCenterID");
    getVisitorCenterInfo(parkCode).then(visitorCenterInfo => {
        buildVisitorCenterDetails(visitorCenterInfo, visitorCenterID);
    });
}


async function getVisitorCenterInfo(code) {
    const response = await fetch(`https://developer.nps.gov/api/v1/visitorcenters?parkCode=${code}&api_key=${config.API_Key}`);
    const responseData = await response.json();
    return await responseData.data;
}

function buildVisitorCenterDetails(visitorCenterInfo, visitorCenterID){
    console.log(visitorCenterInfo);
    visitorCenterList = "";
    countOfVisitorCenters = visitorCenterInfo.length;
    for (i = 0; i < countOfVisitorCenters; i++){
        if (visitorCenterID === visitorCenterInfo[i].id){
            thisVisitorCenter = visitorCenterInfo[i];
            break;
        }
    }
    document.getElementById("visitorCenterName").innerText = `${thisVisitorCenter.name}`;
    document.getElementById("visitorCenterNameHeading").innerText = `About ${thisVisitorCenter.name}:`;
    document.getElementById("visitorCenterDescription").innerText = `${thisVisitorCenter.description}`;
    document.getElementById("visitorCenterURL").innerHTML = `<a href="${thisVisitorCenter.url}">Learn More Here!</a>`;
    displayMap(thisVisitorCenter);
}

function displayMap(thisVisitorCenter) {
    var point = parseLatLong(thisVisitorCenter.latLong);
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
