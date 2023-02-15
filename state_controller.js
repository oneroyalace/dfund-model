import { Controller } from "https://unpkg.com/@hotwired/stimulus/dist/stimulus.js"

const costPerEditorialEmployee = 96_058.43902
let editorialEstimate
let nonEditorialEstimate
let fundingEstimate
const localityTypes = ["cd", "ts", "muni", "ss", "sd", "county", "state"]
const localityNamesPrettied= { cd: "congressional district", ss: "school system", sd: "special district", ts: "township government", muni: "municipal government", county: "county government", state: "state government" }
const localityNamesPrettiedPluralized = { cd: "congressional districts", ss: "school systems", sd: "special districts", ts: "township governments", muni: "municipal governments", county: "county governments", state: "state governments" }

const inflationFactors = {
  2021: 1,
  2022: 1.065, // 6.5% 2022 inflation
  2023: 1.065 * 1.03 // 6.5% 2022 inflation, 3% 2023 inflation  
}

const multiplierMap = {
      "Extra Small": 0.5,
      "Small": 1,
      "Medium": 2,
      "Large": 3,
      "Extra Large": 4,
}

const states = {"Alabama": {"size": "Small", "population": {"2021": 4903185, "2025": 4800092, "2030": 4874243}, "cd": 7, "ss": 137, "sd": 530, "ts": 0, "muni": 461, "county": 67, "state": 1, "giving": 229406215}, "Alaska": {"size": "Extra Small", "population": {"2021": 731545, "2025": 820881, "2030": 867674}, "cd": 1, "ss": 55, "sd": 15, "ts": 0, "muni": 149, "county": 15, "state": 1, "giving": 42426591}, "Arizona": {"size": "Medium", "population": {"2021": 7278717, "2025": 9531537, "2030": 10712397}, "cd": 9, "ss": 254, "sd": 310, "ts": 0, "muni": 91, "county": 15, "state": 1, "giving": 344965290}, "Arkansas": {"size": "Small", "population": {"2021": 3017804, "2025": 3151005, "2030": 3240208}, "cd": 4, "ss": 235, "sd": 730, "ts": 0, "muni": 501, "county": 75, "state": 1, "giving": 721774468}, "California": {"size": "Extra Large", "population": {"2021": 39512223, "2025": 44305177, "2030": 46444861}, "cd": 53, "ss": 1068, "sd": 2894, "ts": 0, "muni": 482, "county": 57, "state": 1, "giving": 8372783639}, "Colorado": {"size": "Medium", "population": {"2021": 5758736, "2025": 5522803, "2030": 5792357}, "cd": 7, "ss": 180, "sd": 2628, "ts": 0, "muni": 271, "county": 62, "state": 1, "giving": 834294096}, "Connecticut": {"size": "Small", "population": {"2021": 3565287, "2025": 3691016, "2030": 3688630}, "cd": 5, "ss": 166, "sd": 429, "ts": 149, "muni": 30, "county": 0, "state": 1, "giving": 900843697}, "Delaware": {"size": "Extra Small", "population": {"2021": 973764, "2025": 990694, "2030": 1012658}, "cd": 1, "ss": 19, "sd": 255, "ts": 0, "muni": 57, "county": 3, "state": 1, "giving": 865625755}, "Florida": {"size": "Extra Large", "population": {"2021": 21477737, "2025": 25912458, "2030": 28685769}, "cd": 27, "ss": 95, "sd": 1139, "ts": 0, "muni": 412, "county": 66, "state": 1, "giving": 1751976917}, "Georgia": {"size": "Large", "population": {"2021": 10617423, "2025": 11438622, "2030": 12017838}, "cd": 14, "ss": 180, "sd": 511, "ts": 0, "muni": 537, "county": 152, "state": 1, "giving": 1191092441}, "Hawaii": {"size": "Small", "population": {"2021": 1415872, "2025": 1438720, "2030": 1466046}, "cd": 2, "ss": 1, "sd": 17, "ts": 0, "muni": 1, "county": 3, "state": 1, "giving": 109213958}, "Idaho": {"size": "Small", "population": {"2021": 1787065, "2025": 1852627, "2030": 1969624}, "cd": 2, "ss": 118, "sd": 808, "ts": 0, "muni": 200, "county": 44, "state": 1, "giving": 86593975}, "Illinois": {"size": "Large", "population": {"2021": 12671821, "2025": 13340507, "2030": 13432892}, "cd": 18, "ss": 886, "sd": 3204, "ts": 1429, "muni": 1297, "county": 102, "state": 1, "giving": 3610445653}, "Indiana": {"size": "Medium", "population": {"2021": 6732219, "2025": 6721322, "2030": 6810108}, "cd": 9, "ss": 289, "sd": 687, "ts": 1004, "muni": 567, "county": 91, "state": 1, "giving": 1483101186}, "Iowa": {"size": "Small", "population": {"2021": 3155070, "2025": 2993222, "2030": 2955172}, "cd": 4, "ss": 348, "sd": 551, "ts": 0, "muni": 943, "county": 99, "state": 1, "giving": 230666534}, "Kansas": {"size": "Small", "population": {"2021": 2913314, "2025": 2919002, "2030": 2940084}, "cd": 4, "ss": 306, "sd": 1493, "ts": 1265, "muni": 625, "county": 103, "state": 1, "giving": 215721644}, "Kentucky": {"size": "Small", "population": {"2021": 4467673, "2025": 4489662, "2030": 4554998}, "cd": 6, "ss": 173, "sd": 614, "ts": 0, "muni": 417, "county": 118, "state": 1, "giving": 185116421}, "Louisiana": {"size": "Small", "population": {"2021": 4648794, "2025": 4762398, "2030": 4802633}, "cd": 6, "ss": 70, "sd": 83, "ts": 0, "muni": 304, "county": 60, "state": 1, "giving": 237237316}, "Maine": {"size": "Small", "population": {"2021": 1344212, "2025": 1414402, "2030": 1411097}, "cd": 2, "ss": 258, "sd": 232, "ts": 465, "muni": 23, "county": 16, "state": 1, "giving": 159795511}, "Maryland": {"size": "Medium", "population": {"2021": 6045680, "2025": 6762732, "2030": 7022251}, "cd": 8, "ss": 39, "sd": 164, "ts": 0, "muni": 157, "county": 23, "state": 1, "giving": 887897207}, "Massachusetts": {"size": "Medium", "population": {"2021": 6892503, "2025": 6938636, "2030": 7012009}, "cd": 9, "ss": 321, "sd": 417, "ts": 298, "muni": 53, "county": 5, "state": 1, "giving": 1674862137}, "Michigan": {"size": "Medium", "population": {"2021": 9986857, "2025": 10713730, "2030": 10694172}, "cd": 14, "ss": 571, "sd": 436, "ts": 1240, "muni": 533, "county": 83, "state": 1, "giving": 1663756427}, "Minnesota": {"size": "Medium", "population": {"2021": 5639632, "2025": 6108787, "2030": 6306130}, "cd": 8, "ss": 333, "sd": 590, "ts": 1780, "muni": 853, "county": 87, "state": 1, "giving": 1343337650}, "Mississippi": {"size": "Small", "population": {"2021": 2976149, "2025": 3069420, "2030": 3092410}, "cd": 4, "ss": 160, "sd": 432, "ts": 0, "muni": 298, "county": 82, "state": 1, "giving": 96286772}, "Missouri": {"size": "Medium", "population": {"2021": 6137428, "2025": 6315366, "2030": 6430173}, "cd": 8, "ss": 530, "sd": 1897, "ts": 283, "muni": 944, "county": 114, "state": 1, "giving": 1110991342}, "Montana": {"size": "Small", "population": {"2021": 1068778, "2025": 1037387, "2030": 1044898}, "cd": 1, "ss": 313, "sd": 730, "ts": 0, "muni": 129, "county": 54, "state": 1, "giving": 80508508}, "Nebraska": {"size": "Small", "population": {"2021": 1934408, "2025": 1812787, "2030": 1820247}, "cd": 3, "ss": 269, "sd": 1281, "ts": 366, "muni": 529, "county": 93, "state": 1, "giving": 1043355636}, "Nevada": {"size": "Small", "population": {"2021": 3080156, "2025": 3863298, "2030": 4282102}, "cd": 4, "ss": 17, "sd": 137, "ts": 0, "muni": 19, "county": 16, "state": 1, "giving": 360845841}, "New Hampshire": {"size": "Small", "population": {"2021": 1359711, "2025": 1586348, "2030": 1646471}, "cd": 2, "ss": 178, "sd": 129, "ts": 221, "muni": 13, "county": 10, "state": 1, "giving": 170839121}, "New Jersey": {"size": "Medium", "population": {"2021": 8882190, "2025": 9636644, "2030": 9802440}, "cd": 12, "ss": 593, "sd": 233, "ts": 241, "muni": 324, "county": 21, "state": 1, "giving": 4130119172}, "New Mexico": {"size": "Small", "population": {"2021": 2096829, "2025": 2106584, "2030": 2099708}, "cd": 3, "ss": 96, "sd": 779, "ts": 0, "muni": 105, "county": 33, "state": 1, "giving": 82529996}, "New York": {"size": "Extra Large", "population": {"2021": 19453561, "2025": 19540179, "2030": 19477429}, "cd": 27, "ss": 714, "sd": 1185, "ts": 929, "muni": 601, "county": 57, "state": 1, "giving": 10490751818}, "North Carolina": {"size": "Large", "population": {"2021": 10488084, "2025": 11449153, "2030": 12227739}, "cd": 13, "ss": 174, "sd": 318, "ts": 0, "muni": 552, "county": 100, "state": 1, "giving": 1415232576}, "North Dakota": {"size": "Extra Small", "population": {"2021": 762062, "2025": 620777, "2030": 606566}, "cd": 1, "ss": 179, "sd": 767, "ts": 1308, "muni": 357, "county": 53, "state": 1, "giving": 22904979}, "Ohio": {"size": "Large", "population": {"2021": 11689100, "2025": 11605738, "2030": 11550528}, "cd": 16, "ss": 666, "sd": 904, "ts": 1308, "muni": 931, "county": 88, "state": 1, "giving": 1672835323}, "Oklahoma": {"size": "Small", "population": {"2021": 3956971, "2025": 3820994, "2030": 3913251}, "cd": 5, "ss": 542, "sd": 621, "ts": 0, "muni": 590, "county": 77, "state": 1, "giving": 738122169}, "Oregon": {"size": "Small", "population": {"2021": 4217737, "2025": 4536418, "2030": 4833918}, "cd": 5, "ss": 230, "sd": 1004, "ts": 0, "muni": 240, "county": 36, "state": 1, "giving": 399847794}, "Pennsylvania": {"size": "Large", "population": {"2021": 12801989, "2025": 12801945, "2030": 12768184}, "cd": 18, "ss": 514, "sd": 1691, "ts": 1546, "muni": 1013, "county": 66, "state": 1, "giving": 2469569058}, "Rhode Island": {"size": "Small", "population": {"2021": 1059361, "2025": 1157855, "2030": 1152941}, "cd": 2, "ss": 36, "sd": 86, "ts": 31, "muni": 8, "county": 0, "state": 1, "giving": 386480541}, "South Carolina": {"size": "Medium", "population": {"2021": 5148714, "2025": 4989550, "2030": 5148569}, "cd": 7, "ss": 81, "sd": 274, "ts": 0, "muni": 270, "county": 46, "state": 1, "giving": 187046418}, "South Dakota": {"size": "Extra Small", "population": {"2021": 884659, "2025": 801845, "2030": 800462}, "cd": 1, "ss": 150, "sd": 487, "ts": 902, "muni": 311, "county": 66, "state": 1, "giving": 54279722}, "Tennessee": {"size": "Medium", "population": {"2021": 6829174, "2025": 7073125, "2030": 7380634}, "cd": 9, "ss": 142, "sd": 455, "ts": 0, "muni": 345, "county": 92, "state": 1, "giving": 672707947}, "Texas": {"size": "Extra Large", "population": {"2021": 28995881, "2025": 30865134, "2030": 33317744}, "cd": 36, "ss": 1075, "sd": 2798, "ts": 0, "muni": 1218, "county": 254, "state": 1, "giving": 3212599988}, "Utah": {"size": "Small", "population": {"2021": 3205958, "2025": 3225680, "2030": 3485367}, "cd": 4, "ss": 41, "sd": 299, "ts": 0, "muni": 250, "county": 29, "state": 1, "giving": 218902529}, "Vermont": {"size": "Extra Small", "population": {"2021": 623989, "2025": 703288, "2030": 711867}, "cd": 1, "ss": 277, "sd": 159, "ts": 237, "muni": 42, "county": 14, "state": 1, "giving": 54846677}, "Virginia": {"size": "Medium", "population": {"2021": 8535519, "2025": 9364304, "2030": 9825019}, "cd": 11, "ss": 134, "sd": 193, "ts": 0, "muni": 228, "county": 95, "state": 1, "giving": 652950480}, "Washington": {"size": "Medium", "population": {"2021": 7614893, "2025": 7996400, "2030": 8624801}, "cd": 10, "ss": 295, "sd": 1285, "ts": 0, "muni": 281, "county": 39, "state": 1, "giving": 4583276833}, "West Virginia": {"size": "Small", "population": {"2021": 1792147, "2025": 1766435, "2030": 1719959}, "cd": 3, "ss": 55, "sd": 309, "ts": 0, "muni": 232, "county": 55, "state": 1, "giving": 72994735}, "Wisconsin": {"size": "Medium", "population": {"2021": 5822434, "2025": 6088374, "2030": 6150764}, "cd": 8, "ss": 441, "sd": 734, "ts": 1251, "muni": 601, "county": 72, "state": 1, "giving": 696879197}, "Wyoming": {"size": "Extra Small", "population": {"2021": 578759, "2025": 529031, "2030": 522979}, "cd": 1, "ss": 55, "sd": 617, "ts": 0, "muni": 99, "county": 23, "state": 1, "giving": 119354233}}
export default class extends Controller {
  static targets = [
    "numDemCoverageAreasSelector",
    "numGovCoverageAreasSelector",
    "editorialEstimate",
    "nonEditorialEstimate",
    "totalStaffEstimate",
    "fundingEstimate",
    "stateTable", 
    "stateSelector", 

    "stateNameStateTableRow",
    "populationStateTableRow",
    "sizeStateTableRow",
    "cdStateTableRow",
    "ssStateTableRow",
    "sdStateTableRow",
    "tsStateTableRow",
    "muniStateTableRow",
    "countyStateTableRow",
    "stateStateTableRow",
    "givingStateTableRow",

    "inflationSlider",
    "populationSlider",

    "cdCalculationTableRow",
    "ssCalculationTableRow",
    "sdCalculationTableRow",
    "tsCalculationTableRow",
    "muniCalculationTableRow",
    "countyCalculationTableRow",
    "stateCalculationTableRow",
    "_100kCalculationTableRow",
    "allCalculationTableRow",


    "calculationEstimateDescriptionDiv",
    "calculationEstimateExplanationDiv",
    "calculationDiv"
  ]
  connect() {
    console.log("hotwired")
    this.populateStateTable("Alabama")
    this.updateEstimates()
  }

