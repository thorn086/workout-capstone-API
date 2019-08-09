'use strict'

//global consts/variables
const searchURL = "https://wger.de/api/v2/exercise/search/";
let lastSearchResult;





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

    for (let i = 0; i < wgerJson.suggestions.length; i++) {

        $('#wger-results-user').append(
            `<li><h3>${wgerJson.suggestions[i].data.name}</h3>
        <p>${wgerJson.suggestions[i].data.category}</p>
        <button class="id-fetch" data-id="${wgerJson.suggestions[i].data.id}">Learn More</button>
        </li>`
        )
    };

    //$('#results').removeClass('hidden');
};



// display id from handleLearnMore() to DOM
function idResults(idJson) {

    console.log(idJson);
    $('#wger-results-user').hide();

    $('#wger-learnMore-user').append(
        `<li><h3>${idJson.name}</h3>
        <p>${idJson.description}</p>
        <button onclick="goBack()"> Go Back</button>
        <button><a href="#startOver">Search Again</a></button></li>`

    );


    //$('#results').removeClass('hidden');
};

function goBack(){
    $('#wger-results-user').show();
    $('#wger-learnMore-user').empty();
}

// display results from search two to the DOM
function radioResults(radioJson,radioLabel) {

    console.log(radioJson);

    $('#wger-results-user').empty();

    for (let i = 0; i < radioJson.results.length; i++) {

        $('#wger-results-user').append(
            `<li><h3>${radioJson.results[i].name}</h3>
        <p>${radioLabel}</p>
        <button class="id-fetch" data-id="${radioJson.results[i].id}">Learn More</button>
        </li>`
        )
    };

    //$('#results').removeClass('hidden');
};



// create a term fetch(search one) 
function getTerm(userTerm) {
    const params = {
        term: userTerm
    };

    const queryString = formatQueryParams(params);
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
            lastSearchResult = wgerJson;
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
function checkButtonSearch() {
    $('#search-two').on('click', event => {
        event.preventDefault();
        let radioValue = $("input[name='Body']:checked").val();
        const radioURL = "https://wger.de/api/v2/exercise/?category=" + radioValue + "&language=2&status=2";
        const radioLabel = $(  $(":radio[name=Body]:checked").prop("labels") ).text();
        console.log(radioLabel);
        console.log(radioURL);

        fetch(radioURL)
            .then(radio => {
                if (radio.ok) {
                    return radio.json();
                }
                throw new Error(radi0.statusText);
            })
            .then(radioJson => radioResults(radioJson,radioLabel))
            .catch(err => {
                $('#js-error-message').text(`Opps!: ${err.message}`);
            });
    });
}




$(function () {
    handleSubmit();
    handleLearnMore();
    checkButtonSearch();


});




