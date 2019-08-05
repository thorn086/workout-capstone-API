'use strict'

//global consts
const searchURL ="https://wger.de/api/v2/exercise/search/";


//format params
function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

//display wgerJson fundtions to DOM
function displayResults(wgerJson) {
  
    console.log(wgerJson);
    $('#wger-results-user').empty();
  
    for (let i = 0; i < wgerJson.suggestions.length; i++){
        
      $('#wger-results-user').append(
        `<li><h3>${wgerJson.suggestion[i].data.name}</h3>
        <p>${wgerJson.suggestion[i].data.category}</p>
        <a href='${wgerJson.suggestion[i].data.id}'</a>
        </li>`
      )};
     
    //$('#results').removeClass('hidden');
  };

// creat a term fetch 
function getTerm(userTerm){
  const params={
      term:userTerm
  };

   const queryString =formatQueryParams(params);
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
    const userTerm= $('#search-field').val();
    getTerm(userTerm);
});
}
$(handleSubmit);
