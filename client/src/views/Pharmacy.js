import React, { Component } from 'react';

class Pharmacy extends Component {
  constructor(props) {
    super(props);
    this.state = { prescriptions: [] };
  }

  async componentDidMount() {
    const { contract } = this.props;
    const prescriptions = await contract.getPastEvents('WritePrescription', { fromBlock: 0 })
    console.log(prescriptions)
    this.setState({ prescriptions });
  }

  render() {
    return (
      <div>
        {this.state.prescriptions.map(prescription => (
          <p key={prescription.id}>{prescription.returnValues.patient} => {prescription.returnValues.prescriptionHash}</p>
        ))}
      </div>
    )
  }
}

export default Pharmacy;
