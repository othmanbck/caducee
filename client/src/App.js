import React, { Component, Fragment } from "react";
import axios from "axios";
import IPFS from 'ipfs';
import AsclepiusContract from "./contracts/Asclepius.json";
import getWeb3 from "./utils/getWeb3";
import truffleContract from "truffle-contract";
import NavBar from './components/NavBar';
import Doctor from './views/Doctor';
import Pharmacy from './views/Pharmacy';
import Patient from './views/Patient';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      storageValue: 0,
      web3: null,
      accounts: null,
      contract: null,
      node: null,
      req: null,
      accountsChecker: null,
      statusLoaded: false,
      isDoctor: false,
      isPharmacy: false
    };
    this.checkAccount = this.checkAccount.bind(this);
    this.getStatus = this.getStatus.bind(this);
  }

  async componentDidMount() {
    const node = new IPFS();
    node.on('ready', () => {this.setState({ node });});

    const req = axios.create({
      baseURL: 'https://health.axa.ch/hack/api/',
      headers: {'Authorization': 'tangy tooth'}
    });


    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const Contract = truffleContract(AsclepiusContract);
      Contract.setProvider(web3.currentProvider);
      const instance = await Contract.deployed();

      const accountsChecker = setInterval(this.checkAccount, 1000);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance, accountsChecker, req }, this.getStatus);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.log(error);
    }
  }

  async checkAccount() {
    const accounts = await this.state.web3.eth.getAccounts();
    if (accounts[0] !== this.state.accounts[0]) {
      this.setState({ accounts }, this.getStatus);
    }
  }

  async getStatus() {
    const { accounts, contract } = this.state;

    const isDoctor = await contract.doctors(accounts[0]);
    const isPharmacy = await contract.pharmacies(accounts[0]);

    this.setState({ statusLoaded: true, isDoctor, isPharmacy });
  }

  componentWillUnmount() {
    clearInterval(this.state.accountsChecker);
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Blockchain...</div>;
    }
    if (!this.state.node) {
      return <div>Loading IPFS...</div>;
    }
    if (!this.state.statusLoaded) {
      return <div>Loading your status...</div>;
    }
    return (
      <Fragment>
        <NavBar/>
        <div className="section">
          <div className="container">
            <StatusChooser
              {...this.state}
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

const StatusChooser = props => {
  if (props.isDoctor) return <Doctor {...props}/>;
  if (props.isPharmacy) return <Pharmacy {...props}/>;
  return <Patient key={props.accounts[0]} {...props}/>;
}

export default App;
