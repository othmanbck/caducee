import React, { Component } from "react";
import Select from "react-select";

const TIMEOUT = 1000;

class DrugSearch extends Component {

  constructor(props) {
    super(props);

    this.state = { items: [], text: '', timer: null, value: null };
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleChange(e) {
    clearTimeout(this.state.timer);

    this.setState({
      text: e,
      timer: setTimeout(() => this.requestDrug(), TIMEOUT)
     });
  }

  handleSelect(e) {
    this.props.onDrugSelect(e);
    this.setState({ value: null });
  }

  async requestDrug() {
    const name = this.state.text;
    try {
      const {data} = await this.props.req.get('/drugs?name=' + name);
      this.setState({ items: data.map(drug =>
        ({ value: drug.swissmedicIds[0], label: drug.title })).filter(drug => drug.value)
      });
    } catch(e) {

    }
  }

  render() {
    return (
      <Select
        searchable={true}
        autoload={false}
        placeholder={"Add Drug to Prescription"}
        value={this.state.value}
        onInputChange={this.handleChange}
        onChange={this.handleSelect}
        loadOptions={this.requestDrug}
        options={this.state.items}
      />
    );
  }

}

export default DrugSearch;
