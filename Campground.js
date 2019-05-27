var config = JSON.parse(env);

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
    document.getElementById("campgroundDescription").innerText = `${thisCampground.description}`;
}