  getPopulationyear() {
    const years = ["2021", "2025", "2030"]
    return years[this.populationSliderTarget.value]
  }

  getInflationYear() {
    return this.inflationSliderTarget.value
  }

  getActiveState() {
    return this.stateSelectorTarget.value
  }

  getReportersPer() {
    return [...document.querySelectorAll(".num-reporters-input")].map(x => parseInt(x.value))
                                                               .reduce((x,y) => x+y)
  }

  // Update state table values
  populateStateTable(){
    let selectedState = this.getActiveState() 
    console.log(this.getPopulationyear(), typeof(this.getPopulationyear()))
    console.log(states[selectedState].population)

    this.stateNameStateTableRowTarget.innerText = selectedState
    this.populationStateTableRowTarget.innerText = this.prettifyInteger(states[selectedState].population[this.getPopulationyear()])
    this.sizeStateTableRowTarget.innerText = states[selectedState].size
    this.cdStateTableRowTarget.innerText = states[selectedState].cd
    this.ssStateTableRowTarget.innerText = this.prettifyInteger(states[selectedState].ss || 0)
    this.sdStateTableRowTarget.innerText = this.prettifyInteger(states[selectedState].sd || 0)
    this.tsStateTableRowTarget.innerText = this.prettifyInteger(states[selectedState].ts || 0)
    this.muniStateTableRowTarget.innerText = states[selectedState].muni
    this.countyStateTableRowTarget.innerText = states[selectedState].county
    this.stateStateTableRowTarget.innerText = states[selectedState].state
    this.givingStateTableRowTarget.innerText = `$${this.prettifyInteger(states[selectedState].giving || 0)}`
   
    this.updateEstimates()
  }

