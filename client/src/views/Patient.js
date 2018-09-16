import React, { Component, Fragment } from 'react';
import PrescriptionInfo from '../components/PrescriptionInfo';
import PrescriptionStatus from '../components/PrescriptionStatus';

class Patient extends Component {
  constructor(props) {
    super(props);
    this.state = { prescriptions: [], drugs: {} };
  }

  async componentDidMount() {
    const { contract, accounts } = this.props;
    const prescriptionEvents = await contract.getPastEvents('WritePrescription', { fromBlock: 0, filter: { patient: accounts[0] } })
    const prescriptions = prescriptionEvents.map(async prescription => ({
      id: prescription.id,
      patient: prescription.returnValues.patient,
      prescriptionHash: prescription.returnValues.prescriptionHash,
      // prescription is the array of drugs :)
      prescription: JSON.parse((await this.props.node.files.cat(prescription.returnValues.prescriptionHash)).toString('utf-8'))
    }))
    this.setState({ prescriptions: await Promise.all(prescriptions) }, this.getDrugsInfo);
  }

  async getDrugsInfo() {
    const drugList = this.state.prescriptions.map(prescription => prescription.prescription).flat().map(prescription => prescription.drug.value);
    const drugInfo = await Promise.all(drugList.map(async id => {
      var drug;
      try {
        drug = (await this.props.req('/drugs/' + id)).data;
      } catch (e) {
      }
      return drug
    }));
    const drugs = {};
    drugInfo.forEach(drug => {if(drug.title) drugs[drug.swissmedicIds[0]] = drug});
    this.setState({ drugs });
  }

  render() {
    return (
      <div>
        <div className="title has-text-success is-4">My Address</div>
        <div className="box">
          <h3 className="title is-5">{this.props.accounts[0]}</h3>
        </div>
        <br/>
        <div className="title has-text-success is-4">My Prescriptions</div>
        {this.state.prescriptions.map(prescription => (
          <div key={prescription.id} className="box">
            <div className="message is-primary is-standalone">
              <div className="message-header">
                <div className="title is-5">
                  From Doctor {'0xf17f52151ebef6c7334fad080c5704d77216b732'}
                </div>
              </div>
            </div>
            <div className="columns is-multiline">
              {prescription.prescription.map(drug => (
                <Fragment key={JSON.stringify(drug)}>
                  <div className="column is-one-third">
                    <article className="message is-warning">
                      <div className="message-header">
                        <div className="message-title">{drug.drug.label}</div>
                      </div>
                      <div className="message-body">
                        <p>You should take <strong>{drug.quantity}</strong> doses, <strong>{drug.recurrence}</strong> time(s) every day</p>
                        <br/>
                        <label className="label">Doctor{"'"}s note</label>
                        <div className="box">
                          <p>{drug.posology}</p>
                        </div>
                        <br/>
                        <label className="label">Take until</label>
                        <p><strong>{drug.endDate}</strong></p>
                        <br/>
                        <button className="button is-warning is-large">Contact Doctor</button>
                      </div>
                    </article>
                  </div>
                  <div className="column is-one-thirds">
                    <div className="message is-success">
                      <div className="message-header">
                        <p className="message-title">Prescription Status</p>
                      </div>
                      <div className="message-body">
                        <PrescriptionStatus
                          node={this.props.node}
                          accounts={this.props.accounts}
                          contract={this.props.contract}
                          drug={drug}
                          prescriptionHash={prescription.prescriptionHash}
                          isPatient
                        />
                        <br/>
                        <div className="has-text-centered">
                          <label className="label">Pickup today ?</label>
                          <button className="button is-success">Map</button>
                          <br/>
                          <br/>
                          <label className="label">Delegate Proxy</label>
                          <button className="button is-success">New</button>
                          <br/>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="column is-one-thirds">
                    <div className="message is-dark">
                      <div className="message-header">
                        <p className="message-title">Prescription Details</p>
                      </div>
                      <div className="message-body">
                        <PrescriptionInfo isPatient req={this.props.req} drug={drug}/>
                      </div>
                    </div>
                  </div>
                  <div className="column is-11"><br/></div>
                  <div className="column is-11"><br/></div>
                </Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }
}

export default Patient;
