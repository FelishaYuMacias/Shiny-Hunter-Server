import Pokedex from 'pokedex-promise-v2';
const P = new Pokedex();

(async () => { // with Async/Await
    try {
        const golduckSpecies = await P.getPokemonSpeciesByName("golduck")
        const frenchName = golduckSpecies.names.filter(pokeAPIName => pokeAPIName.language.name === 'fr')[0].name
        console.log(frenchName)
    } catch (error) {
        throw error
    }
})()

P.getPokemonByName(['eevee', 'ditto']) // with Promise
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.log('There was an ERROR: ', error);
  });

P.getPokemonByName(34, (response, error) => { // with callback
    if(!error) {
      console.log(response);
    } else {
      console.log(error)
    }
  });

P.getResource(['/api/v2/pokemon/36', 'api/v2/berry/8', 'https://pokeapi.co/api/v2/ability/9/'])
  .then((response) => {
    console.log(response); // the getResource function accepts singles or arrays of URLs/paths
  });