  calculateEditorialEstimate() {
    const activeState = states[this.getActiveState()]
    const reportersPer = this.getReportersPer()
    const sizeMultiplier = multiplierMap[activeState.size]

    console.log(reportersPer*activeState.cd)
    console.log(reportersPer*activeState.sd * sizeMultiplier)
    console.log(reportersPer*activeState.ts)
    console.log(reportersPer*activeState.muni )
    console.log(reportersPer*activeState.county * sizeMultiplier)
    console.log(reportersPer*activeState.state * sizeMultiplier)
    console.log(reportersPer*activeState.population[this.getPopulationyear()]/100_000)
    console.log(reportersPer*activeState.ss * sizeMultiplier)

    return reportersPer * (
      (activeState.cd) + 
      (activeState.sd * sizeMultiplier) +
      (activeState.ts) +
      (activeState.muni) +
      (activeState.county * sizeMultiplier) +
      (activeState.state * sizeMultiplier) +
      (activeState.population[this.getPopulationyear()]/100_000)) +
      (activeState.ss * sizeMultiplier)

  }

  produceCalculationDiv() {
    const activeState = states[this.getActiveState()]
    // console.log(activeState)

    let div = "<div>"
    let innerDivs = []
    const multiplierLocalityTypes = ["sd", "ss", "county", "state"]

    div += `<div>(${this.getReportersPer()} editorial employees per 100k people * state population of ${this.prettifyInteger(activeState["population"][this.getPopulationyear()])}) +</div>`

    for(const localityType of localityTypes) {
      if (activeState[localityType] == 0 ){
        continue
      }
      let numberOfLocalities = activeState[localityType]
      let innerDiv = "<div>"
      innerDiv += `<span class="reporters-per-text">(${this.getReportersPer()} editorial employees per ${localityNamesPrettied[localityType]})</span>`
      innerDiv += '<span class="multiplication"> * </span>'
      innerDiv += `<span class="num-localities-text">(${this.prettifyInteger(activeState[localityType])} ${localityNamesPrettiedPluralized[localityType]})</span>`
      
      if(multiplierLocalityTypes.includes(localityType)) {
        innerDiv += '<span class="multiplication"> * </span>'
        innerDiv += `<span class="multiplier-text">${activeState["size"].toLowerCase()} state size multiplier of ${multiplierMap[activeState.size]})</span>`
      }

      innerDiv += " +"
      innerDiv += "</div>"
      innerDivs.push(innerDiv)
    }
    div += innerDivs.join("")
    div = div.slice(0, -7)
    div += "</div>"
    div += "</div>"
    return div
  }

