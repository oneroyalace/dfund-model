import csv
import re
import string

"""
Used to generate cards for the "calculate by state" view
"""
def generate_state_data_table(state_details):
    return f"""
        <table class="stateTableInactive" data-state-target="stateTable stateTable{string.capwords(state_details["State"]).replace(' ', '')}">
            <tr>
                <th class="stateTableHeader">State</th>
                <td>{state_details["State"]}</td>
            </tr>
            <tr>
                <th class="stateTableHeader">Population</th>
                <td data-population={clean_number_string(state_details["Population"])} class="statePopulation">{state_details["Population"]}</td>
            </tr>
            <tr>
                <th class="stateTableHeader">Size tag</th>
                <td class="stateSize">{state_details["Size Tag"]}</td>
            </tr>
            <tr>
                <th class="stateTableHeader">Congressional districts</th>
                <td data-congressional-districts={clean_number_string(state_details["Congressional Districts"])} class="congressionalDistricts">{state_details["Congressional Districts"]}</td>
            </tr>
            <tr>
                <th class="stateTableHeader">School Systems</th>
                <td data-school-systems={clean_number_string(state_details["School Systems"])} class="schoolSystems">{state_details["School Systems"]}</td>
            </tr>
            <tr>
                <th class="stateTableHeader">Special Districts</th>
                <td data-special-districts={clean_number_string(state_details["Special Districts"])} class="specialDistricts">{state_details["Special Districts"]}</td>
            </tr>
            <tr>
                <th class="stateTableHeader">Township Governments</th>
                <td data-township-governments={clean_number_string(state_details["Township Governments"])} class="townshipGovernments">{state_details["Township Governments"]}</td>
            </tr>
            <tr>
                <th class="stateTableHeader">Municipal Governments</th>
                <td data-municipal-governments={clean_number_string(state_details["Municipal Governments"])} class="municipalGovernments">{state_details["Municipal Governments"]}</td>
            </tr>
            <tr>
                <th class="stateTableHeader">County Governments</th>
                <td data-county-governments={clean_number_string(state_details["County Governments"])} class="countyGovernments">{state_details["County Governments"]}</td>
            </tr>
            <tr>
                <th class="stateTableHeader">State Governments</th>
                <td data-state-governments={clean_number_string(state_details["State Governments"])} class="stateGovernments">{state_details["State Governments"]}</td>
            </tr>
            <tr>
                <th class="stateTableHeader">Annual Foundation Giving (2015)</th>
                <td data-foundation-giving={clean_number_string(state_details["Annual Foundation Giving (2015)"])} class="foundationGiving">{state_details["Annual Foundation Giving (2015)"]}</td>
            </tr>
        </table>
    """

"""
Removes non-numerical characters from a string
"""
def clean_number_string(number_string):
    cleaned_string = re.sub(r"[^0-9]", "", number_string)
    return cleaned_string or "0"

"""
Returns an HTML selection element containing the 50 states as options
"""
def generate_state_selector(states):
    state_option_elements = "\n\t".join([f"<option value=\"{state}\">{state}</option>" for state in states])
    return f"""
        <select name="state" data-state-target="stateSelector">
            {state_option_elements}
        </select>"""

with open("states.csv", "r", encoding="utf-8-sig") as infile:
    reader = csv.DictReader(infile)
    rows = [row for row in reader]

for row in rows[:5]:
    print(generate_state_data_table(row))

# print(generate_state_selector([row["State"] for row in rows]))
