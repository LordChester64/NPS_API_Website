//var config = JSON.parse(env);
function getCode(string) {
    var searchString = string;
    var parkCode = "";
    searchString = searchString.toLowerCase();
    searchString = searchString.replace("national", "");
    searchString = searchString.replace("park", "");
    searchString = searchString.replace(" of ", "");
    searchString = searchString.replace(" the ", "");
    searchString = searchString.replace(" and ", "");
    searchString = searchString.trim();
    var codeArray = searchString.split(" ");
    console.log(codeArray)
    if (codeArray.length === 1){
        parkCode = codeArray[0].substring(0, 4);
    }
    else{
        parkCode = codeArray[0].substring(0,2);
        parkCode += codeArray[1].substring(0,2);
    }
    console.log(parkCode);
    return parkCode;
}

async function getParkInfo(code) {
    console.log(config.API_Key);
    const response = await fetch(`https://developer.nps.gov/api/v1/parks?parkCode=${code}&fields=images&api_key=${config.API_Key}`);

    const responseData = await response.json();

    return await responseData.data[0];
}

function getParkDescription(code) {
    getParkInfo(code).then(parkInfo => {
        console.log(`${parkInfo}`); 
        document.getElementById('parkFullName').innerText = decodeURIComponent(escape(parkInfo.fullName));
        document.getElementById('parkStates').innerText = "States: " + parkInfo.states;
        document.getElementById('parkName').innerText = "About the  " + parkInfo.designation;
        document.getElementById('parkDescription').innerText = parkInfo.description;
        document.getElementById("parkCode").innerText = "Park Code: " + parkInfo.parkCode;
        document.getElementById("parkID").innerText = "Park ID: " + parkInfo.id;
        document.getElementById('learningLink').innerHTML = `<h5><a href="learningMaterials.html?parkCode=${parkInfo[i].parkCode}">Learn more here!</a></h5>`;
        image(parkInfo.images[0].url);
        });
    getCampgroundsInfo(code).then(campgroundsInfo => {
        buildCampgroundList(campgroundsInfo);
    });
    getVisitorCenterInfo(code).then(visitorCenterInfo => {
        buildVisitorCenterList(visitorCenterInfo);
    });
    getAlertInfo(code).then(alertInfo => {
        buildAlertList(alertInfo);
    });
    getArticleInfo(code).then(articleInfo => {
        buildArticleList(articleInfo);
    });
    getEventInfo(code).then(eventsInfo => {
        buildEventList(eventsInfo);
    });
    getNewsInfo(code).then(newsInfo => {
        buildNewsList(newsInfo);
    });
}

function image(imgURL) {
    // var img = document.createElement("IMG");
    // img.src = imgURL;
    // img.style.height = "auto";
    // img.style.width = "100%";
    document.getElementById("parkPicture").src = imgURL;
}


//Campgrounds call

async function getCampgroundsInfo(code) {
    const response = await fetch(`https://developer.nps.gov/api/v1/campgrounds?parkCode=${code}&api_key=${config.API_Key}`);
    const responseData = await response.json();
    return await responseData.data;
}

function buildCampgroundList(campgroundInfo){
    campgroundList = "<h3>Campgrounds:</h3><hr/>";
    countOfCampgrounds = campgroundInfo.length;
    for (i = 0; i < countOfCampgrounds; i++){
        campgroundList += `<li class="campgroundItem"><a href="CampCard.html?parkCode=${campgroundInfo[i].parkCode}&campgroundID=${campgroundInfo[i].id}">${campgroundInfo[i].name}</a></li><hr />`;
    }
    document.getElementById("parkCampgrounds").innerHTML = campgroundList;
}


//Visitor Center call

async function getVisitorCenterInfo(code) {
    const response = await fetch(`https://developer.nps.gov/api/v1/visitorcenters?parkCode=${code}&api_key=${config.API_Key}`);
    const responseData = await response.json();
    return await responseData.data;
}

function buildVisitorCenterList(visitorCenterInfo){
    visitorCenterList = "<h3>Visitor Centers:</h3><hr/>";
    countOfCenters = visitorCenterInfo.length;
    for (i = 0; i < countOfCenters; i++){
        visitorCenterList += `<li class="Visitor Center Item"><a href="VCCard.html?parkCode=${visitorCenterInfo[i].parkCode}&visitorCenterID=${visitorCenterInfo[i].id}"">${visitorCenterInfo[i].name}</a></li><hr />`;
    }
    document.getElementById("parkCenters").innerHTML = visitorCenterList;
}


//Alert call

async function getAlertInfo(code) {
    const response = await fetch(`https://developer.nps.gov/api/v1/alerts?parkCode=${code}&api_key=${config.API_Key}`);
    const responseData = await response.json();
    return await responseData.data;
}

function buildAlertList(alertInfo){
    alertList = `<h3>Alerts:</h3><hr/>`;
    countOfAlerts = alertInfo.length;
    for (i = 0; i < countOfAlerts; i++){
        alertList += `<li class="alertItem"><h4>${alertInfo[i].title}</h4><p>${alertInfo[i].category}</p><p>${alertInfo[i].description}</p></li><hr />`;
    }
    document.getElementById("alertBox").innerHTML = alertList;
}


//Articles call

async function getArticleInfo(code) {
    const response = await fetch(`https://developer.nps.gov/api/v1/articles?parkCode=${code}&api_key=${config.API_Key}`);
    const responseData = await response.json();
    return await responseData.data;
}

