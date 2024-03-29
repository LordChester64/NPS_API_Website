var searchedByKeyword = false;
var isCampground = false;

function init() {
    initDropdowns();
    var searchParams = new URLSearchParams(window.location.href.split("?")[1]);
    var parkCode = searchParams.get("parkCode");
    if (parkCode) {
        getParkDescription(parkCode);
    }
}

function initDropdowns() {
    var stateList = {
        null: "",
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
    var designationList = [
        null,
        "National Battlefield",
        "National Battlefield Park",
        "National Battlefield Site",
        "National Military Park",
        "National Historical Park",
        "National Historic Site",
        "International Historic Site",
        "National Lakeshore",
        "National Memorial",
        "National Monument",
        "National Park",
        "National Parkway",
        "National Preserve",
        "National Reserve",
        "National Recreation Area",
        "National River",
        "National Wild and Scenic River",
        "National Wild and Scenic Riverway",
        "National Scenic Trail",
        "National Seashore",

        "Affiliated Area",
        "National Heritage Area",
        "National Trails System",
        "National Wild & Scenic Rivers System"
    ];
    var stateDropDown = document.getElementById("states");
    for (var state in stateList) {
        var option = document.createElement("option");
        option.value = state;
        option.innerText = stateList[state];
        stateDropDown.appendChild(option);
    }
}

function initDesignations(designationMap) {
    var designationDropDown = document.getElementById("designation");
    while (designationDropDown.firstChild) {
        designationDropDown.removeChild(designationDropDown.firstChild);
    }
    var option = document.createElement("option");
    option.value = "";
    designationDropDown.appendChild(option);
    var keys = Object.keys(designationMap);
    for (var designation in keys.sort()) {
        var option = document.createElement("option");
        option.value = designation;
        if (designationMap[keys[designation]]) {
            option.innerText = designationMap[keys[designation]];
        } else if (designation === 0) {
            option.innerText = "";
        } else {
            option.innerText = "Other";
        }
        designationDropDown.appendChild(option);
    }
}

function getToken(token, prefix) {
    var encoded = "";
    token = decodeURI(token);
    for (i = 0; i < token.length; i++) {
        var a = token.charCodeAt(i);
        var b = a ^ 51; // bitwise XOR with any number, e.g. 123
        encoded = encoded + String.fromCharCode(b);
    }
    var slicedStr = encoded.slice(19, encoded.length);
    return slicedStr;
}

function getParkDescription(code) {
    getParkInfo(code).then(parkInfo => {
        document.getElementById('parkFullName').innerText = decodeURIComponent(escape(parkInfo.fullName));
        document.getElementById('parkStates').innerText = "States: " + parkInfo.states;
        if (parkInfo.designation) {
            document.getElementById('parkName').innerText = "About the  " + parkInfo.designation;
        } else {
            document.getElementById('parkName').innerText = "About the site";
        }
        document.getElementById('parkDescription').innerText = parkInfo.description;
        document.getElementById("parkCode").innerText = "Park Code: " + parkInfo.parkCode;
        document.getElementById("parkID").innerText = "Park ID: " + parkInfo.id;
        image(parkInfo.images[0].url);
        document.getElementById('learningLink').innerHTML = `<h3><a href="learningMaterials.html?parkCode=${parkInfo.parkCode}">Learn more here!</a></h3>`;
        displayMap(parkInfo, isCampground);
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
    if (codeArray.length === 1) {
        parkCode = codeArray[0].substring(0, 4);
    } else {
        parkCode = codeArray[0].substring(0, 2);
        parkCode += codeArray[1].substring(0, 2);
    }
    return parkCode;
}

async function getParkInfo(code) {
    const response = await fetch(`https://developer.nps.gov/api/v1/parks?parkCode=${code}&fields=images&api_key=${getToken(tokens.NPS, tokens.prefix)}`);

    const responseData = await response.json();

    return await responseData.data[0];
}

function image(imgURL) {
    document.getElementById("parkPicture").src = imgURL;
}

//Campgrounds call
async function getCampgroundsInfo(code) {
    document.getElementById("parkCampgrounds").innerHTML = `<img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" height="100px" width="100px">`;
    const response = await fetch(`https://developer.nps.gov/api/v1/campgrounds?parkCode=${code}&api_key=${getToken(tokens.NPS, tokens.prefix)}`);
    const responseData = await response.json();
    return await responseData.data;
}

function buildCampgroundList(campgroundInfo) {
    campgroundList = "<h3>Campgrounds:</h3><hr/>";
    countOfCampgrounds = campgroundInfo.length;
    if (countOfCampgrounds === 0) {
        campgroundList += `<p>No results found</p>`;
    }
    for (i = 0; i < countOfCampgrounds; i++) {
        campgroundList += `<li class="campgroundItem"><a href="CampCard.html?parkCode=${campgroundInfo[i].parkCode}&campgroundID=${campgroundInfo[i].id}">${campgroundInfo[i].name}</a></li><hr />`;
    }
    document.getElementById("parkCampgrounds").innerHTML = campgroundList;
}

//Visitor Center call
async function getVisitorCenterInfo(code) {
    document.getElementById("parkCenters").innerHTML = `<img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" height="100px" width="100px">`;
    const response = await fetch(`https://developer.nps.gov/api/v1/visitorcenters?parkCode=${code}&api_key=${getToken(tokens.NPS, tokens.prefix)}`);
    const responseData = await response.json();
    return await responseData.data;
}

function buildVisitorCenterList(visitorCenterInfo) {
    visitorCenterList = "<h3>Visitor Centers:</h3><hr/>";
    countOfCenters = visitorCenterInfo.length;
    if (countOfCenters === 0) {
        visitorCenterList += `<p>No results found</p>`;
    }
    for (i = 0; i < countOfCenters; i++) {
        visitorCenterList += `<li class="Visitor Center Item"><a href="VCCard.html?parkCode=${visitorCenterInfo[i].parkCode}&visitorCenterID=${visitorCenterInfo[i].id}"">${visitorCenterInfo[i].name}</a></li><hr />`;
    }
    document.getElementById("parkCenters").innerHTML = visitorCenterList;
}

//Alert call
async function getAlertInfo(code) {
    document.getElementById("alertBox").innerHTML = `<img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" height="100px" width="100px">`;
    const response = await fetch(`https://developer.nps.gov/api/v1/alerts?parkCode=${code}&api_key=${getToken(tokens.NPS, tokens.prefix)}`);
    const responseData = await response.json();
    return await responseData.data;
}

function buildAlertList(alertInfo) {
    alertList = `<h3>Alerts:</h3><hr/>`;
    countOfAlerts = alertInfo.length;
    if (countOfAlerts === 0) {
        alertList += `<p>No results found</p>`;
    }
    for (i = 0; i < countOfAlerts; i++) {
        alertList += `<li class="alertItem"><h4>${alertInfo[i].title}</h4><p>${alertInfo[i].category}</p><p>${alertInfo[i].description}</p></li><hr />`;
    }
    document.getElementById("alertBox").innerHTML = alertList;
}

//Articles call
async function getArticleInfo(code) {
    document.getElementById("articleBox").innerHTML = `<img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" height="100px" width="100px">`;
    const response = await fetch(`https://developer.nps.gov/api/v1/articles?parkCode=${code}&api_key=${getToken(tokens.NPS, tokens.prefix)}`);
    const responseData = await response.json();
    return await responseData.data;
}

function buildArticleList(articlesInfo) {
    articlesList = `<h3>Articles:</h3><hr/>`;
    countOfArticles = articlesInfo.length;
    if (countOfArticles === 0) {
        articlesList += `<p>No results found</p>`;
    }
    for (i = 0; i < countOfArticles; i++) {
        articlesList += `<li class="articleItem"><h4>${articlesInfo[i].title}</h4><p>${articlesInfo[i].listingdescription}</p></li>`;
        if (articlesInfo[i].listingimage.url) {
            articlesList += `<img src="${articlesInfo[i].listingimage.url}" class"articleImage" width="100" height="100">`;
        }
        if (articlesInfo[i].url) {
            articlesList += `<p><a href="${articlesInfo[i].url}">Read more --></a></p><hr />`;
        } else {
            articlesList += `<hr />`;
        }
    }
    document.getElementById("articleBox").innerHTML = articlesList;
}

//Events call
async function getEventInfo(code) {
    document.getElementById("eventBox").innerHTML = `<img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" height="100px" width="100px">`;
    const response = await fetch(`https://developer.nps.gov/api/v1/events?parkCode=${code}&api_key=${getToken(tokens.NPS, tokens.prefix)}`);
    const responseData = await response.json();
    return await responseData.data;
}

function buildEventList(eventsInfo) {
    eventsList = `<h3>Events:</h3><hr/>`;
    countOfEvents = eventsInfo.length;
    if (countOfEvents === 0) {
        eventsList += `<p>No results found</p>`;
    }
    for (i = 0; i < countOfEvents; i++) {
        eventsList += `<li class="eventItem"><h4>${eventsInfo[i].title}</h4><p>${eventsInfo[i].category}</p><p>${eventsInfo[i].description}</p><p>${eventsInfo[i].times[0].timestart} - ${eventsInfo[i].times[0].timeend}</p></li>`;
        if (eventsInfo[i].infourl) {
            eventsList += `<p><a href="${eventsInfo[i].infourl}">Read more --></a></p><hr />`;
        } else {
            eventsList += `<hr />`
        }
    }
    document.getElementById("eventBox").innerHTML = eventsList;
}

//News Releases call
async function getNewsInfo(code) {
    document.getElementById("newsBox").innerHTML = `<img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" height="100px" width="100px">`;
    const response = await fetch(`https://developer.nps.gov/api/v1/newsreleases?parkCode=${code}&api_key=${getToken(tokens.NPS, tokens.prefix)}`);
    const responseData = await response.json();
    return await responseData.data;
}

function buildNewsList(newsInfo) {
    newsList = `<h3>News Releases:</h3><hr/>`;
    countOfNewsReleases = newsInfo.length;
    if (countOfNewsReleases === 0) {
        newsList += `<p>No results found</p>`;
    }
    for (i = 0; i < countOfNewsReleases; i++) {
        newsList += `<li class="newsItem"><h4>${newsInfo[i].title}</h4><p>${newsInfo[i].abstract}</p></li>`;
        if (newsInfo[i].image) {
            if (newsInfo[i].image.url) {
                newsList += `<img src="${newsInfo[i].image.url}" class"newsImage" width="100" height="100">`;
            }
        }
        if (newsInfo[i].url) {
            newsList += `<p><a href="${newsInfo[i].url}">Read more --></a></p><hr />`
        } else {
            newsList += `<hr />`
        }
    }
    document.getElementById("newsBox").innerHTML = newsList;
}

function search() {
    document.getElementById("resultList").innerHTML = "";
    document.getElementById("resultList").innerHTML = `<img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" height="100px" width="100px">`;
    document.getElementById("numResults").innerHTML = "";
    var stateDropDown = document.getElementById("states");
    var stateCode = stateDropDown.options[stateDropDown.selectedIndex].value;
    var searchArray = [];
    if (stateCode !== "null") {
        searchArray.push(`stateCode=${stateCode}`);
    }
    var numResults = 0;
    var keywords = document.getElementById('searchedKeyword').value;
    if (keywords) {
        searchArray.push(`q=${keywords}`);
    }
    if (searchArray.length) {
        getList(searchArray.join("&")).then(parkInfo => {
            document.getElementById("resultList").innerHTML = "";
            var designationMap = {};
            for (var park in parkInfo) {
                var designationAttribute = generateDesignationAttribute(parkInfo[park].designation);
                designationMap[`${designationAttribute}`] = parkInfo[park].designation;
                numResults += 1;
                if (designationAttribute) {
                    document.getElementById("resultList").innerHTML += `<li class="${designationAttribute}"><a href="index.html?parkCode=${parkInfo[park].parkCode}">${parkInfo[park].name}</a></li>`;
                } else {
                    document.getElementById("resultList").innerHTML += `<li class="other"><a href="index.html?parkCode=${parkInfo[park].parkCode}">${parkInfo[park].name}</a></li>`
                }
            }
            initDesignations(designationMap);
            document.getElementById("numResults").innerHTML = `Retrieved ${numResults} results`;
        });
    } else {
        document.getElementById("resultList").innerHTML = `<p>No results found</p>`;
    }
}

async function getList(searchParameters) {
    const response = await fetch(`https://developer.nps.gov/api/v1/parks?${searchParameters}&fields=images&api_key=${getToken(tokens.NPS, tokens.prefix)}`);
    const responseData = await response.json();

    return await responseData.data;
}

function filterByDesignation() {
    var designationFilter = document.getElementById("designation");
    var resultList = document.getElementById("resultList");
    var designation = designationFilter.options[designationFilter.selectedIndex].innerText;
    var children = resultList.childNodes;
    for (var child in children) {
        designationName = children[child].className.split(" ")[0];
        if (generateDesignationAttribute(designation) === "") {
            children[child].style.display = "block";
        } else if ((designationName === undefined) && (generateDesignationAttribute(designation) === "other")) {
            children[child].style.display = "block";
        } else if (designationName !== generateDesignationAttribute(designation)) {
            children[child].style.display = "none";
        } else {
            children[child].style.display = "block";
        }
    }
}

function keywordSearch(keyword) {
    document.getElementById("resultList").innerHTML = "";
    document.getElementById("resultList").innerHTML = `<img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" height="100px" width="100px">`;
    var designationMap = {};
    searchedByKeyword = true;
    getParkList(keyword, "q=").then(parkInfo => {
        document.getElementById("resultList").innerHTML = "";
        if (parkInfo.length === 0) {
            document.getElementById("resultList").innerHTML += `<li>No results found</li>`;
        }
        for (var park in parkInfo) {
            var designationAttribute = generateDesignationAttribute(parkInfo[park].designation);
            designationMap[`${designationAttribute}`] = parkInfo[park].designation;
            if (designationAttribute) {
                document.getElementById("resultList").innerHTML += `<li class="${designationAttribute} ${parkInfo[park].states}"><a href="index.html?parkCode=${parkInfo[park].parkCode}">${parkInfo[park].name}</a></li></div>`;
            } else {
                document.getElementById("resultList").innerHTML += `<li class="other ${parkInfo[park].states}"><a href="index.html?parkCode=${parkInfo[park].parkCode}">${parkInfo[park].name}</a></li></div>`
            }
        }
        initDesignations(designationMap);
    });
}

async function getParkList(code, searchLine) {
    const response = await fetch(`https://developer.nps.gov/api/v1/parks?${searchLine}${code}&fields=images&api_key=${getToken(tokens.NPS, tokens.prefix)}`);
    const responseData = await response.json();

    return await responseData.data;
}

function generateDesignationAttribute(fullDesignation) {
    return fullDesignation.toLowerCase().replace(/ /g, "");
}