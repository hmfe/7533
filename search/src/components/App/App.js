import React from 'react';
import Search from '../Search';
import OMDBSearch from '../../utils/searchapis/omdb-search';

function App() {
  return (
    <div>
      <main>
        <Search fetchSuggestions={OMDBSearch}/>
      </main>
    </div>
  );
}

export default App;
