const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const progressBar = document.querySelectorAll('.animated-progress span')
// Get the modal
const modal = document.getElementById("pokeModal")
const contentModal = document.getElementById("containerModal")
const maxRecords = 151
const limit = 10
let offset = 0;

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
  
function loadPokemonDetailCard(pokemonNumber){
    pokeApi.getPokemonDetailCard(pokemonNumber).then((pokemon)=> {
        // When the user clicks the button, open the modal 
        modal.style.display = "block";
        const htmlCard = convertPokemonDetailCard(pokemon)
        contentModal.innerHTML = htmlCard
    })
}

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span id="${pokemon.number}" class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function convertPokemonDetailCard(pokemon){
    console.log(pokemon.stats);
    let pokeObjList = [];


    for(var n = 0; n < pokemon.stats.baseNumber.length; n++){
        let pokeObj = {};
        pokeObj.stat = pokemon.stats.name[n];
        pokeObj.baseNumber = pokemon.stats.baseNumber[n];
        pokeObjList = [...pokeObjList, pokeObj];
    }

   return `
        <div class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name-detail">${pokemon.name}</span>
            <div class="detail-card">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
            </div>
            <div class="pokemon-container">
                <div class="img-detail">
                    <img src="${pokemon.photo}"
                    alt="${pokemon.name}">
                </div>
                <div class="ability-square">
                    ${pokemon.abilities.map((ability) => `<div class="ability"><span class="ability-name">${ability}</span></div>`).join('')}
                </div>
            </div>
            <div class="poke-stats ${pokemon.type}">
                ${pokeObjList.map((pokemonStats) => ` <span class="name-detail">${pokemonStats.stat}<span><div class="progress-bar"><div class="progress-fill progress-${pokemonStats.stat}">${pokemonStats.baseNumber}</div></div>`).join('')}
            </div>
        </div>
    `
}
function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
        const listPokemonLi = document.getElementsByClassName('pokemon');
        for(var i = 0; i < listPokemonLi.length; i++) {
            listPokemonLi[i].addEventListener('click', (e)=> loadPokemonDetailCard(e.target.id))
        }
    })
}



loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

