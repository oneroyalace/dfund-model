import { Controller } from "https://unpkg.com/@hotwired/stimulus/dist/stimulus.js"

export default class extends Controller {
  static targets = [
    "stateTable", 
    "stateSelector", 
    "stateTableAlabama",
    "stateTableAlaska",
    "stateTableArkansas",
    "stateTableArizona",
    "stateTableCalifornia",
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
}