function buildArticleList(articlesInfo){
    articlesList = `<h3>Articles:</h3><hr/>`;
    countOfArticles = articlesInfo.length;
    for (i = 0; i < countOfArticles; i++){
        articlesList += `<li class="articleItem"><h4>${articlesInfo[i].title}</h4><p>${articlesInfo[i].listingdescription}</p></li>`;
        if (articlesInfo[i].listingimage.url){    
            articlesList += `<img src="${articlesInfo[i].listingimage.url}" class"articleImage" width="100" height="100">`;
        }
        if (articlesInfo[i].url) {
            articlesList += `<p><a href="${articlesInfo[i].url}">Read more --></a></p><hr />`;
        }
        else{
            articlesList += `<hr />`;
        }
    }
    document.getElementById("articleBox").innerHTML = articlesList;
}


//Events call

async function getEventInfo(code) {
    const response = await fetch(`https://developer.nps.gov/api/v1/events?parkCode=${code}&api_key=${config.API_Key}`);
    const responseData = await response.json();
    return await responseData.data;
}

function buildEventList(eventsInfo){
    eventsList = `<h3>Events:</h3><hr/>`;
    countOfEvents = eventsInfo.length;
    for (i = 0; i < countOfEvents; i++){
        eventsList += `<li class="eventItem"><h4>${eventsInfo[i].title}</h4><p>${eventsInfo[i].category}</p><p>${eventsInfo[i].description}</p><p>${eventsInfo[i].times[0].timestart} - ${eventsInfo[i].times[0].timeend}</p></li>`;
        if (eventsInfo[i].infourl){    
            eventsList += `<p><a href="${eventsInfo[i].infourl}">Read more --></a></p><hr />`;
        }
        else{
            eventsList += `<hr />`
        }
    }
    document.getElementById("eventBox").innerHTML = eventsList;
}


//News Releases call

async function getNewsInfo(code) {
    const response = await fetch(`https://developer.nps.gov/api/v1/newsreleases?parkCode=${code}&api_key=${config.API_Key}`);
    const responseData = await response.json();
    return await responseData.data;
}

function buildNewsList(newsInfo){
    newsList = `<h3>News Releases:</h3><hr/>`;
    countOfNewsReleases = newsInfo.length;
    for (i = 0; i < countOfNewsReleases; i++){
        newsList += `<li class="newsItem"><h4>${newsInfo[i].title}</h4><p>${newsInfo[i].abstract}</p></li>`;
        if (newsInfo[i].image){   
            if (newsInfo[i].image.url){ 
                newsList += `<img src="${newsInfo[i].image.url}" class"newsImage" width="100" height="100">`;
            }
        }
        if (newsInfo[i].url){
            newsList += `<p><a href="${newsInfo[i].url}">Read more --></a></p><hr />`
        }
        else{
            newsList += `<hr />`
        }
    }
    document.getElementById("newsBox").innerHTML = newsList;
}

function initDropdowns() {
    var stateList = {
        null:"",
        "AL": "Alabama",
        "AK": "Alaska",
        "AS": "American Samoa",
        "AZ": "Arizona",
        "AR": "Arkansas",
        "CA": "California",
        "CO": "Colorado",
        "CT": "Connecticut",
        "DE": "Delaware",
        "DC": "District Of Columbia",
        "FM": "Federated States Of Micronesia",
        "FL": "Florida",
        "GA": "Georgia",
        "GU": "Guam",
        "HI": "Hawaii",
        "ID": "Idaho",
        "IL": "Illinois",
        "IN": "Indiana",
        "IA": "Iowa",
        "KS": "Kansas",
        "KY": "Kentucky",
        "LA": "Louisiana",
        "ME": "Maine",
        "MH": "Marshall Islands",
        "MD": "Maryland",
        "MA": "Massachusetts",
        "MI": "Michigan",
        "MN": "Minnesota",
        "MS": "Mississippi",
        "MO": "Missouri",
        "MT": "Montana",
        "NE": "Nebraska",
        "NV": "Nevada",
        "NH": "New Hampshire",
        "NJ": "New Jersey",
        "NM": "New Mexico",
        "NY": "New York",
        "NC": "North Carolina",
        "ND": "North Dakota",
        "MP": "Northern Mariana Islands",
        "OH": "Ohio",
        "OK": "Oklahoma",
        "OR": "Oregon",
        "PW": "Palau",
        "PA": "Pennsylvania",
        "PR": "Puerto Rico",
        "RI": "Rhode Island",
        "SC": "South Carolina",
        "SD": "South Dakota",
        "TN": "Tennessee",
        "TX": "Texas",
        "UT": "Utah",
        "VT": "Vermont",
        "VI": "Virgin Islands",
        "VA": "Virginia",
        "WA": "Washington",
        "WV": "West Virginia",
        "WI": "Wisconsin",
        "WY": "Wyoming"
    };
    var stateDropDown = document.getElementById("states");
    for (var state in stateList){
        var option = document.createElement("option");
        option.value = state;
        option.innerText = stateList[state];
        stateDropDown.appendChild(option);
    }
}

function filterByState() {
    document.getElementById("resultList").innerHTML = "";
    var stateDropDown = document.getElementById("states");
    var stateCode = stateDropDown.options[stateDropDown.selectedIndex].value;
    console.log(stateCode);
    getParkList(stateCode, "stateCode=").then(parkInfo => {
        console.log(`${parkInfo}`); 
        for (var park in parkInfo){
            console.log(park);
            document.getElementById("resultList").innerHTML += `<li><a href="card.html?parkCode=${parkInfo[park].parkCode}">${parkInfo[park].name}</a></li>`
        }
        });
}

async function getParkList(code, searchLine) {
    console.log(config.API_Key);
    const response = await fetch(`https://developer.nps.gov/api/v1/parks?${searchLine}${code}&fields=images&api_key=${config.API_Key}`);
    console.log(`${searchLine}${code}`);
    const responseData = await response.json();

    return await responseData.data;
}


