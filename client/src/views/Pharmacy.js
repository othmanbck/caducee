import React, { Component } from 'react';

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
    return (
      <div>
        {this.state.prescriptions.map(prescription => (
          <p key={prescription.id}>{prescription.patient} => {JSON.stringify(prescription.prescription)} ({prescription.prescriptionHash})</p>
        ))}
      </div>
    )
  }
}

export default Pharmacy;
