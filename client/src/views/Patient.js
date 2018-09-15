import React, { Component, Fragment } from 'react';

class Patient extends Component {
  constructor(props) {
    super(props);
    this.state = { prescriptions: [], drugs: {} };
  }

  async componentDidMount() {
    const { contract, accounts } = this.props;
    const prescriptionEvents = await contract.getPastEvents('WritePrescription', { fromBlock: 0, filter: { patient: accounts[0] } })
    console.log(prescriptionEvents);
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
      var info;
      var drug;
      try {
        info = (await this.props.req('/drugs/' + id + '/info/patient?type=pure-html')).data;
        drug = (await this.props.req('/drugs/' + id)).data;
      } catch (e) {
      }
      return { info: info, ...drug }
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
              {prescription.prescription.map(prescription => (
                <Fragment key={JSON.stringify(prescription)}>
                  <div className="column is-one-third">
                    <h2 className="title is-4">{prescription.drug.label}</h2>
                    <br/>
                    <p className="subtitle is-6">Quantity: {prescription.quantity}</p>
                    <p className="subtitle is-6">Recurrence: {prescription.recurrence}</p>
                    <p className="subtitle is-6">Posology: {prescription.posology}</p>
                  </div>
                  <div className="column is-two-thirds"><div className="box"><div className="is-drug-info" dangerouslySetInnerHTML={{__html: (this.state.drugs[prescription.drug.value] || {info: null}).info}}/></div></div>
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
