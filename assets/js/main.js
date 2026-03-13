const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const searchInput = document.getElementById("searchInput");

const maxRecords = 151
const limit = 5
let offset = 0;
let allPokemons = [];
let isSearching = false;

function loadAllPokemons() {
    pokeApi.getPokemons(0, maxRecords).then((pokemons = []) => {
        allPokemons = pokemons;
        displayPokemons(0, limit);
        offset = limit;
    });
}

function displayPokemons(start, count) {
    const toDisplay = allPokemons.slice(start, start + count);
    const newHtml = toDisplay.map((pokemon) =>  `
        <li class="pokemon ${pokemon.type}" data-id="${pokemon.number}">
            <span class="number">${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>
            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    `).join('');
    pokemonList.innerHTML += newHtml;

    // Add click listeners to new items
    const newLis = pokemonList.querySelectorAll('li[data-id]');
    newLis.forEach(li => {
        li.addEventListener('click', () => {
            const id = li.getAttribute('data-id');
            showModal(id);
        });
    });
}

loadAllPokemons();

loadMoreButton.addEventListener('click', () => {
    if (isSearching) return;
    displayPokemons(offset, limit);
    offset += limit;
    if (offset >= maxRecords) {
        loadMoreButton.parentElement.removeChild(loadMoreButton);
    }
});

searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase();
    if (value === '') {
        isSearching = false;
        pokemonList.innerHTML = '';
        displayPokemons(0, offset);
        if (offset < maxRecords) {
            loadMoreButton.style.display = '';
        }

        const allLis = pokemonList.querySelectorAll('li[data-id]');
        allLis.forEach(li => {
            li.addEventListener('click', () => {
                const id = li.getAttribute('data-id');
                showModal(id);
            });
        });
    } else {
        isSearching = true;
        const filtered = allPokemons.filter(p => p.name.toLowerCase().includes(value));
        const newHtml = filtered.map((pokemon) =>  `
            <li class="pokemon ${pokemon.type}" data-id="${pokemon.number}">
                <span class="number">${pokemon.number}</span>
                <span class="name">${pokemon.name}</span>
                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>
                    <img src="${pokemon.photo}" alt="${pokemon.name}">
                </div>
            </li>
        `).join('');
        pokemonList.innerHTML = newHtml;

        // Add click listeners to filtered items
        const filteredLis = pokemonList.querySelectorAll('li[data-id]');
        filteredLis.forEach(li => {
            li.addEventListener('click', () => {
                const id = li.getAttribute('data-id');
                showModal(id);
            });
        });

        loadMoreButton.style.display = 'none';
    }
});

const typeColors = {
    normal: '#afb189f9',
    grass: '#9aca86',
    fire: '#eba072',
    water: '#acbfed',
    electric: '#fce793',
    ice: '#e1ebeb',
    ground: '#dfca92',
    flying: '#cebfff',
    poison: '#c090c0',
    fighting: '#be6560',
    psychic: '#ff9fbc',
    dark: '#86766c',
    rock: '#c0b275',
    bug: '#b5bd70',
    ghost: '#9183ab',
    steel: '#b9b7cf',
    dragon: '#a585f8',
    fairy: '#f9aec7'
};

function showModal(id) {
    pokeApi.getFullPokemonDetail(id).then(details => {
        const modalContent = document.querySelector('.modal-content');
        const type = details.types[0].type.name;
        const color = typeColors[type] || '#fefefe';
        modalContent.style.backgroundColor = color;
        modalContent.style.color = color === '#fefefe' ? '#333' : 'white';

        document.getElementById('modalName').textContent = details.name.charAt(0).toUpperCase() + details.name.slice(1);
        document.getElementById('modalImage').src = details.sprites.other.dream_world.front_default;
        document.getElementById('modalHeight').textContent = `Altura: ${details.height / 10} m`;
        document.getElementById('modalWeight').textContent = `Peso: ${details.weight / 10} kg`;

        const statsDiv = document.getElementById('modalStats');
        statsDiv.innerHTML = '<h3>Status:</h3>' + details.stats.map(stat => `<p>${stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1)}: ${stat.base_stat}</p>`).join('');

        const abilitiesDiv = document.getElementById('modalAbilities');
        abilitiesDiv.innerHTML = '<h3>Habilidades:</h3>' + details.abilities.map(ability => `<p>${ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1)}</p>`).join('');

        document.getElementById('pokemonModal').classList.add('show');
    });
}

// Modal close
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('pokemonModal').classList.remove('show');
});

window.addEventListener('click', (event) => {
    if (event.target == document.getElementById('pokemonModal')) {
        document.getElementById('pokemonModal').classList.remove('show');
    }
});