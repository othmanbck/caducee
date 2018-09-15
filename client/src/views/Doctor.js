import React, { Component } from 'react';

import moment from 'moment';
import DrugSearch from '../components/DrugSearch';

class Doctor extends Component {
  constructor(props) {
    super(props);

    this.state = { items: [] };
    this.handleChange = this.handleChange.bind(this);
    this.onDrugSelect = this.onDrugSelect.bind(this);
  }

  onDrugSelect(drug) {
    this.setState(prevState => ({ items: prevState.items.concat({drug: drug, quantity: "", recurrence: "", startDate: moment().format("YYYY-MM-DD"), endDate: ""})}));
  }

  handleChange(idx, field, value) {
    this.setState(prevState => {
      const items = prevState.items;
      items[idx][field] = value;
      return { items };
    });
  }

  render() {
    return (
      <div>
        <DrugSearch onDrugSelect={ this.onDrugSelect } />
        <h3>Drugs</h3>
        <Prescription handleChange={this.handleChange} items={this.state.items} />
      </div>
    )
  }
}

class Prescription extends Component {
  render() {
    return (
        <div>
          {this.props.items.map((item, i) => (
            <div key={Math.random}>
              <h3>{item.drug}</h3>
              <form>
                <label htmlFor="quantity">
                  Quantity per use:
                </label>
                <input
                  id="quantity"
                  onChange={(e) => this.props.handleChange(i, "quantity", e.target.value)}
                  value={item.quantity}
                />
                <br />
                <label htmlFor="recurrence">
                  Use per day:
                </label>
                <input
                  id="recurrence"
                  onChange={(e) => this.props.handleChange(i, "recurrence", e.target.value)}
                  value={item.recurrence}
                />
                <br />
                <label htmlFor="end-date">
                  End date:
                </label>
                <input
                  type="date"
                  id="end-date"
                  onChange={(e) => this.props.handleChange(i, "endDate", e.target.value)}
                  />
              </form>
            </div>
          ))}
        </div>
    )
  }
}

export default Doctor;
