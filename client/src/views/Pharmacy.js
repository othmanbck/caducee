import React, { Component, Fragment } from 'react';
import moment from 'moment';

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
    console.log(now);
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
      <div className="box-title">New Prescription Received</div>

      <div className="pale-rect slim-rect">
        <form onSubmit={this.filterPrescriptionsByPatient}>
          <div className="field is-horizontal">

            <div className="field-label">
              <label className="label" htmlFor="eth_addr">
                <h3 className="title is-5">Patient address</h3>
              </label>
            </div>

            <div className="field is-grouped">
              <p className="control is-expanded">
                <input
                  id="eth_addr"
                  type="text"
                  className="input"
                  onChange={this.handleChange}
                  value={this.state.patient}
                />
              </p>
              <p className="control">
                <button type="submit" className="button is-info">Submit</button>
              </p>
            </div>

          </div>
        </form>
      </div>

      <br />
      <div className="box-title">Pending Prescriptions</div>
        <PharmacyPrescription filtered_prescriptions= {this.state.filtered_prescriptions} />
      </Fragment>
    )
  }

}

class PharmacyPrescription extends Component {
  render() {
    return (
      <Fragment>
      {this.props.filtered_prescriptions.map((prescription, idx) => (
        <div className="pale-rect">
        <Fragment key={idx}>
        <div className="dark-rect slim-rect">
          <form>
            <div className="field is-horizontal">

              <div className="field-label">
                <label className="label" htmlFor="eth_addr">
                  <h3 className="title is-5">Doctor address</h3>
                </label>
              </div>

              <div className="field is-grouped">
                  <input
                    id="eth_addr"
                    type="text"
                    className="input"
                    value={prescription.patient}
                    disabled
                  />
              </div>

            </div>
          </form>
        </div>
        <div className="box is-prescription">
        {prescription.prescription.map(drug =>
          <Fragment key={drug.drug.value}>
            <h3 className="subtitle is-3">{drug.drug.label}</h3>
            <div className="columns is-multiline">

            <div className="column is-one-third">

            <article className="message is-warning">
              <div className="message-header">
                <p>Dark</p>
              </div>
              <div className="message-body">
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
                            type="number"
                            className="input"
                            value={drug.quantity}
                            disabled
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
                            type="number"
                            className="input"
                            value={drug.recurrence}
                            disabled
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
                            value={drug.posology}
                            disabled
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                  <br />
                  <div className="field is-horizontal">
                    <div className="field-label is-normal">
                      <label className="label" htmlFor="start-date">
                        Start date:
                      </label>
                    </div>
                    <div className="field-body">
                      <div className="field">
                        <div className="control">
                          <input
                            type="date"
                            id="start-date"
                            className="input"
                            value={drug.startDate}
                            disabled
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
                      <div className="field">
                        <div className="control">
                          <input
                            type="date"
                            id="end-date"
                            className="input"
                            value={drug.endDate}
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </article>
          </div>

            <div className="column is-one-third">
              <article className="message is-success">
                <div className="message-header">
                  <p>Prescribed Medicine Status</p>
                </div>
                <div className="message-body">
                </div>
              </article>
            </div>

            <div className="column is-one-third">
              <article className="message is-dark">
                <div className="message-header">
                  <p>Description Details</p>
                </div>
                <div className="message-body">
                </div>
              </article>
            </div>
            </div>
            </Fragment>
          )}
        </div>
        </Fragment>
        </div>
        ))}
      </Fragment>
    )
  }
}

export default Pharmacy;
