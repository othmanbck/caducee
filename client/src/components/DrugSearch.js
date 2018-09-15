import React, { Component } from "react";
import axios from "axios";

const TIMEOUT = 1000;

class DrugSearch extends Component {

  constructor(props) {
    super(props);

    this.state = { items: [], text: '', timer: null, req: null };
    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    return (
      <div>
        <h3>SEARCH DRUG</h3>
        <DrugList items={this.state.items} />
        <form>
          <label htmlFor="new-drug">
            Drug to search for:
          </label>
          <input
            id="new-drug"
            onChange={this.handleChange}
            value={this.state.text}
          />
        </form>
      </div>
    );
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
      text: e.target.value,
      timer: setTimeout(() => this.requestDrug(), TIMEOUT)
     });
  }

  async requestDrug() {
    const name = this.state.text;
    const {data} = await this.state.req.get('/drugs?name=' + name);
    this.setState({ items: data.map(drug => drug.title)});
  }

}

class DrugList extends React.Component {
  render() {
    return (
      <ul>
        {this.props.items.map(item => (
          <li key={Math.random()}>{item}</li>
        ))}
      </ul>
    );
  }
}

export default DrugSearch;