  changeInflationYear(event) {
    let target = event.target
    let year = target.value
    target.parentElement.firstElementChild.innerText = `Estimating cost using ${year} dollars`

    this.updateEstimates()
  }

  changePopulationYear(event) {
    const years = ["2021", "2025", "2030"] // we do this since 2021->2025->2030 doesn't have a consistent step
    const year = years[event.target.value]
    
    event.target.parentElement.firstElementChild.innerText = `Estimating needs using ${year} population`
    this.updateEstimates() 
  }

  
  toggleModal() {
    document.querySelector(".modal").classList.toggle("show-modal")
    document.querySelector(".modal-content").classList.toggle("invisible")
    document.querySelector("#national-calculator").classList.toggle("blurred")
    document.querySelectorAll(".num-reporters-input").forEach(i => i.classList.toggle("muted-background"))
  }

  hideModal() {
    console.log("hiding modal")
    if(document.querySelector(".modal").classList.contains("show-modal"))
      this.toggleModal()
  }

  showModal() {
    this.toggleModal()
  }

  // Re-calculate estimates of # of editorial employees, non-editorial employees, and $ required for state
  updateEstimates() {
    const activeState = this.getActiveState()
    const reportersPer = this.getReportersPer()

    editorialEstimate = this.calculateEditorialEstimate()
    nonEditorialEstimate = editorialEstimate * (2/3)
    fundingEstimate = (editorialEstimate + nonEditorialEstimate) * costPerEditorialEmployee * inflationFactors[this.getInflationYear()]

    this.editorialEstimateTarget.innerText = this.prettifyInteger(Math.round(editorialEstimate))
    this.nonEditorialEstimateTarget.innerText = this.prettifyInteger(Math.round(nonEditorialEstimate))
    this.fundingEstimateTarget.innerText = this.prettifyInteger(Math.round(fundingEstimate))
    this.totalStaffEstimateTarget.innerText = this.prettifyInteger(Math.round(editorialEstimate + nonEditorialEstimate))

    this.updateCalculationTable()
    this.updateExplanations()
  }

