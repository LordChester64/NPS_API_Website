function getLearningMaterials(){
    var searchParams = new URLSearchParams(window.location.href.split("?")[1]);
    var parkCode = searchParams.get("parkCode");
    getLessonInfo(parkCode).then(lessonInfo => {
        buildLessonDetails(lessonInfo);
    });
    getPeopleInfo(parkCode).then(peopleInfo => {
        buildPeopleDetails(peopleInfo);
    });
    getPlacesInfo(parkCode).then(placesInfo => {
        buildPlacesDetails(placesInfo);
    });
}

//Lesson Plan calls
async function getLessonInfo(code) {
    const response = await fetch(`https://developer.nps.gov/api/v1/lessonplans?parkCode=${code}&api_key=${getToken(tokens.NPS, tokens.prefix)}`);
    const responseData = await response.json();
    return await responseData.data;
}

function getToken(token, prefix) {
    var encoded = "";
    token = decodeURI(token);
    for (i=0; i<token.length;i++) {
      var a = token.charCodeAt(i);
      var b = a ^ 51;    // bitwise XOR with any number, e.g. 123
      encoded = encoded+String.fromCharCode(b);
    }
    var slicedStr = encoded.slice(19, encoded.length);
    return slicedStr;
  }


function buildLessonDetails(lessonInfo){
    lessonList = "";
    countOfLessons = lessonInfo.length;
    if (countOfLessons === 0){
        lessonList += `<p>No results found</p>`;
    }
    for (i = 0; i < countOfLessons; i++){
        lessonList += `<h3 id="lessonTitle">${lessonInfo[i].title}</h3><h5 id="lessonSubject">${lessonInfo[i].subject}</h5><h6 id="lessonGradeLevel">Grade level: ${lessonInfo[i].gradelevel}</h6>`;
        lessonList += `<p>${lessonInfo[i].questionobjective}</p><hr />`;
    }
    document.getElementById("lessonScroll").innerHTML = lessonList;    
}

//People calls
async function getPeopleInfo(code) {
    const response = await fetch(`https://developer.nps.gov/api/v1/people?parkCode=${code}&api_key=${getToken(tokens.NPS, tokens.prefix)}`);
    const responseData = await response.json();
    return await responseData.data;
}

function buildPeopleDetails(peopleInfo){
    peopleList = "";
    countOfPeople = peopleInfo.length;
    if (countOfPeople === 0){
        peopleList += `<p>No results found</p>`;
    }
    for (i = 0; i < countOfPeople; i++){
        peopleList += `<h3 id="peopleTitle">${peopleInfo[i].title}</h3>`;
        peopleList += `<p>${peopleInfo[i].listingdescription}</p>`;
        if (peopleInfo[i].url){
            peopleList += `<p><a href="${peopleInfo[i].url}">About</a></p><hr />`;
        }
        else{
            peopleList += `<hr />`;
        }
    }
    document.getElementById("peopleScroll").innerHTML = peopleList;    
}

//Places calls
async function getPlacesInfo(code) {
    const response = await fetch(`https://developer.nps.gov/api/v1/places?parkCode=${code}&api_key=${getToken(tokens.NPS, tokens.prefix)}`);
    const responseData = await response.json();
    return await responseData.data;
}

function buildPlacesDetails(placesInfo){
    placesList = "";
    countOfPlaces = placesInfo.length;
    if (countOfPlaces === 0){
        placesList += `<p>No results found</p>`;
    }
    for (i = 0; i < countOfPlaces; i++){
        placesList += `<h3 id="peopleTitle">${placesInfo[i].title}</h3>`;
        placesList += `<p>${placesInfo[i].listingdescription}</p>`;
        if (placesInfo[i].url){
            placesList += `<p><a href="${placesInfo[i].url}">About</a></p><hr />`;
        }
        else{
            placesList += `<hr />`;
        }
    }
    document.getElementById("placesScroll").innerHTML = placesList;    
}