import { Controller } from "https://unpkg.com/@hotwired/stimulus/dist/stimulus.js"

const localityTypeColorMap = { cd: "#44AA99", ss: "#88CCEE", ts: "#DDCC77", muni: "#CC6677", county: "AA4499", state: "#882255" }
const prettyLocalityNamesPluralized = { cd: "Congressional Districts", ss: "School Systems", ts: "Township Governments", muni: "Municipal Governments", county: "County Governments", state: "State Governments" }
const cdSubgroupSizes = { xs: 6, s: 78, m: 129, l: 79, xl: 143 }
const ssSubgroupSizes = { xs: 737, s: 3749, m: 4203, l: 2420, xl: 2952 }
// const sdSubgroupSizes = { xs: 2301, s: 11_294, m: 10_303, l: 6628, xl: 8016 }
const tsSubgroupSizes = { xs: 2447, s: 2497, m: 6097, l: 4283, xl: 929 }
const muniSubgroupSizes = { xs: 1016, s: 5918, m: 5518, l: 4330, xl: 2713 }
const countySubgroupSizes = { xs: 174, s: 1070, m: 845, l: 508, xl: 434 }
const stateSubgroupSizes = { xs: 6, s: 21, m: 14, l: 5, xl: 4 }

export default class extends Controller {
  static targets = [
    "numJournalistsForm",

    // "cdCalculationSpan",
    // "ssCalculationSpan",
    // "tsCalculationSpan",
    // "muniCalculationSpan",
    // "countyCalculationSpan",
    // "stateCalculationSpan",
    // "calculationDiv",


    "numEditorialEmployeesEstimateSpan",
    "numNonEditorialEmployeesEstimateSpan",
    "totalCostEstimateSpan",

    "cdTableRow",
    "ssTableRow",
    "tsTableRow",
    "muniTableRow",
    "countyTableRow",
    "stateTableRow",

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
    // this.toggleCalculationVisibility()
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
    
  
    let totalCDReporters = this.calculateLocalityTypeReportersRequired(reportersPerCD, cdSubgroupSizes)
    let totalSSReporters = this.calculateLocalityTypeReportersRequired(reportersPerSS, ssSubgroupSizes, true)
    let totalTSReporters = this.calculateLocalityTypeReportersRequired(reportersPerTS, tsSubgroupSizes)
    let totalMuniReporters = this.calculateLocalityTypeReportersRequired(reportersPerMuni, muniSubgroupSizes)
    let totalCountyReporters = this.calculateLocalityTypeReportersRequired(reportersPerCounty, countySubgroupSizes, true)
    //why aren't there 50 states??????
    let totalStateReporters = this.calculateLocalityTypeReportersRequired(reportersPerState, stateSubgroupSizes, true)
    // console.log("total cd reporters", totalCDReporters)
    // console.log("total ss reporters", totalSSReporters)
    // console.log("total ts reporters", totalTSReporters)
    // console.log("total Muni reporters", totalMuniReporters)
    // console.log("total county reporters", totalCountyReporters)
    // console.log("total state reporters", totalStateReporters)
    let editorialEmployeesEstimate = totalCDReporters + totalSSReporters + totalTSReporters + totalMuniReporters + totalCountyReporters + totalStateReporters
    let nonEditorialEmployeesEstimate = editorialEmployeesEstimate * (2/3)
    let totalCostEstimate = 96_058.4390217831 * (nonEditorialEmployeesEstimate + editorialEmployeesEstimate)

    this.cdTableRowTarget.innerText = this.prettifyInteger(Math.round(totalCDReporters))
    this.ssTableRowTarget.innerText = this.prettifyInteger(Math.round(totalSSReporters))
    this.tsTableRowTarget.innerText = this.prettifyInteger(Math.round(totalTSReporters))
    this.muniTableRowTarget.innerText = this.prettifyInteger(Math.round(totalMuniReporters))
    this.countyTableRowTarget.innerText = this.prettifyInteger(Math.round(totalCountyReporters))
    this.stateTableRowTarget.innerText = this.prettifyInteger(Math.round(totalStateReporters))

    // this.cdCalculationSpanTarget.innerHTML = this.produceCalculationSpan(reportersPerCD, cdSubgroupSizes, "cd", false)
    // this.ssCalculationSpanTarget.innerHTML = this.produceCalculationSpan(reportersPerSS, ssSubgroupSizes, "ss", true)
    // this.tsCalculationSpanTarget.innerHTML = this.produceCalculationSpan(reportersPerTS, tsSubgroupSizes, "ts", false)
    // this.muniCalculationSpanTarget.innerHTML = this.produceCalculationSpan(reportersPerMuni, muniSubgroupSizes, "muni", false)
    // this.countyCalculationSpanTarget.innerHTML = this.produceCalculationSpan(reportersPerCounty, countySubgroupSizes, "county", true)
    // this.stateCalculationSpanTarget.innerHTML = this.produceCalculationSpan(reportersPerState, stateSubgroupSizes, "state", true)

    this.numEditorialEmployeesEstimateSpanTarget.innerText = this.prettifyInteger(Math.round(editorialEmployeesEstimate))
    this.numNonEditorialEmployeesEstimateSpanTarget.innerText = this.prettifyInteger(Math.round(nonEditorialEmployeesEstimate))
    this.totalCostEstimateSpanTarget.innerText = `$${this.prettifyInteger(Math.round(totalCostEstimate))}`
  }

