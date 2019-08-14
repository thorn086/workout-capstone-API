'use strict'

//global consts/variables
const searchURL = "https://wger.de/api/v2/exercise/search/";
const apiKey = 'AIzaSyAmOsgJp0DLCE0Cw5yPIvtG4rTwSz1m2f0'; 
const searchYtURL = 'https://www.googleapis.com/youtube/v3/search';
let previousSearchResult;
let nextJson;
let searchTermYouTube;
let bodyArea;



/*function activateScroll(){
    $('html, body').animate({ scrollTop: $('main').offset().top - 20});    
  }*/




//format params
function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

//display getTerm() to DOM
function displayResults(wgerJson) {

    console.log(wgerJson);
    $('#wger-results-user').empty();

    if (wgerJson.suggestions.length === 0){
        $('#wger-results-user').append(
            `<li><h3>Sorry, Your search has no results. Try Again!</h3></li>`
        )}else{
    for (let i = 0; i < wgerJson.suggestions.length; i++) {

        $('#wger-results-user').append(
            `<li><h3>${wgerJson.suggestions[i].data.name}</h3>
        <p>${wgerJson.suggestions[i].data.category}</p>
        <button class="id-fetch" data-id="${wgerJson.suggestions[i].data.id}">Learn More</button>
        </li>`
        )
    };
    }
    //$('#results').removeClass('hidden');
};



// display id from handleLearnMore() to DOM
function idResults(idJson) {

    console.log(idJson); 
    searchTermYouTube = `${idJson.name}`;
    getYouTubeVideos(searchTermYouTube);
    console.log(searchTermYouTube);
    $('#wger-results-user').hide();

    $('#wger-learnMore-user').append(
        `<li><h3>${idJson.name}</h3>
        <p>${idJson.description}</p>
        <button onclick="goBack()"> Go Back</button>
        <button><a href="#startOver">Search Again</a></button></li>`

    );


    //$('#results').removeClass('hidden');
};

function goBack() {
    $('#wger-results-user').show();
    $('#wger-learnMore-user').empty();
    $('.results-youtube').empty();
}

// display results from search two to the DOM
function radioResults(radioJson, bodyArea) {

    console.log(radioJson);
    //console.log(previousSearchResult);
   // console.log(`${radioLabel}`);
    previousSearchResult = radioJson.previous;
    nextJson = radioJson.next;

    $('#wger-results-user').empty();

    if (radioJson.previous === null) {
        $('#next-hidden').show();
        $('#previous-hidden').hide();
        for (let i = 0; i < radioJson.results.length; i++) {

            $('#wger-results-user').append(
                `<li><h3>${radioJson.results[i].name}</h3>
            <p>${bodyArea}</p>
            <button class="id-fetch" data-id="${radioJson.results[i].id}">Learn More</button>
            </li>`
            )
        };
    } else if (radioJson.next === null) {
        $('#previous-hidden').show();
        $('#next-hidden').hide();
        for (let i = 0; i < radioJson.results.length; i++) {

            $('#wger-results-user').append(
                `<li><h3>${radioJson.results[i].name}</h3>
            <p>${bodyArea}</p>
            
            <button class="id-fetch" data-id="${radioJson.results[i].id}">Learn More</button>
            </li>`
            )
        };
    } else {
        $('#next-hidden').show();
        $('#previous-hidden').show();
        for (let i = 0; i < radioJson.results.length; i++) {

            $('#wger-results-user').append(
                `<li><h3>${radioJson.results[i].name}</h3>
        <p>${bodyArea}</p>
        <button class="id-fetch" data-id="${radioJson.results[i].id}">Learn More</button>
        </li>`
            )
        };

        //$('#results').removeClass('hidden');
    }
};



// create a term fetch(search one) 
function getTerm(userTerm) {
    const params = {
        term: userTerm
    };

    let queryString = formatQueryParams(params);
    const url = searchURL + '?' + queryString;

    console.log(url);

    fetch(url)
        .then(wger => {
            if (wger.ok) {
                return wger.json();
            }
            throw new Error(wger.statusText);
        })
        .then(wgerJson => {
           
            displayResults(wgerJson)
        })
        .catch(err => {
            $('#js-error-message').text(`Opps!: ${err.message}`);
        });
}


// listener for the submit button(search one) to display the results
function handleSubmit() {
    $('#search-one').on('click', event => {
        event.preventDefault();
        const userTerm = $('#search-field').val();
        getTerm(userTerm);
    });
}
// id fetch display description and name
function handleLearnMore() {
    $('#wger-results-user').on('click', '.id-fetch', event => {
        const idName = $(event.target).attr('data-id')
        console.log(idName);
        fetchExInfo(idName);
    });
    
}

