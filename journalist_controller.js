import { Controller } from "https://unpkg.com/@hotwired/stimulus/dist/stimulus.js"

const numberOfCDs = { xs: 6, s: 78, m: 129, l: 79, xl: 143 }
const numberOfSSs = { xs: 737, s: 3749, m: 4203, l: 2420, xl: 2952 }
const numberOfSDs = { xs: 2301, s: 11_294, m: 10_303, l: 6628, xl: 8016 }
const numberOfTSs = { xs: 2447, s: 2497, m: 6097, l: 4283, xl: 929 }
const numberOfMunis = { xs: 1016, s: 5918, m: 5518, l: 4330, xl: 2713 }
const numberOfCounties = { xs: 174, s: 1070, m: 845, l: 508, xl: 434 }
const numberOfStates = { xs: 6, s: 21, m: 14, l: 5, xl: 4 }

export default class extends Controller {
  static targets = [
    "numJournalistsForm",
    "cdCalculation",
    "ssCalculation",
    "tsCalculation",
    "muniCalculation",
    "countyCalculation",
    "stateCalculation",
  ]
  connect() {
    console.log("hotwired")
    // this.updateEstimates()
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
    event.preventDefault()
    let reportersPerCD = this.sumValuesOfInputs(document.querySelectorAll(".numCDReportersInput"))
    let reportersPerSS = this.sumValuesOfInputs(document.querySelectorAll(".numSSReportersInput"))
    let reportersPerTS = this.sumValuesOfInputs(document.querySelectorAll(".numTSReportersInput"))
    let reportersPerMuni = this.sumValuesOfInputs(document.querySelectorAll(".numMuniReportersInput"))
    let reportersPerCounty = this.sumValuesOfInputs(document.querySelectorAll(".numCountyReportersInput"))
    let reportersPerState = this.sumValuesOfInputs(document.querySelectorAll(".numStateReportersInput"))
    
  
    let totalCDReporters = this.calculateLocalityTypeReportersRequired(reportersPerCD, numberOfCDs)
    let totalSSReporters = this.calculateLocalityTypeReportersRequired(reportersPerSS, numberOfSSs, true)
    let totalTSReporters = this.calculateLocalityTypeReportersRequired(reportersPerTS, numberOfTSs)
    let totalMuniReporters = this.calculateLocalityTypeReportersRequired(reportersPerMuni, numberOfMunis)
    let totalCountyReporters = this.calculateLocalityTypeReportersRequired(reportersPerCounty, numberOfCounties, true)
    //why aren't there 50 states??????
    let totalStateReporters = this.calculateLocalityTypeReportersRequired(reportersPerState, numberOfStates, true)
    console.log("total cd reporters", totalCDReporters)
    console.log("total ss reporters", totalSSReporters)
    console.log("total ts reporters", totalTSReporters)
    console.log("total Muni reporters", totalMuniReporters)
    console.log("total county reporters", totalCountyReporters)
    console.log("total state reporters", totalStateReporters)

    this.cdCalculationTarget.innerHTML = this.produceCalculationSpan(reportersPerCD, numberOfCDs, false)
    this.ssCalculationTarget.innerHTML = this.produceCalculationSpan(reportersPerSS, numberOfSSs, true)
    this.tsCalculationTarget.innerHTML = this.produceCalculationSpan(reportersPerTS, numberOfTSs, false)
    this.muniCalculationTarget.innerHTML = this.produceCalculationSpan(reportersPerMuni, numberOfMunis, false)
    this.countyCalculationTarget.innerHTML = this.produceCalculationSpan(reportersPerCounty, numberOfCounties, true)
    this.stateCalculationTarget.innerHTML = this.produceCalculationSpan(reportersPerState, numberOfStates, true)

    // console.log(this.produceCalculationSpan(reportersPerCD, numberOfCDs, false))
    // console.log(this.produceCalculationSpan(reportersPerSS, numberOfSSs, true))
    // console.log(this.produceCalculationSpan(reportersPerTS, numberOfTSs, false))
    // console.log(this.produceCalculationSpan(reportersPerMuni, numberOfMunis, false))
    // console.log(this.produceCalculationSpan(reportersPerCounty, numberOfCounties, true))
    // console.log(this.produceCalculationSpan(reportersPerState, numberOfStates, true))

  }

  produceCalculationSpan(reportersPerLocality, localitySizeOccurrencesMap, useMultipliers) {
    let span = "<span>"
    let innerSpans = []
    const reportersPerLocalityPrefix = 
      `<span>
        <span data-action="mouseover->journalist#highlightCalculation"
              class"reporters-per-locality">${reportersPerLocality}
        </span>
        <span class="multiplication"> * </span>
        <span class="opening-parens-brace">${useMultipliers ? "[" : "("}</span>
      `
    for(const localitySize in localitySizeOccurrencesMap) {
      const localitySizeOccurrences = localitySizeOccurrencesMap[localitySize]
      let localityTypeSpan = ""
      if(! useMultipliers) {
        localityTypeSpan += `<span class="locality-size-occurrences">${localitySizeOccurrences}</span>`
        innerSpans.push(localityTypeSpan)
        continue
      }
        
      localityTypeSpan += '<span class="parentheses">(</span>'
      localityTypeSpan += `<span class="locality-size-occurrences">${localitySizeOccurrences}</span>`
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
writeCalculation() {

  }

  // Add commas to a stringified integer
  prettifyInteger(numberString) {
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
