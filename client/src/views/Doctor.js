import React, { Component } from 'react';
import DrugSearch from '../components/DrugSearch';

class Doctor extends Component {
  constructor(props) {
    super(props);

    this.state = { fields: [] };
    this.onDrugSelect = this.onDrugSelect.bind(this);
  }

  onDrugSelect(drug) {
    this.setState(prevState => ({ fields: prevState.fields.concat({drug: drug, startDate: "", endDate: "", quantity: "", recurrence: ""})}));
  }

  render() {
    return (
      <div>
        <DrugSearch onDrugSelect={ this.onDrugSelect } />
        <h3>TODO</h3>
        <DrugList items={this.state.fields} />
        <form>
          <label htmlFor="new-drug">
            What needs to be done?
          </label>
        </form>
      </div>
    )
  }
}

class DrugList extends React.Component {
  render() {
    return (
      <ul>
        {this.props.items.map(item => (
          <li key={Math.random}>{item.drug}</li>
        ))}
      </ul>
    );
  }
}

export default Doctor;
