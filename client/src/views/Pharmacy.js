import React, { Component, Fragment } from 'react';

class Pharmacy extends Component {
  constructor(props) {
    super(props);
    this.state = { prescriptions: [] };
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

  render() {
    console.log(this.state.prescriptions);
    return (
      <Fragment>
      {this.state.prescriptions.map(prescription => (

        <div className="box is-prescription">
        {prescription.prescription.map(drug =>
          <Fragment>
            <h3>{drug.drug}</h3>
            <div className="columns is-multiline">


            <div className="column is-one-third" key={drug.drug}>

            </div>
            <div className="column is-one-third" key={drug.drug}>

            </div>
            <div className="column is-one-third" key={drug.drug}>

            </div>


            <div className="column is-one-third" key={drug.drug}>
              <div className="box">
              <p>Prescription</p>
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
                            value={drug.quantity}
                            readOnly
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
                            value={drug.recurrence}
                            readOnly
                          />
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
                            readOnly
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
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="column is-one-third" key={drug.drug+"_change"}>
              <div className="box">
              <p>Current Order</p>
              </div>
            </div>

            <div className="column is-one-third" key={drug.drug+"_moreinfo"}>
              <div className="box">
              <p>More Info</p>
              </div>
            </div>
            </div>
            </Fragment>
          )}
        </div>
        ))}
      </Fragment>
    )
  }
}

export default Pharmacy;
