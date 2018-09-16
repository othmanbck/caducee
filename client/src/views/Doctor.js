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
    this.clearPrescription = this.clearPrescription.bind(this);
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

  clearPrescription() {
    this.setState({ items: [] });
  }

  async writePrescription() {
    const { contract, accounts, node } = this.props;
    const prescriptionHash = (await node.files.add(new Buffer(JSON.stringify(this.state.items))))[0].hash;
    await contract.writePrescription(accounts[0], this.state.patient, prescriptionHash, {from: accounts[0]});
    this.setState({ items: [] });
  }

  render() {
    return (
      <Fragment>
        <div className="title has-text-success is-4">New Prescription</div>

          <div className="box">

                <input
                  className="input"
                  value={this.state.patient}
                  onChange={this.setPatient}
                  placeholder="Patient address"
                />

          </div>

          <div className="box">
            <DrugSearch req={this.props.req} onDrugSelect={ this.onDrugSelect } />
          </div>

        <br />
        <div className="title has-text-success is-4">Pending Prescriptions</div>
        <DoctorPrescription handleChange={this.handleChange} items={this.state.items} />

        <br />
        <div className="columns">
          <div className="column is-2 is-offset-1"><button className="button is-primary is-medium is-fullwidth" onClick={this.clearPrescription}>Clear</button></div>
          <div className="column is-3 is-offset-5"><button className="button is-primary is-medium is-fullwidth" onClick={this.writePrescription}>Write Prescription</button></div>
        </div>

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

            <div className="column is-one-third">
            <article className="message is-warning">
              <div className="message-header">
                <p className="message-title">{item.drug.label}</p>
              </div>
              <div className="message-body">
                <form>
                  <label className="label">
                    Frequency:
                  </label>
                  <div className="field">
                    Patient should take
                      <input
                        id="recurrence"
                        className="input is-inline-number"
                        type="text"
                        value={item.recurrence}
                        onChange={(e) => this.props.handleChange(i, "recurrence", e.target.value)}
                      />
                    dose every day.
                  </div>
                  <br />
                  <div className="field">
                    Patient should take
                      <input
                        id="quantity"
                        type="text"
                        className="input is-inline-number"
                        value={item.quantity}
                        onChange={(e) => this.props.handleChange(i, "quantity", e.target.value)}
                      />
                    each dose.
                  </div>
                  <br />
                  <div className="field">
                    <label className="label">
                      Posology:
                    </label>
                    <div className="control">
                      <textarea
                        id="posology"
                        className="textarea"
                        value={item.posology}
                        onChange={(e) => this.props.handleChange(i, "posology", e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                  <br />
                  <div className="field">
                    <label className="label">
                      End date:
                    </label>
                    <div className="control">
                      <input
                        type="date"
                        className="input"
                        value={item.endDate}
                        onChange={(e) => this.props.handleChange(i, "endDate", e.target.value)}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </article>
          </div>





          ))}
        </div>
      </Fragment>
    )
  }
}

export default Doctor;
