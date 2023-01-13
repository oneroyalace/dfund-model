import csv
import string

"""
Used to generate cards for the "calculate by state" view
"""
def generate_state_data_table(state_details):
    return f"""
        <table class="state-table" data-state-target="stateTableInactive stateTable{string.capwords(state_details["State"]).replace(' ', '')}">
            <tr>
                <th>State</td>
                <td>{state_details["State"]}</td>
            </tr>
            <tr>
                <th>Population</td>
                <td>{state_details["Population"]}</td>
            </tr>
            <tr>
                <th>Size tag</td>
                <td>{state_details["Size Tag"]}</td>
            </tr>
            <tr>
                <th>Congressional districts</th>
                <td>{state_details["Congressional Districts"]}</td>
            </tr>
            <tr>
                <th>School Systems</th>
                <td>{state_details["School Systems"]}</td>
            </tr>
            <tr>
                <th>Special Districts</th>
                <td>{state_details["Special Districts"]}</td>
            </tr>
            <tr>
                <th>Township Governments</th>
                <td>{state_details["Township Governments"]}</td>
            </tr>
            <tr>
                <th>Municipal Governments</th>
                <td>{state_details["Municipal Governments"]}</td>
            </tr>
            <tr>
                <th>County Governments</th>
                <td>{state_details["County Governments"]}</td>
            </tr>
            <tr>
                <th>State Governments</th>
                <td>{state_details["State Governments"]}</td>
            </tr>
            <tr>
                <th>Annual Foundation Giving (2015)</th>
                <td>{state_details["Annual Foundation Giving (2015)"]}</td>
            </tr>
        </table>
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

# for row in rows[:5]:
#     print(generate_state_data_table(row))

print(generate_state_selector([row["State"] for row in rows]))
