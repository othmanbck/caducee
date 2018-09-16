import React, { Component } from 'react';

class PrescriptionInfo extends Component {
  constructor(props) {
    super(props);
    this.state = { info: '' };
  }

  async componentDidMount() {
    const info = (await this.props.req('/drugs/' + this.props.drug.drug.value + '/info/' + (this.props.isPatient ? 'patient' : 'professional') + '?type=pure-html')).data;
    this.setState({ info });
  }

  render() {
    return (
      <div className="is-drug-info" dangerouslySetInnerHTML={{__html: this.state.info}}/>
    )
  }
}

export default PrescriptionInfo;
