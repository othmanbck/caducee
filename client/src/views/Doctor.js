import React, { Component, Fragment } from 'react';
import { Buffer } from 'buffer';
import moment from 'moment';
import DrugSearch from '../components/DrugSearch';

class Doctor extends Component {
  constructor(props) {
    super(props);

    this.state = { patient: '0x821aea9a577a9b44299b9c15c88cf3087f3b5544', items: [] };

    this.setPatient = this.setPatient.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onDrugSelect = this.onDrugSelect.bind(this);
    this.writePrescription = this.writePrescription.bind(this);
  }

  setPatient(addr) {
    this.setState({ patient: addr });
  }

  onDrugSelect(drug) {
    this.setState(prevState => ({ items: prevState.items.concat({drug: drug, quantity: "", recurrence: "", posology: "", startDate: moment().format("YYYY-MM-DD"), endDate: ""})}));
  }

  handleChange(idx, field, value) {
    this.setState(prevState => {
      const items = prevState.items;
      items[idx][field] = value;
      return { items };
    });
  }

  async writePrescription() {
    const { contract, accounts, node } = this.props;
    const prescriptionHash = (await node.files.add(new Buffer(JSON.stringify(this.state.items))))[0].hash;
    await contract.writePrescription(this.state.patient, prescriptionHash, {from: accounts[0]});
  }

  render() {
    return (
      <Fragment>
        <form>
          <div className="field is-horizontal">
            <div className="field-label is-normal">
              <label className="label" htmlFor="eth_addr">
                <h3 className="title is-5">Patient address</h3>
              </label>
            </div>
            <div className="field-body">
              <div className="field">
                <div className="control">
                  <input
                    id="eth_addr"
                    type="text"
                    className="input"
                    onChange={this.setPatient}
                    value={this.state.patient}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="field is-horizontal">
            <div className="field-label is-normal">
              <label className="label" htmlFor="eth_addr">
                <h3 className="title is-5">Add drug to prescription</h3>
              </label>
            </div>
            <div className="field-body">
              <div className="field">
                <div className="control">
                  <DrugSearch req={this.props.req} onDrugSelect={ this.onDrugSelect } />
                </div>
              </div>
            </div>
          </div>
        </form>
        <br />
        <h3 className="title is-5">Current prescription :</h3>
        <DoctorPrescription handleChange={this.handleChange} items={this.state.items} />
        <button className="button is-info is-large" onClick={this.writePrescription}>Write Prescription</button>
      </Fragment>
    )
  }
}

class DoctorPrescription extends Component {
  render() {
    return (
      <Fragment>
        <div className="box is-prescription columns is-multiline">
          {this.props.items.map((item, i) => (
            <div className="column is-one-third" key={item.drug.value}>
              <div className="box">
                <h3 className="title is-6">{item.drug.label}</h3>
                <form>
                  <div className="field is-horizontal">
                    <div className="field-label is-normal">
                      <label className="label" htmlFor="quantity">
                        Quantity per use:
                      </label>
                    </div>
                    <div className="field-body">
                      <div className="field">
                        <div className="control">
                          <input
                            id="quantity"
                            type="text"
                            className="input"
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
                      <div className="field">
                        <div className="control">
                          <input
                            id="recurrence"
                            className="input"
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
                      <label className="label" htmlFor="posology">
                        Posology:
                      </label>
                    </div>
                    <div className="field-body">
                      <div className="field">
                        <div className="control">
                          <textarea
                            id="posology"
                            className="textarea"
                            onChange={(e) => this.props.handleChange(i, "posology", e.target.value)}
                            value={item.posology}
                          ></textarea>
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
                      <div className="field">
                        <div className="control">
                          <input
                            type="date"
                            id="end-date"
                            className="input"
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
      </Fragment>
    )
  }
}

export default Doctor;
