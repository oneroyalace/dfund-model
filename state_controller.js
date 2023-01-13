import { Controller } from "https://unpkg.com/@hotwired/stimulus/dist/stimulus.js"

export default class extends Controller {
  static targets = [
    "numDemCoverageAreasSelector",
    "numGovCoverageAreasSelector",
    "stateTable", 
    "stateSelector", 
    "stateTableAlabama",
    "stateTableAlaska",
    "stateTableArkansas",
    "stateTableArizona",
    "stateTableCalifornia"
  ]
  connect() {
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
  }

  getActiveStateTable() {
    return this.stateTableTargets.filter(i => i.classList.contains("stateTableActive"))[0]
  }

  updateExpenseEstimate() {
    console.log("updated expens esteimate")
    let activeStateTable = this.getActiveStateTable()
    console.log(activeStateTable)

    let num_100_000s = parseInt(activeStateTable.querySelector(".statePopulation").dataset.population) / 100_000
    let numCongressionalDistricts = parseInt(activeStateTable.querySelector(".congressionalDistricts").dataset.congressionalDistricts)
    let numSchoolSystems = parseInt(activeStateTable.querySelector(".schoolSystems").dataset.schoolSystems)
    let numSpecialDistricts = parseInt(activeStateTable.querySelector(".specialDistricts").dataset.specialDistricts)
    let numTownshipGovernments = parseInt(activeStateTable.querySelector(".townshipGovernments").dataset.townshipGovernments)
    let numMunicipalGovernments = parseInt(activeStateTable.querySelector(".municipalGovernments").dataset.municipalGovernments)
    let numCountyGovernments = parseInt(activeStateTable.querySelector(".countyGovernments").dataset.countyGovernments)
    let numStateGovernments = parseInt(activeStateTable.querySelector(".stateGovernments").dataset.stateGovernments)
    let foundationGiving = parseInt(activeStateTable.querySelector(".foundationGiving").dataset.foundationGiving)

    console.log(num_100_000s)
    console.log(numCongressionalDistricts)
    console.log(numSchoolSystems)
    console.log(numSpecialDistricts)
    console.log(numTownshipGovernments)
    console.log(numMunicipalGovernments)
    console.log(numCountyGovernments)
    console.log(numStateGovernments)
    console.log(foundationGiving)
      
  }
  toggleNumDemCoverageAreas(event) {
    this.updateExpenseEstimate()
  }

  toggleNumGovCoverageAreas(event) {
    this.updateExpenseEstimate()
  }
}
