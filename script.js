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
                //Creates variables for everything that needs to be put onto the page
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

    async compareWith(otherPokemon){
        try{
            const pokemonOneData = await this.fetchPokemonData()
            const pokemonTwoData = await otherPokemon.fetchPokemonData()

            const pokemonOneStats = pokemonOneData.stats
            const pokemonTwoStats = pokemonTwoData.stats      
            
            let pokemonOneArr = [pokemonOneData.weight, pokemonOneData.height]  //Sets the weight and height so they are always first in the array because the comparison method only works if both arrays have matching order
            let pokemonTwoArr = [pokemonTwoData.weight, pokemonTwoData.height]

            pokemonOneStats.forEach(stat => {
                pokemonOneArr.push(stat.base_stat)
            })

            pokemonTwoStats.forEach(stat => {
                pokemonTwoArr.push(stat.base_stat)
            })

            const statElementsOne = document.querySelectorAll('#p1 li')
            const statElementsTwo = document.querySelectorAll('#p2 li')
            
            //Goes through every index of the arrays and gives them a class depending on if the value is higher, lower or equal to the corresponding stat of the other pokemon
            for(let i = 0; i < pokemonOneArr.length; i++){
                if(pokemonOneArr[i] > pokemonTwoArr[i]){
                    statElementsOne[i].classList.add('higher-stat')
                    statElementsOne[i].classList.remove('lower-stat', 'equal-stat')
                    
                    statElementsTwo[i].classList.add('lower-stat')
                    statElementsTwo[i].classList.remove('higher-stat', 'equal-stat')
                }else if(pokemonOneArr[i] < pokemonTwoArr[i]){
                    statElementsOne[i].classList.add('lower-stat')
                    statElementsOne[i].classList.remove('higher-stat', 'equal-stat')
                    
                    statElementsTwo[i].classList.add('higher-stat')
                    statElementsTwo[i].classList.remove('lower-stat', 'equal-stat')
                }else{
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

    async pokemonFight(opponent){
        try{
            const thisData = await this.fetchPokemonData()
            const opponentData = await opponent.fetchPokemonData()
            
            let thisDataHP = thisData.stats[0].base_stat
            let opponentDataHP = opponentData.stats[0].base_stat

            let attacker, defender

            let textCont = document.querySelector(".fight-text-container")

            //Sets the order according to whoever has higher speed
            if(thisData.stats[5].base_stat > opponentData.stats[5].base_stat){
                attacker = thisData
                defender = opponentData
            }else{
                attacker = opponentData
                defender = thisData
            }

            while(thisDataHP > 0 && opponentDataHP > 0){
                //Creates the formula for the damage calculation and sets it so its always atleast 10 damage
                const damage = Math.round(Math.max(10, (attacker.stats[4].base_stat + attacker.stats[2].base_stat) - (defender.stats[3].base_stat + defender.stats[1].base_stat) * 0.8))
            
                //Checks what pokemon is the defender
                if(defender === opponentData){
                    opponentDataHP -= damage
                    const battleP = document.createElement("p")
                    battleP.innerText = `${attacker.name} used ${attacker.moves[0].move.name} and did ${damage} damage. ${defender.name} remaining HP: ${opponentDataHP <= 0 ? 0 : opponentDataHP}.`
                    textCont.append(battleP)
                }else{
                    thisDataHP -= damage
                    const battleP = document.createElement("p")
                    battleP.innerText = `${attacker.name} used ${attacker.moves[0].move.name} and did ${damage} damage. ${defender.name} remaining HP: ${thisDataHP <= 0 ? 0 : thisDataHP}.`
                    textCont.append(battleP)
                }
                        
                //Checks who is the defender and also checks if their hp is below or = 0
                if(defender === opponentData && opponentDataHP <= 0){
                    const faintedP = document.createElement("p")
                    faintedP.innerText = `${opponentData.name} fainted!`
                    textCont.append(faintedP)
                    break
                }else if (defender === thisData && thisDataHP <= 0){
                    const faintedP = document.createElement("p")
                    faintedP.innerText = `${thisData.name} fainted!`
                    textCont.append(faintedP)
                    break
                }
                //Used to change what pokemon is the attacker and which is the defender
                const temp = attacker
                attacker = defender
                defender = temp
            }

            //Displays the text after the battle is over
            if(thisDataHP <= 0){
                const wonP = document.createElement("p")
                wonP.innerText = `${opponentData.name} wins!`
                textCont.append(wonP)
            }else{
                const wonP = document.createElement("p")
                wonP.innerText = `${opponentData.name} wins!`
                textCont.append(wonP)
            }
        }catch(error){
            console.error("Error during fight: ", error)
        }
    }
}

//Function to update the page based on the chosen pokemon in the select
document.getElementById("selectOne").addEventListener("change", async () =>{
    const selectOne = document.getElementById("selectOne")
    const selectedPokemonIdOne = selectOne.value
    const pokemonOne = new Pokemon(selectedPokemonIdOne)
    await pokemonOne.displayPokemonData("p1")
})

//Function to update the page based on the chosen pokemon in the select
document.getElementById("selectTwo").addEventListener("change", async () => {
    const selectTwo = document.getElementById("selectTwo")
    const selectedPokemonIdTwo = selectTwo.value
    const pokemonTwo = new Pokemon(selectedPokemonIdTwo)
    await pokemonTwo.displayPokemonData("p2")
})

//Function to compare both of the chosen pokemon
document.querySelector("#compare-btn").addEventListener("click", async () =>{
    const selectOne = document.getElementById("selectOne")
    const selectedPokemonIdOne = selectOne.value
    const pokemonOne = new Pokemon(selectedPokemonIdOne)

    const selectTwo = document.getElementById("selectTwo")
    const selectedPokemonIdTwo = selectTwo.value
    const pokemonTwo = new Pokemon(selectedPokemonIdTwo)

    await pokemonOne.compareWith(pokemonTwo)
})

//Function to start the fighting sequence
document.querySelector("#fight-btn").addEventListener("click", async () =>{
    const textCont = document.querySelector(".fight-text-container")
    textCont.innerText = ""

    const selectOne = document.getElementById("selectOne")
    const selectedPokemonIdOne = selectOne.value
    const pokemonOne = new Pokemon(selectedPokemonIdOne)

    const selectTwo = document.getElementById("selectTwo")
    const selectedPokemonIdTwo = selectTwo.value
    const pokemonTwo = new Pokemon(selectedPokemonIdTwo)

    await pokemonOne.pokemonFight(pokemonTwo)
})