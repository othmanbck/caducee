import React, { Component, Fragment } from 'react';

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
        <h2 className="title is-4"> Patient {this.props.accounts[0]}</h2>
        {this.state.prescriptions.map(prescription => (
          <div key={prescription.id} className="box columns is-multiline">
            {prescription.prescription.map(prescription => (
              <Fragment key={JSON.stringify(prescription)}>
                <div className="column is-one-third">
                  <h2 className="title is-4">{prescription.drug.label}</h2>
                  <br/>
                  <p className="subtitle is-6">Quantity: {prescription.quantity}</p>
                  <p className="subtitle is-6">Recurrence: {prescription.recurrence}</p>
                </div>
                <div className="column is-two-thirds" style={{height: "30em", overflowY: "scroll"}}><div className="box content is-small" dangerouslySetInnerHTML={{__html: (this.state.drugs[prescription.drug.value] || {info: null}).info}}/></div>
                <div className="column is-11"><br/></div>
                <div className="column is-11"><br/></div>
              </Fragment>
            ))}
          </div>
        ))}
      </div>
    )
  }
}

export default Patient;
