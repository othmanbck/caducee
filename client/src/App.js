import React, { Component } from "react";
import NameTBDContract from "./contracts/NameTBD.json";
import getWeb3 from "./utils/getWeb3";
import truffleContract from "truffle-contract";
import DrugSearch from "./components/DrugSearch";
import Doctor from './views/Doctor';
import Pharmacy from './views/Pharmacy';
import Patient from './views/Patient';

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      storageValue: 0,
      web3: null,
      accounts: null,
      contract: null,
      statusLoaded: false,
      isDoctor: false,
      isPharmacy: false
    };
  }

  async componentDidMount() {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const Contract = truffleContract(NameTBDContract);
      Contract.setProvider(web3.currentProvider);
      const instance = await Contract.deployed();

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.getStatus);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.log(error);
    }
  };

  async getStatus() {
    const { accounts, contract } = this.state;

    const isDoctor = await contract.doctors(accounts[0]);
    const isPharmacy = await contract.pharmacies(accounts[0]);
    
    this.setState({ statusLoaded: true, isDoctor, isPharmacy });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Blockchain...</div>;
    }
    if (!this.state.statusLoaded) {
      return <div>Loading your status...</div>;
    }
    return (
      <div className="App">
        <h1>Name TBD</h1>
        <StatusChooser
          isDoctor={this.state.isDoctor}
          isPharmacy={this.state.isPharmacy}
        />
        <DrugSearch />
      </div>
    );
  }
}

const StatusChooser = props => {
  if (props.isDoctor) return <Doctor/>;
  if (props.isPharmacy) return <Pharmacy/>;
  return <Patient/>;
}

export default App;