  updateCalculationTable() {
    const activeState = states[this.getActiveState()]
    const multiplier = multiplierMap[activeState.size]
    this.cdCalculationTableRowTarget.innerText = activeState.cd * this.getReportersPer()
    this.sdCalculationTableRowTarget.innerText = activeState.sd * this.getReportersPer() * multiplier
    this.tsCalculationTableRowTarget.innerText = activeState.ts * this.getReportersPer()
    this.muniCalculationTableRowTarget.innerText = activeState.muni * this.getReportersPer()
    this.countyCalculationTableRowTarget.innerText = activeState.county * this.getReportersPer() * multiplier 
    this.stateCalculationTableRowTarget.innerText = activeState.state * this.getReportersPer() * multiplier
    this._100kCalculationTableRowTarget.innerText = Math.round((activeState.population[this.getPopulationyear()]/100_000) * this.getReportersPer())
    this.ssCalculationTableRowTarget.innerText = activeState.ss * 1 * multiplier

    
    
    
    this.allCalculationTableRowTarget.innerText = Math.round(editorialEstimate)
  }

  //     return reportersPer * (
  //     (activeState.cd) + 
  //     (activeState.sd * sizeMultiplier) +
  //     (activeState.ts) +
  //     (activeState.muni) +
  //     (activeState.county * sizeMultiplier) +
  //     (activeState.state * sizeMultiplier) +
  //     (activeState.population[this.getPopulationyear()]/100_000)) +
  //     (activeState.ss * sizeMultiplier)

