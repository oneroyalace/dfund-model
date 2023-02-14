import { Controller } from "https://unpkg.com/@hotwired/stimulus/dist/stimulus.js"

const localityTypeColorMap = { cd: "#44AA99", ss: "#88CCEE", ts: "#DDCC77", muni: "#CC6677", county: "AA4499", state: "#882255" }
const localityNamesPrettied= { cd: "congressional district", ss: "school system", ts: "township government", muni: "municipal government", county: "county government", state: "state government" }
const localityNamesPrettiedPluralizedCapitalized = { cd: "Congressional Districts", ss: "School Systems", ts: "Township Governments", muni: "Municipal Governments", county: "County Governments", state: "State Governments" }
const localityNamesPrettiedPluralized = { cd: "congressional districts", ss: "school systems", ts: "township governments", muni: "municipal governments", county: "county governments", state: "state governments" }
let lastTriggerTime

const sizesPrettied = {
  xs: "extra-small",
  s: "small",
  m: "medium",
  l: "large",
  xl: "extra-large",
}

const costPerEmployee = 96_058.4390217831
const subgroupSizes = {
  cd: { xs: 6, s: 78, m: 129, l: 79, xl: 143 },
  ss: { xs: 737, s: 3749, m: 4203, l: 2420, xl: 2952 },
// const sdSubgroupSizes = { xs: 2301, s: 11_294, m: 10_303, l: 6628, xl: 8016 }
  ts: { xs: 2447, s: 2497, m: 6097, l: 4283, xl: 929 },
  muni: { xs: 1016, s: 5918, m: 5518, l: 4330, xl: 2713 },
  county: { xs: 174, s: 1070, m: 845, l: 508, xl: 434 },
  state: { xs: 6, s: 21, m: 14, l: 5, xl: 4 },
}

