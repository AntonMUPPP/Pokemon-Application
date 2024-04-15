class Pokemon{
    constructor(id){
        this.id = id
    }

    async fetchPokemonData(){
        try{
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${this.id}`)
            const data = await response.json()
            return data
        }catch(error){
            console.error("Error fetching data: ", error)
        }
    }

    async displayPokemonData(containerId){
        try{
            const pokemonData = await this.fetchPokemonData()
            if(pokemonData){
                const name = pokemonData.name
                const id = pokemonData.id
                const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
                const types = pokemonData.types
                const weight = pokemonData.weight
                const height = pokemonData.height
                const stats = pokemonData.stats
                const pokemonContainer = document.getElementById(containerId)
                let typesHTML = ""
                types.forEach(type => {
                    typesHTML += `<p>${type.type.name}</p>`
                })
                let statsHTML = ""
                stats.forEach(stat => {
                    statsHTML += `<li id="${id}-${stat.stat.name}">${stat.stat.name}: ${stat.base_stat}</li>`
                })
                pokemonContainer.innerHTML = `
                <h2>${name}</h2>
                <img src="${imageUrl}">
                <div class="type-container">${typesHTML}</div>
                <ul>
                    <li>Weight: ${weight}</li>
                    <li>Height: ${height}</li>
                </ul>
                <h3>Stats:</h3>
                <ul>${statsHTML}</ul>`
            }
        }catch(error){
            console.error("Error: ", error)
        }
    }
    async compareWith(otherPokemon) {
        try{
            const pokemonOneData = await this.fetchPokemonData()
            const pokemonTwoData = await otherPokemon.fetchPokemonData()

            const pokemonOneStats = pokemonOneData.stats
            const pokemonTwoStats = pokemonTwoData.stats      
            
            let pokemonOneArr = [pokemonOneData.weight, pokemonOneData.height]
            let pokemonTwoArr = [pokemonTwoData.weight, pokemonTwoData.height]

            pokemonOneStats.forEach(stat => {
                pokemonOneArr.push(stat.base_stat)
            })

            pokemonTwoStats.forEach(stat => {
                pokemonTwoArr.push(stat.base_stat)
            })

            const statElementsOne = document.querySelectorAll('#p1 li')
            const statElementsTwo = document.querySelectorAll('#p2 li')
            
            for (let i = 0; i < pokemonOneArr.length; i++) {
                if (pokemonOneArr[i] > pokemonTwoArr[i]) {
                    statElementsOne[i].classList.add('higher-stat')
                    statElementsOne[i].classList.remove('lower-stat', 'equal-stat')
                    
                    statElementsTwo[i].classList.add('lower-stat')
                    statElementsTwo[i].classList.remove('higher-stat', 'equal-stat')
                } else if (pokemonOneArr[i] < pokemonTwoArr[i]) {
                    statElementsOne[i].classList.add('lower-stat')
                    statElementsOne[i].classList.remove('higher-stat', 'equal-stat')
                    
                    statElementsTwo[i].classList.add('higher-stat')
                    statElementsTwo[i].classList.remove('lower-stat', 'equal-stat')
                } else {
                    statElementsOne[i].classList.add('equal-stat')
                    statElementsOne[i].classList.remove('higher-stat', 'lower-stat')
                    
                    statElementsTwo[i].classList.add('equal-stat')
                    statElementsTwo[i].classList.remove('higher-stat', 'lower-stat')
                }
            }
        }catch(error){
            console.error("Error comparing pokemon: ", error)
        }
    }
}

document.getElementById("selectOne").addEventListener("change", async () =>{
    const selectOne = document.getElementById("selectOne")
    const selectedPokemonIdOne = selectOne.value
    const pokemonOne = new Pokemon(selectedPokemonIdOne)
    await pokemonOne.displayPokemonData("p1")
})

document.getElementById("selectTwo").addEventListener("change", async () => {
    const selectTwo = document.getElementById("selectTwo")
    const selectedPokemonIdTwo = selectTwo.value
    const pokemonTwo = new Pokemon(selectedPokemonIdTwo)
    await pokemonTwo.displayPokemonData("p2")
})

document.querySelector("#compare-btn").addEventListener("click", async () =>{
    const selectOne = document.getElementById("selectOne")
    const selectedPokemonIdOne = selectOne.value
    const pokemonOne = new Pokemon(selectedPokemonIdOne)

    const selectTwo = document.getElementById("selectTwo")
    const selectedPokemonIdTwo = selectTwo.value
    const pokemonTwo = new Pokemon(selectedPokemonIdTwo)

    await pokemonOne.compareWith(pokemonTwo)
})