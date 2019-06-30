// Fetches search suggestions from Open Movie Database api.
// return values should be formatted for the search component (list of strings)
// Error values should be of type string.
export default async function(searchTerm) {
  const url = 'http://www.omdbapi.com/'
    + '?apikey=b2f189da'
    + '&s=' + encodeURIComponent(searchTerm)
  
  const response = await fetch(url);
  const result = await response.json();

  if (result.Error) {
    const error = typeof result.Error === 'string' ? result.Error : 'Something went wrong.'
    return Promise.reject(error);
  } else {
    return result.Search.map(item => item.Title)
  }
}
