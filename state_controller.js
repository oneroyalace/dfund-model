import { Controller } from "https://unpkg.com/@hotwired/stimulus/dist/stimulus.js"

export default class extends Controller {
  static targets = ["stateTable", "stateSelector", "stateTableCalifornia"]
  connect() {
    // console.log(this.stateSelectorTarget);
  }

  toggleStateView(event){

    console.log(this.stateSelectorTarget.value)
    this.stateTableTargets.forEach(i => ! i.classList.contains("stateTable") && i.classList.add("stateTableInactive"))
    let table = eval(`this.stateTable${this.stateSelectorTarget.value}Target`)
    console.log(table)
    table.classList.remove("stateTableInactive")
    table.classList.add("stateTable")
  }
}