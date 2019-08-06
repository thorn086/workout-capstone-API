'use strict'

//global consts
const searchURL = "https://wger.de/api/v2/exercise/search/";


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
    $('#wger-results-user').empty();
    console.log(idJson.name);
        $('#wger-results-user').append(
            `<li><h3>${idJson.name}</h3>
        <p>${idJson.description}</p>
        <button id="back"> Go Back</button></li>`
        );
    

    //$('#results').removeClass('hidden');
};


// creat a term fetch 
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
        .then(wgerJson => displayResults(wgerJson))
        .catch(err => {
            $('#js-error-message').text(`Opps!: ${err.message}`);
        });
}


// listener for the submit button to display the results
function handleSubmit() {
    $('#exercise-form').submit(event => {
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
        fetchExInfo(idName);
    });

}

$(function () {
    handleSubmit();
    handleLearnMore();
    
});



//hadle checked items so only one can be checked

var limit = 3;
$('.compare_items').on('click', function (evt) {
    index = $(this).parent('td').parent('tr').index();
    if ($('.compare_items:checked').length >= limit) {
        $('.compare_items').eq(localStorage.getItem('last-checked-item')).removeAttr('checked');
        //this.checked = false;
    }
    localStorage.setItem('last-checked-item', index);
});