import React, { Component, Fragment } from 'react';
import moment from 'moment';
import PrescriptionStatus from '../components/PrescriptionStatus';
import PrescriptionInfo from '../components/PrescriptionInfo';

class Pharmacy extends Component {
  constructor(props) {
    super(props);
    this.state = { patient: "0x821aea9a577a9b44299b9c15c88cf3087f3b5544", prescriptions: [], filtered_prescriptions: [] };

    this.handleChange = this.handleChange.bind(this);
    this.filterPrescriptionsByDate = this.filterPrescriptionsByDate.bind(this);
    this.filterPrescriptionsByPatient = this.filterPrescriptionsByPatient.bind(this);
  }

  async componentDidMount() {
    const { contract } = this.props;
    const prescriptionEvents = await contract.getPastEvents('WritePrescription', { fromBlock: 0 })
    const prescriptions = prescriptionEvents.map(async prescription => ({
      id: prescription.id,
      patient: prescription.returnValues.patient,
      prescriptionHash: prescription.returnValues.prescriptionHash,
      // prescription is the array of drugs :)
      prescription: JSON.parse((await this.props.node.files.cat(prescription.returnValues.prescriptionHash)).toString('utf-8'))
    }))
    this.setState({ prescriptions: await Promise.all(prescriptions) });
  }

  handleChange(e) {
    this.setState({ patient: e.target.value });
  }

  filterPrescriptionsByDate() {
    const now = moment();
    this.setState(prevState => ({
      filtered_prescriptions: prevState.filtered_prescriptions
        .map(
          prescription => ({
            ...prescription,
            prescription: prescription.prescription.filter(p =>
              moment(p.endDate).isAfter(now)
            )
          })
        )
        .filter(prescription => prescription.prescription.length)
    }));
  }

  filterPrescriptionsByPatient(e) {
    e.preventDefault();
    if (!this.state.patient.length) {
      return;
    }

    const patient_id = this.state.patient;
    this.setState(prevState => ({ filtered_prescriptions: prevState.prescriptions.filter((prescription) => prescription.patient.toLowerCase() === patient_id.toLowerCase()) }), this.filterPrescriptionsByDate);
  }

  render() {
    return(
      <Fragment>
      <div className="title has-text-success is-4">New Prescription Received</div>
      <div className="box">
        <div className="columns">
          <div className="column is-10">
            <input
              className="input"
              value={this.state.patient}
              onChange={this.handleChange}
              placeholder="Patient's address"
            />
          </div>
          <div className="column is-2">
            <button
              className="button is-primary is-fullwidth"
              onClick={this.filterPrescriptionsByPatient}
            >
              Find
            </button>
          </div>
        </div>
      </div>

      <br />
      <div className="title has-text-success is-4">Pending Prescriptions</div>
      <PharmacyPrescription node={this.props.node} contract={this.props.contract} accounts={this.props.accounts} req={this.props.req} filtered_prescriptions={this.state.filtered_prescriptions} />
      </Fragment>
    )
  }

}

class PharmacyPrescription extends Component {
  constructor(props) {
    super(props);
    this.state = { doctor: '0xf17f52151ebef6c7334fad080c5704d77216b732'};
  }
  render() {
    return this.props.filtered_prescriptions.map((prescription, idx) => (
      <div className="box" key={prescription.id}>
        <div className="message is-primary is-standalone">
          <div className="message-header">
            <h3 className="title is-5">From Doctor {this.state.doctor}</h3>
          </div>
        </div>

        {prescription.prescription.map(drug =>
          <Fragment key={drug.drug.value}>
            <div className="columns is-multiline">

            <div className="column is-one-third">
            <article className="message is-warning">
              <div className="message-header">
                <p className="message-title">{drug.drug.label}</p>
              </div>
              <div className="message-body">
                <form>
                  <div className="field">
                    Patient should take
                      <input
                        id="quantity"
                        type="text"
                        className="input is-inline-number"
                        value={drug.quantity}
                        disabled
                      />
                    each dose
                  </div>
                  <br />
                  <div className="field">
                    Patient takes a dose
                      <input
                        id="recurrence"
                        className="input is-inline-number"
                        type="text"
                        value={drug.recurrence}
                        disabled
                      />
                    times a day
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
                        value={drug.posology}
                        disabled
                      ></textarea>
                    </div>
                  </div>
                  <br />
                  <div className="field">
                    <label className="label">
                      Start date:
                    </label>
                    <div className="control">
                      <input
                        type="date"
                        className="input"
                        value={drug.startDate}
                        disabled
                      />
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
                        value={drug.endDate}
                        disabled
                      />
                    </div>
                  </div>
                </form>
              </div>
            </article>
          </div>

            <div className="column is-one-third">
              <article className="message is-success">
                <div className="message-header">
                  <p className="message-title">Prescribed Medicine Status</p>
                </div>
                <div className="message-body">
                  <PrescriptionStatus
                    node={this.props.node}
                    accounts={this.props.accounts}
                    contract={this.props.contract}
                    drug={drug}
                    prescriptionHash={prescription.prescriptionHash}
                  />
                </div>
              </article>
            </div>

            <div className="column is-one-third">
              <article className="message is-dark">
                <div className="message-header">
                  <p className="message-title">Description Details</p>
                </div>
                <div className="message-body">
                  <PrescriptionInfo req={this.props.req} drug={drug}/>
                </div>
              </article>
            </div>
            </div>
            </Fragment>
          )}

      </div>
    ))
  }
}


export default Pharmacy;
