import React, { Component } from 'react';

import moment from 'moment';
import DrugSearch from '../components/DrugSearch';

class Doctor extends Component {
  constructor(props) {
    super(props);

    this.state = { items: [] };
    this.handleChange = this.handleChange.bind(this);
    this.onDrugSelect = this.onDrugSelect.bind(this);
    this.writePrescription = this.writePrescription.bind(this);
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

  async writePrescription() {
    const { contract, accounts } = this.props;
    await contract.writePrescription('0x821aea9a577a9b44299b9c15c88cf3087f3b5544', this.props.web3.utils.randomHex(4), {from: accounts[0]});
  }

  render() {
    return (
      <div className="columns">
        <div className="column is-three-fifths">
          <DrugSearch onDrugSelect={ this.onDrugSelect } />
          <Prescription handleChange={this.handleChange} items={this.state.items} />
          <button className="button" onClick={this.writePrescription}>Write Prescription</button>
        </div>
      </div>
    )
  }
}

class Prescription extends Component {
  render() {
    return (
      <div>
        <h3>Drugs</h3>
        <div className="box">
          {this.props.items.map((item, i) => (
            <div className="box">
              <div key={Math.random}>
                <h3>{item.drug}</h3>
                <form>

                  <div className="field is-horizontal">

                    <div className="field-label is-normal">
                      <label className="label" htmlFor="quantity">
                        Quantity per use:
                      </label>
                    </div>

                    <div className="field-body">
                      <div className="field is-narrow">
                        <div className="control">
                          <input
                            id="quantity"
                            type="text"
                            className="input is-rounded"
                            onChange={(e) => this.props.handleChange(i, "quantity", e.target.value)}
                            value={item.quantity}
                          />
                        </div>
                      </div>
                    </div>

                  </div>

                  <br />

                  <div className="field is-horizontal">

                    <div className="field-label is-normal">
                      <label className="label" htmlFor="recurrence">
                        Use per day:
                      </label>
                    </div>

                    <div className="field-body">
                      <div className="field is-narrow">
                        <div className="control">
                          <input
                            id="recurrence"
                            className="input is-rounded"
                            onChange={(e) => this.props.handleChange(i, "recurrence", e.target.value)}
                            value={item.recurrence}
                          />
                        </div>
                      </div>
                    </div>

                  </div>

                  <br />

                  <div className="field is-horizontal">

                    <div className="field-label is-normal">
                      <label className="label" htmlFor="end-date">
                        End date:
                      </label>
                    </div>

                    <div className="field-body">
                      <div className="field is-narrow">
                        <div className="control">
                          <input
                            type="date"
                            id="end-date"
                            className="input is-rounded"
                            onChange={(e) => this.props.handleChange(i, "endDate", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                  </div>

                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default Doctor;