  // }

  updateExplanations() {
    this.updateEstimateDescription()
    this.updateEstimateExplanation()
    this.updateEstimateCalculation()
  }

  updateEstimateDescription() {
    this.calculationEstimateDescriptionDivTarget.innerText = `The model currently estimates that ${Math.round(editorialEstimate)} journalists will be required to cover all the congressional districts in the US.`
  }

  updateEstimateExplanation() {
    const activeState = states[this.getActiveState()]
    
    let estimateExplanationDiv = `<div><span>There are <span class="num-localities-text">` 
    // let localitiesSpan = '<span class="num-localities-text">'
    let localitiesArray = []
    for (const localityType of localityTypes.slice(0,-1)) { // we'll manually add state so we can insert an "and") 
      let localitiesOfTypeInState = activeState[localityType]
      if (localitiesOfTypeInState == 0) {
        continue
      }
      localitiesArray.push(`${localitiesOfTypeInState} ${localitiesOfTypeInState == 1 ? localityNamesPrettied[localityType] : localityNamesPrettiedPluralized[localityType] }`)
    }
    estimateExplanationDiv += localitiesArray.join(", ")
    estimateExplanationDiv += `, and 1 state government</span> in ${this.getActiveState()}. </span>`
    estimateExplanationDiv += `<span>The model allots <span class="reporters-per-text">${this.getReportersPer()} editorial employee(s) per locality</span>, but adjusts this number for some types of localities using <span class="multiplier-text">a state size multiplier</span>.</span>`
    console.log(estimateExplanationDiv)
    this.calculationEstimateExplanationDivTarget.innerHTML = estimateExplanationDiv
  }

  updateEstimateCalculation(localityType) {
    this.calculationDivTarget.innerHTML = this.produceCalculationDiv()
  }

  // Add commas to an integer or stringified integer
  prettifyInteger(numberString) {
    numberString = String(numberString)
    return numberString.length > 3 ? this.prettifyInteger(numberString.slice(0,-3)) + "," + numberString.slice(-3) : numberString
  }

  // Update estimates when avg # demographic coverage areas is changed
  toggleNumReporters(event) {
    console.log("fire in the conservatory")
    this.updateEstimates()
  }
}