// get Youtube Videos with learn more function
function getYouTubeVideos(searchTermYouTube) {
    
  const tubeParams = {
    q:searchTermYouTube,
    part: 'snippet',
    maxResults: 3,
    key: apiKey
  };
  
  let queryString = formatQueryParams(tubeParams)
  const youTubeURL = searchYtURL + '?' + queryString;
  console.log(youTubeURL);

  fetch(youTubeURL)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => videoResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function videoResults(responseJson) {
        
        console.log(responseJson);
        $('.results-youtube').empty();
        
        for (let i = 0; i < responseJson.items.length; i++){
       
          $('.results-youtube').append(
            `<li><h3>${responseJson.items[i].snippet.title}</h3>
            <p>${responseJson.items[i].snippet.description}</p>
            <img class="thumbnail" src='${responseJson.items[i].snippet.thumbnails.medium.url}'>
            </li>`
          )};
          /*function showYoutube(searchWord, results) {
  var html = "";
  //Error msg for no search results
  if (results.length === 0) {
    html += '<div class="center"><dt class="youtube_color">Sorry, no YouTube clips were found.</dt><hr><dd class="tips">- Check for correct spelling, spacing and punctunations.<br />- Avoid using other search engine tricks in your search term.<br />- If the YouTube API server is down, try again at a later time.</dd>';
    $('.youtube').append(html);
  } else {
    $.each(results, function(index,value) {
      let title = value.snippet.title;
      if (title.length > 70) {
        title = title.substring(0, 70).trim() + '...';
      }
      
      html += '<table><tr><td><a href="https://www.youtube.com/watch?v=' + value.id.videoId + '?vq=hd1080" data-lity>' + 
      '<div class="thumbnailWrap"><img class="thumbnail" src="' + value.snippet.thumbnails.medium.url + 
      '"><p class="play"><i class="fa fa-play-circle" aria-hidden="true"></i><br><span class="popup">Play here</span></p></div></a></td>' + 
      '<td class="tdtext"><a href="https://www.youtube.com/watch?v=' + value.id.videoId + '?vq=hd1080" data-lity><p class="videotitle">' + 
      title + '</p></a><p class="videochannel">' + 
      value.snippet.publishedAt.substring(0, value.snippet.publishedAt.length - 14).replace(/-/g, '/') + ' &middot; <a href="https://www.youtube.com/channel/' + value.snippet.channelId + '" target="_blank">' +
      value.snippet.channelTitle + '</a></p><a class="read_description" href="#v' + index + '" rel="modal:open"><i class="fa fa-question-circle" aria-hidden="true"></i> Read description</a><p class="fulldescription" id="v' + index + '" style="display: none;"><span class="fd_title"><i class="fa fa-question-circle" aria-hidden="true"></i> ' + value.snippet.title + '</span><span class="fd_by">Posted by <a href="https://www.youtube.com/channel/' + value.snippet.channelId + '" target="_blank">' +
      value.snippet.channelTitle + '</a> on '+ value.snippet.publishedAt.substring(0, value.snippet.publishedAt.length - 14).replace(/-/g, '/') +'</span>' + value.snippet.description + '<a class="fd_link" href="https://www.youtube.com/watch?v=' + value.id.videoId + '?vq=hd1080" data-lity rel="modal:close"> Watch the video to learn more<i>!</i></a></p><p class="videodescription">' + value.snippet.description.substring(0, 130).trim() + '...' + '</p></td></tr></table>';
    });
    $('.youtube').append(html);
    $('.youtube').append('<hr class="youtubehr"><p class="ext_link"><a href="https://www.youtube.com/results?search_query=' + $('#searchfield').val() + 
      '" target="_blank"><i class="fa fa-external-link-square" aria-hidden="true"></i> &nbsp;More on YouTube</a></p>');
  }*/ 
         
        //$('#results').removeClass('hidden');
}



//handle when someone sellects the Next button
function handleNextButton() {
    $('#next-hidden').on('click', function (){
        fetch(nextJson)
        .then(nextPage => {
            if (nextPage.ok) {
                return nextPage.json();
            }
            throw new Error(nextPage.statusText);
        })
        .then(nextPageJson => radioResults(nextPageJson))
        .catch(err => {
            $('#js-error-message').text(`Opps!: ${err.message}`);
        });
    });
}

//handle when someone selects previous button
function handlePreviousButton() {
    $('#previous-hidden').on('click', function (){
        fetch(previousSearchResult)
        .then(previousSearchResult => {
            if (previousSearchResult.ok) {
                return previousSearchResult.json();
            }
            throw new Error(previousSearchResult.statusText);
        })
        .then(previousSearchResultJson => radioResults(previousSearchResultJson))
        .catch(err => {
            $('#js-error-message').text(`Opps!: ${err.message}`);
        });
    });
}


//Search wger by Id name in first fetch
function fetchExInfo(idName) {
    const exURL = "https:/wger.de/api/v2/exercise/" + idName;

    console.log(exURL);

    fetch(exURL)
        .then(id => {
            if (id.ok) {
                return id.json();
            }
            throw new Error(id.statusText);
        })
        .then(idJson => idResults(idJson))
        .catch(err => {
            $('#js-error-message').text(`Opps!: ${err.message}`);
        });
}

//listener for search two
function radioButtonSearch() {
    $('#search-two').on('click', event => {
        event.preventDefault();
        let radioValue = $("input[name='Body']:checked").val();
        const radioURL = "https://wger.de/api/v2/exercise/?limit=8&category=" + radioValue + "&language=2&status=2";
        
         bodyArea = $($(":radio[name=Body]:checked").prop("labels")).text();
        console.log(bodyArea);
        console.log(radioURL);

        fetch(radioURL)
            .then(radio => {
                if (radio.ok) {
                    return radio.json();
                }
                throw new Error(radio.statusText);
            })
            .then(radioJson => radioResults(radioJson, bodyArea))
            .catch(err => {
                $('#js-error-message').text(`Opps!: ${err.message}`);
            });
    });
}




$(function () {
    handleSubmit();
    handleLearnMore();
    radioButtonSearch();
    handleNextButton();
    handlePreviousButton();
});


