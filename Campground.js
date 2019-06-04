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
    if (determineExistance(thisCampground.amenities.campstore) === "Yes"){
        document.getElementById("amenityIcons").innerHTML += `<img src="./images/store.svg" height="30px" width="30px" title="Camp Store" class="amenityPics">`;
    }
    if (determineExistance(thisCampground.amenities.firewoodforsale) === "Yes"){
        document.getElementById("amenityIcons").innerHTML += `<img src="./images/campfire.svg" height="30px" width="30px" title="Firewood for Sale" class="amenityPics">`;
    }
    if (determineExistance(thisCampground.amenities.foodstoragelockers) === "Yes"){
        document.getElementById("amenityIcons").innerHTML += `<img src="./images/food-cache.svg" height="30px" width="30px" title="Food Storage Available" class="amenityPics">`;
    }
    if (determineExistance(thisCampground.amenities.laundry) === "Yes"){
        document.getElementById("amenityIcons").innerHTML += `<img src="./images/laundry.svg" height="30px" width="30px" title="Laundry Available" class="amenityPics">`;
    }
    if (determineExistance(thisCampground.amenities.toilets[0]) === "Flush"){
        document.getElementById("amenityIcons").innerHTML += `<img src="./images/restrooms.svg" height="30px" width="30px" title="Flush Toilets Available" class="amenityPics">`;
    }
    if (determineExistance(thisCampground.amenities.internetconnectivity) === "Yes"){
        document.getElementById("amenityIcons").innerHTML += `<img src="./images/wi-fi.svg" height="30px" width="30px" title="Internet Connection Available" class="amenityPics">`;
    }
    if (determineExistance(thisCampground.amenities.potablewater[0]) === "Yes"){
        document.getElementById("amenityIcons").innerHTML += `<img src="./images/wi-fi.svg" height="30px" width="30px" title="Internet Connection Available" class="amenityPics">`;
    }
    if (determineExistance(thisCampground.amenities.showers[0]) === "Hot"){
        document.getElementById("amenityIcons").innerHTML += `<img src="./images/showers.svg" height="30px" width="30px" title="Hot Showers Available" class="amenityPics">`;
    }
    if (determineExistance(thisCampground.amenities.showers[0]) === "Cold"){
        document.getElementById("amenityIcons").innerHTML += `<img src="./images/showers.svg" height="30px" width="30px" title="Cold Showers Available" class="amenityPics">`;
    }
    document.getElementById("campgroundNameHeading").innerText = `About ${thisCampground.name}:`;
    document.getElementById("campgroundDescription").innerText = `${thisCampground.description}\n`;
    document.getElementById("campgroundDirectionsHeading").innerText = `Directions:\n`;
    if (thisCampground.directionsoverview){
        document.getElementById("campgroundDirections").innerText = `${thisCampground.directionsoverview}`;
    }
    else{
        document.getElementById("campgroundDirections").innerText = "No directions found"
    }
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

function determineExistance(value) {
    if (value){
        var splitValue = value.split(" ");
        var ans = splitValue[0];
        return ans;
    }
    else{
        return value;
    }
}