export default class extends Controller {
  static targets = [
    "numJournalistsForm",

    "calculationEstimateDescriptionDiv",
    "calculationEstimateExplanationDiv",
    "calculationDiv",

    "numEditorialEmployeesEstimateSpan",
    "numNonEditorialEmployeesEstimateSpan",
    "totalCostEstimateSpan",

    "cdTableRow",
    "ssTableRow",
    "tsTableRow",
    "muniTableRow",
    "countyTableRow",
    "stateTableRow",
    "allTableRow",

    "explanationContainer",

    // "localitySubgroupsTable",
    // "localitySubgroupsTableHeader",
    // "xsLocalitiesRow",
    // "sLocalitiesRow",
    // "mLocalitiesRow",
    // "lLocalitiesRow",
    // "xlLocalitiesRow",

  ]
  connect() {
    console.log("hotwired")
    this.updateEstimates()

    // this.setEstimateDescription("county")
    // this.setEstimateExplanation("county")
    // this.setEstimateCalculation("county", false)
    // this.setExplanations("county")
    // this.toggleCalculationVisibility()
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

  // Given a set of Input elements, converts their values to integres and sums them
  sumValuesOfInputs(inputElements) {
    return [...inputElements].map(i => parseFloat(i.value))
                             .reduce((i,j) => i + j)
  }

  calculateLocalityTypeReportersRequired(reportersPerLocality, numberOfLocalities, useMultipliers=false) {
    let reportersRequired = Object.entries(numberOfLocalities)
                                  .map(([k,v]) => (useMultipliers ? this.getSizeMultiplier(k) : 1) * v * reportersPerLocality)
                                  .reduce((x,y) => (x+y)) 
    return reportersRequired
  }

 
  // Re-calculate estimates of # of editorial employees, non-editorial employees, and $ required for state
  updateEstimates(event) {
    if (event) {
      event.preventDefault()
    }
    let reportersPerCD = this.sumValuesOfInputs(document.querySelectorAll(".num-cd-reporters-input"))
    let reportersPerSS = this.sumValuesOfInputs(document.querySelectorAll(".num-ss-reporters-input"))
    let reportersPerTS = this.sumValuesOfInputs(document.querySelectorAll(".num-ts-reporters-input"))
    let reportersPerMuni = this.sumValuesOfInputs(document.querySelectorAll(".num-muni-reporters-input"))
    let reportersPerCounty = this.sumValuesOfInputs(document.querySelectorAll(".num-county-reporters-input"))
    let reportersPerState = this.sumValuesOfInputs(document.querySelectorAll(".num-state-reporters-input"))
    
    document.querySelector("#cd-box").dataset.reportersPer = reportersPerCD
    document.querySelector("#ss-box").dataset.reportersPer = reportersPerSS
    document.querySelector("#ts-box").dataset.reportersPer = reportersPerTS
    document.querySelector("#muni-box").dataset.reportersPer = reportersPerMuni
    document.querySelector("#county-box").dataset.reportersPer = reportersPerCounty
    document.querySelector("#state-box").dataset.reportersPer = reportersPerState
  
    let totalCDReporters = this.calculateLocalityTypeReportersRequired(reportersPerCD, subgroupSizes.cd)
    let totalSSReporters = this.calculateLocalityTypeReportersRequired(reportersPerSS, subgroupSizes.ss, true)
    let totalTSReporters = this.calculateLocalityTypeReportersRequired(reportersPerTS, subgroupSizes.ts)
    let totalMuniReporters = this.calculateLocalityTypeReportersRequired(reportersPerMuni, subgroupSizes.muni)
    let totalCountyReporters = this.calculateLocalityTypeReportersRequired(reportersPerCounty, subgroupSizes.county, true)
    let totalStateReporters = this.calculateLocalityTypeReportersRequired(reportersPerState, subgroupSizes.state, true)
    let editorialEmployeesEstimate = totalCDReporters + totalSSReporters + totalTSReporters + totalMuniReporters + totalCountyReporters + totalStateReporters
    let nonEditorialEmployeesEstimate = editorialEmployeesEstimate * (2/3)
    let totalCostEstimate = costPerEmployee * (nonEditorialEmployeesEstimate + editorialEmployeesEstimate)

    this.cdTableRowTarget.innerText = this.prettifyInteger(Math.round(totalCDReporters))
    this.ssTableRowTarget.innerText = this.prettifyInteger(Math.round(totalSSReporters))
    this.tsTableRowTarget.innerText = this.prettifyInteger(Math.round(totalTSReporters))
    this.muniTableRowTarget.innerText = this.prettifyInteger(Math.round(totalMuniReporters))
    this.countyTableRowTarget.innerText = this.prettifyInteger(Math.round(totalCountyReporters))
    this.stateTableRowTarget.innerText = this.prettifyInteger(Math.round(totalStateReporters))
    this.allTableRowTarget.innerText = this.prettifyInteger(Math.round(editorialEmployeesEstimate))

    this.numEditorialEmployeesEstimateSpanTarget.innerText = this.prettifyInteger(Math.round(editorialEmployeesEstimate))
    this.numNonEditorialEmployeesEstimateSpanTarget.innerText = this.prettifyInteger(Math.round(nonEditorialEmployeesEstimate))
    this.totalCostEstimateSpanTarget.innerText = `$${this.prettifyInteger(Math.round(totalCostEstimate))}`
    this.setExplanations(this.explanationContainerTarget.dataset.activeLocalityType)
  }

  produceCalculationDivNoMultipliers(localityType) {
    let totalNumberLocalities = Object.values(subgroupSizes[localityType]).reduce((a,b) => a+b)
    let reportersPerLocality = parseFloat(document.querySelector(`#${localityType}-box`).dataset.reportersPer)
    let div = "<div>"
    div += `<div>
      <span class="num-localities-text">${this.prettifyInteger(totalNumberLocalities)} ${localityNamesPrettiedPluralized[localityType]}</span> * <span class="reporters-per-text">${reportersPerLocality} editorial employee${reportersPerLocality == 0 ? "" : "s"} per ${localityNamesPrettied[localityType]}</span></div>`
    div += `<div style="font-size: x-large; font-weight: bold">= 
      <span class="num-reporters-text">${this.prettifyInteger(Math.round(totalNumberLocalities * reportersPerLocality))} editorial employees</span> to cover all the ${localityNamesPrettiedPluralized[localityType]} in the US.
      </div>`
    div += "</div>"
    return div
  }
  produceCalculationDiv(localityType, useMultipliers) {
    if (!useMultipliers) {
      return this.produceCalculationDivNoMultipliers(localityType)
    }

    let localitySizeOccurrencesMap = subgroupSizes[localityType]
    let reportersPerLocality = parseFloat(document.querySelector(`#${localityType}-box`).dataset.reportersPer)
    let div = "<div>"
    let innerDivs = []
    for(const localitySize in localitySizeOccurrencesMap) {
      const localitySizeOccurrences = localitySizeOccurrencesMap[localitySize]
      let innerDiv = "<div>"
        innerDiv += `<span class="reporters-per-text"><span class="reporters-per-locality">(${reportersPerLocality} </span>`
      innerDiv += `<span> editorial employee${reportersPerLocality == 1 ? "" : "s"} per ${localityNamesPrettied[localityType]})</span></span>`
      innerDiv += '<span class="multiplication"> * </span>'
      innerDiv += `<span class="num-localities-text"><span class="${localityType}-${localitySize}-occurrences">(${localitySizeOccurrences} </span>`
      innerDiv += `<span>${sizesPrettied[localitySize]} ${localityNamesPrettiedPluralized[localityType]})</span></span>`
      innerDiv += '<span class="multiplication"> * </span>'
      innerDiv += `<span class="multiplier-text">(${sizesPrettied[localitySize]} size multiplier of ${this.getSizeMultiplier(localitySize)})</span>`
      innerDiv += localitySize == "xl" ? "" :  " +"
      innerDiv += "</div>"
      innerDivs.push(innerDiv)
    }
    div += innerDivs.join('')
    let target= eval(`this.${localityType}TableRowTarget`)
    // console.log(target)
    div += `<div style="font-size: x-large; font-weight: bold">=<span class="num-reporters-text">${target.innerText} total editorial employees</span> to cover all the ${localityNamesPrettiedPluralized[localityType]} in the US</div>`
    div += "</div>"
    return div
  }

  changeYear(event) {
    const years = [2021, 2022, 2023]
    let target = event.target
    let year = event.target.value
    let cost_2021 = (parseInt(this.numEditorialEmployeesEstimateSpanTarget.innerText.replace(",", "")) + parseInt(this.numNonEditorialEmployeesEstimateSpanTarget.innerText.replace(",", ""))) * costPerEmployee 
    let inflated_2022 = cost_2021 * 1.065
    let inflated_2023 = inflated_2022 * 1.03

    console.log(target)
    target.parentElement.firstElementChild.innerText = `Estimating using ${year} dollars`
    if(year == 2021)
      this.totalCostEstimateSpanTarget.innerText = `$${this.prettifyInteger(Math.round(cost_2021))}`
    if(year == 2022)
       this.totalCostEstimateSpanTarget.innerText = `$${this.prettifyInteger(Math.round(inflated_2022))}`
    else if (year == 2023)
      this.totalCostEstimateSpanTarget.innerText = `$${this.prettifyInteger(Math.round(inflated_2023))}`
  }

  highlightCalculationVariables(event) {
    if (event ) {
      event.preventDefault()
    }

    for(const localityType in localityTypeColorMap) {
      const localityTypeColor = localityTypeColorMap[localityType]
      const localityTypeInputs = [...document.querySelectorAll(`.num-${localityType}-reporters-input`)]
      const reportersPerLocalityCalculationSpan = document.querySelector(`.reporters-${localityType}-span`)
      localityTypeInputs.forEach((elem) => {
        elem.classList.toggle(`num-${localityType}-reporters-input-highlighted`)
        elem.classList.toggle("input-highlighted")
      })
      reportersPerLocalityCalculationSpan.classList.toggle("span-highlighted")
      reportersPerLocalityCalculationSpan.classList.toggle(`reporters-${localityType}-span-highlighted`)
    }

  }

  setExplanations(event) {
    let localityType
    if(typeof(event) == "object") {
      localityType = event.target.dataset.localityType
    }
    else {
      localityType = event
    }
    this.explanationContainerTarget.dataset["activeLocalityType"] = localityType
    this.setEstimateDescription(localityType)
    this.setEstimateExplanation(localityType)
    this.setEstimateCalculation(localityType)
    // this.highlightEstimateParmeters(localityType)
  }
  setEstimateDescription(localityType) {
    console.log("setting estimate", localityType)
    let target = eval(`this.${localityType}TableRowTarget`)
    document.querySelectorAll(".num-reporters-text").forEach(i => i.classList.remove("num-reporters-text"))
    target.parentElement.classList.toggle("num-reporters-text")
    let estimateString = target.innerHTML
    let estimateDescription = `The model currently estimates that <span class="num-reporters-text">${estimateString}</span> journalists will be required to cover all the ${localityNamesPrettiedPluralized[localityType]} in the US.`
    this.calculationEstimateDescriptionDivTarget.innerHTML = estimateDescription
  }

  setEstimateExplanation(localityType) {
    let totalLocalities = Object.values(subgroupSizes[localityType]).reduce((a,b) => a+b)
    let reportersPer = document.querySelector(`#${localityType}-box`).dataset.reportersPer
    let estimateExplanation = `There are <span class="num-localities-text">${this.prettifyInteger(totalLocalities)} ${localityNamesPrettiedPluralized[localityType]}</span> in the country. The model allots <span class="reporters-per-text">${reportersPer} editorial employee(s)</span> per normal-sized ${localityNamesPrettied[localityType]} and uses <span class="multiplier-text">preset multipliers</span> to calculate editorial employee targets for larger and smaller ones.`
    this.calculationEstimateExplanationDivTarget.innerHTML = estimateExplanation
  }

  setEstimateCalculation(localityType) {
    let useMultipliers = ["ss", "county", "state"].includes(localityType)
    this.calculationDivTarget.innerHTML = this.produceCalculationDiv(localityType, useMultipliers)
  }


  // Add commas to an integer or stringified integer
  prettifyInteger(numberString) {
    numberString = String(numberString)
    return numberString.length > 3 ? this.prettifyInteger(numberString.slice(0,-3)) + "," + numberString.slice(-3) : numberString
  }

  // Update estimates when avg # demographic coverage areas is changed
  toggleNumReporters(event) {
    console.log("fire in the conservatory")
    this.updateEstimates(event)
  }

  getSizeMultiplier(stateSize) {
    let multiplierMap = {
      xs: 0.5,
      s: 1,
      m: 2,
      l: 3,
      xl: 4
    }
    return multiplierMap[stateSize]
  }
}
