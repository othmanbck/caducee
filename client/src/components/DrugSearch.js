import React, { Component } from "react";
import axios from "axios";
import Select from "react-select";

const TIMEOUT = 1000;

class DrugSearch extends Component {

  constructor(props) {
    super(props);

    this.state = { items: [], text: '', timer: null, req: null };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    var instance = axios.create({
      baseURL: 'https://health.axa.ch/hack/api/',
      headers: {'Authorization': 'tangy tooth'}
    });
    this.setState({ req: instance });
  }

  handleChange(e) {
    clearTimeout(this.state.timer);

    this.setState({
      text: e,
      timer: setTimeout(() => this.requestDrug(), TIMEOUT)
     });
  }

  async requestDrug() {
    const name = this.state.text;
    const {data} = await this.state.req.get('/drugs?name=' + name);
    this.setState({ items: data.map(drug =>
      ({ value: Math.random(), label: drug.title }))
    });
    return this.state.items;
  }

  render() {
    return (
      <div>
        <h3>Async search</h3>
        <Select
          searchable={true}
          autoload={false}
          onInputChange={this.handleChange}
          loadOptions={this.requestDrug}
          options={this.state.items}
        />
      </div>
    );
  }

}

class DrugList extends React.Component {
  render() {
    return (
      <ul>
        {this.props.items.map(item => (
          <li key={item.value}>{item.label}</li>
        ))}
      </ul>
    );
  }
}

export default DrugSearch;
