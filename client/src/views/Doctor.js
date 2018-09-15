import React, { Component } from 'react';
import DrugSearch from '../components/DrugSearch';

class Doctor extends Component {
  constructor(props) {
    super(props);

    this.state = { fields: [] };

    this.onDrugSelect = this.onDrugSelect.bind(this);
    this.writePrescription = this.writePrescription.bind(this);
  }

  onDrugSelect(drug) {
    this.setState(prevState => ({ fields: prevState.fields.concat({drug: drug, startDate: "", endDate: "", quantity: "", recurrence: ""})}));
  }

  async writePrescription() {
    const { contract, accounts } = this.props;
    await contract.writePrescription('0x821aea9a577a9b44299b9c15c88cf3087f3b5544', this.props.web3.utils.randomHex(4), {from: accounts[0]});
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
        <button className="button" onClick={this.writePrescription}>Write Prescription</button>
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
