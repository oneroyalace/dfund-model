import { Controller } from "https://unpkg.com/@hotwired/stimulus/dist/stimulus.js"

export default class extends Controller {
  static targets = [
    "numDemCoverageAreasSelector",
    "numGovCoverageAreasSelector",
    "editorialEstimate",
    "nonEditorialEstimate",
    "fundingEstimate",
    "stateTable", 
    "stateSelector", 
    "stateTableAlabama", // use html id attributes instead of stimulus targets
    "stateTableAlaska",
    "stateTableArkansas",
    "stateTableArizona",
    "stateTableCalifornia",

    "womenReportersInput",
    "aapiReportersInput",
    "blackReportersInput",
    "indigenousReportersInput",
    "latinxReportersInput",
    "lgbtReportersInput",
    "communityServicesReportersInput",
    "criminalJusticeReportersInput",
    "educationReportersInput",
    "electionsReportersInput",
    "environmentReportersInput",
    "healthcareReportersInput",
    "infrastructureReportersInput",
  ]
  connect() {
    console.log("hotwired")
    this.stateTableAlabamaTarget.classList.remove("stateTableInactive")
    this.stateTableAlabamaTarget.classList.add("stateTableActive")
    this.updateEstimates()
  }

  // Toggles visibility of state info table
  // Sets all other tables to display: none
  // Sets selected table to display: inline
  toggleStateView(event){
    this.stateTableTargets.forEach((i)  => {
      if(i.classList.contains("stateTableActive")) {
        i.classList.add("stateTableInactive")
        i.classList.remove("stateTableActive")
      }
    })
    let table = eval(`this.stateTable${this.stateSelectorTarget.value}Target`)
    table.classList.remove("stateTableInactive")
    table.classList.add("stateTableActive")
    this.updateEstimates()
  }

  // Return the currently shown state info table
  getActiveStateTable() {
    return this.stateTableTargets.filter(i => i.classList.contains("stateTableActive"))[0]
  }

  // Get multiplier value for a given state size tag
  getSizeMultiplier(stateSize) {
    let multiplierMap = {
      "Extra Small": 0.5,
      "Small": 1,
      "Medium": 2,
      "Large": 3,
      "Extra Large": 4
    }
    return multiplierMap[stateSize]
  }

  // Re-calculate estimates of # of editorial employees, non-editorial employees, and $ required for state
  updateEstimates() {
    let activeStateTable = this.getActiveStateTable()

    let numDemographicCoverageReporters = parseFloat(this.womenReportersInputTarget.value) + 
      parseFloat(this.aapiReportersInputTarget.value) +
      parseFloat(this.blackReportersInputTarget.value) +
      parseFloat(this.indigenousReportersInputTarget.value) +
      parseFloat(this.latinxReportersInputTarget.value) +
      parseFloat(this.lgbtReportersInputTarget.value)

      console.log(numDemographicCoverageReporters)

    let numGovernmentCoverageReporters = parseFloat(this.communityServicesReportersInputTarget.value) +
      parseFloat(this.criminalJusticeReportersInputTarget.value) +
      parseFloat(this.educationReportersInputTarget.value) +
      parseFloat(this.electionsReportersInputTarget.value) +
      parseFloat(this.environmentReportersInputTarget.value) +
      parseFloat(this.healthcareReportersInputTarget.value) +
      parseFloat(this.infrastructureReportersInputTarget.value)
  
    let stateSize = activeStateTable.querySelector(".stateSize").textContent
    let num_100_000s = parseInt(activeStateTable.querySelector(".statePopulation").dataset.population) / 100_000
    let numCongressionalDistricts = parseInt(activeStateTable.querySelector(".congressionalDistricts").dataset.congressionalDistricts)
    let numSchoolSystems = parseInt(activeStateTable.querySelector(".schoolSystems").dataset.schoolSystems)
    let numSpecialDistricts = parseInt(activeStateTable.querySelector(".specialDistricts").dataset.specialDistricts)
    let numTownshipGovernments = parseInt(activeStateTable.querySelector(".townshipGovernments").dataset.townshipGovernments)
    let numMunicipalGovernments = parseInt(activeStateTable.querySelector(".municipalGovernments").dataset.municipalGovernments)
    let numCountyGovernments = parseInt(activeStateTable.querySelector(".countyGovernments").dataset.countyGovernments)
    let numStateGovernments = parseInt(activeStateTable.querySelector(".stateGovernments").dataset.stateGovernments)
    let foundationGiving = parseInt(activeStateTable.querySelector(".foundationGiving").dataset.foundationGiving)

    let multiplier = this.getSizeMultiplier(stateSize)

    let employees_100_000 = (num_100_000s * (numGovernmentCoverageReporters + numDemographicCoverageReporters))
    let employees_cd = (numCongressionalDistricts * (numGovernmentCoverageReporters + numDemographicCoverageReporters))
    
    // I think the aberration in the line below reveals a bug in the Excel model
    // Setting parameters to 0/0 reporters/locality will yield a total # employees > 0
    let employees_school = (numSchoolSystems * multiplier * (1 + numDemographicCoverageReporters))
    let employees_special = (numSpecialDistricts * multiplier * (numGovernmentCoverageReporters + numDemographicCoverageReporters))
    let employeesTown = (numTownshipGovernments * (numGovernmentCoverageReporters + numDemographicCoverageReporters))
    let employeesMuni = (numMunicipalGovernments * (numGovernmentCoverageReporters + numDemographicCoverageReporters)) 
    let employeesCounty = (numCountyGovernments * multiplier * (numGovernmentCoverageReporters + numDemographicCoverageReporters))
    let employeesState = (numStateGovernments * multiplier * (numGovernmentCoverageReporters + numDemographicCoverageReporters))

    let editorialEmployeeEstimate = employees_100_000 + employees_cd + employees_school + employees_special + employeesTown + employeesMuni + employeesCounty + employeesState
    let nonEditorialEmployeeEstimate = editorialEmployeeEstimate * (2/3)
    let fundingEstimate = editorialEmployeeEstimate * 96_058.43902 * (5/3)

    this.editorialEstimateTarget.textContent = this.prettifyInteger(Math.round(editorialEmployeeEstimate).toString())
    this.nonEditorialEstimateTarget.textContent = this.prettifyInteger(Math.round(nonEditorialEmployeeEstimate).toString())
    this.fundingEstimateTarget.textContent = this.prettifyInteger(Math.round(fundingEstimate).toString())
  }

  // Add commas to a stringified integer
  prettifyInteger(numberString) {
    return numberString.length > 3 ? this.prettifyInteger(numberString.slice(0,-3)) + "," + numberString.slice(-3) : numberString
  }

  // Update estimates when avg # demographic coverage areas is changed
  toggleNumReporters(event) {
    console.log("fire in the conservatory")
    this.updateEstimates()
  }
}
