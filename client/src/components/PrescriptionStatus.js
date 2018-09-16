import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { Buffer } from 'buffer';

class PrescriptionStatus extends Component {
  constructor(props) {
    super(props);
    this.state = { followup: 0, quantityBrought: 0, totalUnits: 0 };
    this.updateFollowup = this.updateFollowup.bind(this);
    this.onChangeFollowup = this.onChangeFollowup.bind(this);
    this.submitFollowup = this.submitFollowup.bind(this);
  }

  async updateFollowup() {
    const { contract } = this.props;
    const followupEvents = await contract.getPastEvents('WriteFollowup', { fromBlock: 0 })
    const followups = followupEvents.map(async followup => ({
      id: followup.id,
      followupHash: followup.returnValues.followupHash,
      followup: JSON.parse((await this.props.node.files.cat(followup.returnValues.followupHash)).toString('utf-8'))
    })).filter(async followup => ((await followup).followup.prescriptionHash || '').toLowerCase() === this.props.prescriptionHash.toLowerCase())

    followups.forEach(async fu => {
      const { followup } = await fu;
      if (followup.prescriptionHash && (followup.prescriptionHash.toLowerCase() === this.props.prescriptionHash.toLowerCase())) {
        this.setState(prevState => {
          if (prevState.quantityBrought < followup.followup) {
            return ({ quantityBrought: followup.followup });
          }
        })
      }
    })
  }

  componentDidMount() {
    try {
      const treatmentDays = moment(this.props.drug.endDate).diff(moment(this.props.drug.startDate), 'days');
      const totalUnits = Number(this.props.drug.quantity) * Number(this.props.drug.recurrence) * Number(treatmentDays);
      this.setState({totalUnits});
    } catch (e) {
    }
    this.updateFollowup()
  }

  onChangeFollowup(e) {
    this.setState({ followup: e.target.value });
  }

  async submitFollowup() {
    const { contract, accounts, node } = this.props;
    const followup = { followup: (Number(this.state.followup) + Number(this.state.quantityBrought)), prescriptionHash: this.props.prescriptionHash };
    this.setState({ followup: 0 })
    const followupHash = (await node.files.add(new Buffer(JSON.stringify(followup))))[0].hash;
    await contract.writeFollowup(this.state.patient, followupHash, {from: accounts[0]});
    setInterval(this.updateFollowup, 2000); // Ugly, I know ;(
  }

  render() {
    const greet = this.props.isPatient ? 'You have' : 'Patient has'
    return (
      <Fragment>
        <div className="box">
          {greet} already bought {this.state.quantityBrought} out of {this.state.totalUnits} units
          <progress className="progress is-info" value={this.state.quantityBrought} max={this.state.totalUnits}/>
        </div>
        {!this.props.isPatient &&
          <div className="box">
            <div className="field">
              Patient bought
              <input className="input is-inline-number" type="text" value={this.state.followup} onChange={this.onChangeFollowup}/>
              units
            </div>
            <button className="button is-info" onClick={this.submitFollowup}>
              Submit
            </button>
          </div>
        }
      </Fragment>
    )
  }
}

export default PrescriptionStatus;