  produceCalculationSpan(reportersPerLocality, localitySizeOccurrencesMap, localityType, useMultipliers) {
    let span = "<span>"
    let innerSpans = []
    const reportersPerLocalityPrefix = 
      `<span>
        <span class="reporters-${localityType}-span"
              class"reporters-per-locality">${reportersPerLocality}
        </span>
        <span class="multiplication"> * </span>
        <span class="opening-parens-brace">${useMultipliers ? "[" : "("}</span>
      `
    for(const localitySize in localitySizeOccurrencesMap) {
      const localitySizeOccurrences = localitySizeOccurrencesMap[localitySize]
      let localityTypeSpan = ""
      if(! useMultipliers) {
        localityTypeSpan += `<span class="${localityType}-${localitySize}-occurrences">${localitySizeOccurrences}</span>`
        innerSpans.push(localityTypeSpan)
        continue
      }
        
      localityTypeSpan += '<span class="parentheses">(</span>'
      localityTypeSpan += `<span class="${localityType}-${localitySize}-occurrences">${localitySizeOccurrences}</span>`
      localityTypeSpan += '<span class="multiplication"> * </span>'
      localityTypeSpan += `<span class="multiplier">${this.getSizeMultiplier(localitySize)}</span>`
      localityTypeSpan += '<span class="parentheses">)</span>'
      innerSpans.push(localityTypeSpan)
    }
    span += reportersPerLocalityPrefix + innerSpans.join('<span class="addition"> + </span>')
    span += `<span class="closing-parens-brace">${useMultipliers ? "]" : ")"}</span>`
    span += "</span>"
    return span
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

  toggleCalculationVisibility() {
    this.calculationDivTarget.classList.toggle("display-none")
  }

  displayLocalitySubgroupNumbers(event) {
    const localityType = event.target.dataset.localityType
    this.localitySubgroupsTableHeaderTarget.innerText = `# ${prettyLocalityNamesPluralized[localityType]}`

    for (const size in cdSubgroupSizes) {  //just want access to size letters
      // outer eval (sorry) give us a call like "this.xsLocalitiesRowTarget.innerText=eval(`${event.target.dataset.localityType}SubgroupSize`).xs
      // after inner eval, we get "this.xsLocalitiesRowTarget.innerText=cdSubgroupSizes.xs"
      const rowTarget = eval(`this.${size}LocalitiesRowTarget`)
      const localityTypeSubgroupSizes = eval(`${localityType}SubgroupSizes`)
      rowTarget.innerText =  localityTypeSubgroupSizes[size]
      document.querySelector(`.${localityType}-${size}-occurrences`).classList.toggle(`${size}-underline`)
      this.localitySubgroupsTableTarget.querySelector(`.${size}-row`).classList.toggle(`${size}-underline`)
    }
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
