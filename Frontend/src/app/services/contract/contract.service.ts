import { Inject, Injectable } from '@angular/core';
import { WEB3 } from '../../core/web3';
import { BehaviorSubject, Subject } from 'rxjs';
import Web3 from 'web3';
import { environment } from 'src/environments/environment';
import { CardNFTResponse } from 'src/app/models/cardNFTResponse.model';

declare let window: any;
declare let require: any;
const cardTokenAbi = require('../../../../../Blockchain/build/contracts/Card.json');
const PurchaseAbi = require('../../../../../Blockchain/build/contracts/Purchase.json');

const contract = require("@truffle/contract");

@Injectable({
  providedIn: 'root'
})

export class ContractService {
  public accountsObservable = new Subject<string[]>();
  public compatible: boolean;
  web3Modal;
  web3js;
  provider;
  accounts;
  balance;



  constructor(@Inject(WEB3) private web3: Web3) {
  }

  async loadWeb3() {

    if (window.ethereum && window.ethereum.isMetaMask) {

      window.ethereum.on('accountsChanged', function (accounts) {
        this.accounts = accounts;
        window.location.reload();
      });
      window.ethereum.on('connect', function (res) {
        window.location.reload(true);
      });


      this.provider = window.ethereum;
      this.web3js = new Web3(this.provider); // create web3 instance
      try {
        this.accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      } catch (e) {
        alert("Please connect to Metamask account !")
        window.location.reload();
      }


    } else {
      alert('Metamask was not detected. Please install and connect to metamask !');
      window.location.reload();
    }

  }



  async connectAccount() {
    await this.loadWeb3();
    this.accounts = await this.web3js.eth.getAccounts();
    return this.accounts;
  }

  async accountInfo(accounts) {
    const initialvalue = await this.web3js.eth.getBalance(accounts[0]);
    this.balance = this.web3js.utils.fromWei(initialvalue, 'ether');
    return this.balance;
  }


  async accountIsAdmin() {
    await this.connectAccount();
    return this.accounts[0] == environment.admin_address;
  }


  async createNFTCard(originAccount, metadataHash) {

    return new Promise((resolve, reject) => {
      const tokenURI = `${environment.pinata_gateway_url}/${metadataHash}`;
      const cardContract = contract(cardTokenAbi);
      cardContract.setProvider(this.provider);
      cardContract.deployed().then((instance) => {
        return instance.mintCard(
          originAccount,
          tokenURI,
          { from: originAccount, value: Web3.utils.toWei('0.02', 'ether'), gas: 1000000 }
        );
      }).then((status) => {
        if (status) {
          return resolve(status);
        }
      }).catch((error) => {
        console.log(error);
        return reject('Error creating card nft');
      });
    });

  }

  async getAccountCards(originAccount): Promise<CardNFTResponse[]> {
    return new Promise((resolve, reject) => {
      const cardContract = contract(cardTokenAbi);
      cardContract.setProvider(this.provider);
      cardContract.deployed().then((instance) => {
        return instance.getCardsByOwner(
          originAccount,
          { from: originAccount }
        );
      }).then((result) => {
        if (result) {
          return resolve(result);
        }
      }).catch((error) => {
        console.log(error);
        return reject('Error getting account cards');
      });
    });
  }


  async buyNFTCard(tokenId, price) {
    return new Promise((resolve, reject) => {
      const cardContract = contract(cardTokenAbi);
      cardContract.setProvider(this.provider);
      cardContract.deployed().then((instance) => {
        return instance.buyCard(
          this.accounts[0],
          tokenId,
          { from: this.accounts[0], value: Web3.utils.toWei(String(price), 'ether'), gas: 1000000 }
        );
      }).then((status) => {
        if (status) {
          return resolve(status);
        }
      }).catch((error) => {
        console.log(error);
        return reject('Error buying card');
      });
    });
  }

  async sendCard(to, tokenId) {
    return new Promise((resolve, reject) => {
      const cardContract = contract(cardTokenAbi);
      cardContract.setProvider(this.provider);
      cardContract.deployed().then((instance) => {
        return instance.sendCard(
          to,
          tokenId,
          { from: this.accounts[0], value: Web3.utils.toWei('0.01', 'ether'), gas: 1000000 }
        );
      }).then((status) => {
        if (status) {
          return resolve(status);
        }
      }).catch((error) => {
        console.log(error);
        return reject('Error buying card');
      });
    });
  }


  async getMarketCards(): Promise<CardNFTResponse[]> {
    return new Promise((resolve, reject) => {
      const cardContract = contract(cardTokenAbi);
      cardContract.setProvider(this.provider);
      cardContract.deployed().then((instance) => {
        return instance.getMarketCards(
          { from: this.accounts[0] }
        );
      }).then((result) => {
        if (result) {
          return resolve(result);
        }
      }).catch((error) => {
        console.log(error);
        return reject('Error getting cards');
      });
    });

  }

  async saleCard(tokenId) {
    return new Promise((resolve, reject) => {
      const cardContract = contract(cardTokenAbi);
      cardContract.setProvider(this.provider);
      cardContract.deployed().then((instance) => {
        return instance.saleCard(
          tokenId,
          { from: this.accounts[0], value: Web3.utils.toWei('0.02', 'ether'), gas: 1000000 }
        );
      }).then((status) => {
        if (status) {
          return resolve(status);
        }
      }).catch((error) => {
        console.log(error);
        return reject('Error solding card');
      });
    });
  }

  async stopSallingCard(tokenId) {
    return new Promise((resolve, reject) => {
      const cardContract = contract(cardTokenAbi);
      cardContract.setProvider(this.provider);
      cardContract.deployed().then((instance) => {
        return instance.stopSallingCard(
          tokenId,
          { from: this.accounts[0] }
        );
      }).then((status) => {
        if (status) {
          return resolve(status);
        }
      }).catch((error) => {
        console.log(error);
        return reject('Error solding card');
      });
    });
  }

  /**
   * ticket service part
   */

  showTickets(address) {
    return new Promise((resolve, reject) => {
      var contract = require("@truffle/contract");
      const paymentContract = contract(PurchaseAbi);
      paymentContract.setProvider(this.provider);
      paymentContract.deployed().then((instance) => {
        return instance.showTicket(address, { from: address });
      }).then((status) => {
        if (status) {
          return resolve(status);
        }
      }).catch((error) => {
        console.log(error);

        return reject('Error transfering Ether');
      });
    });
  }

  buyTicket(departure, arrival, travelTime, name, price) {
    return new Promise((resolve, reject) => {
      var contract = require("@truffle/contract");
      const paymentContract = contract(PurchaseAbi);
      paymentContract.setProvider(this.provider);
      paymentContract.deployed().then((instance) => {
        return instance.buyTickets(this.accounts[0], departure, arrival, travelTime, name, this.web3.utils.toWei(price, 'ether'), {
          from: this.accounts[0],
          value: this.web3.utils.toWei(price, 'ether')
          , gas: 1000000
        }
        );
      }).then((status) => {
        if (status) {
          return resolve({ status: true });
        }
      }).catch((error) => {
        console.log(error);
        return reject("Erreur lors du transfert d' Ether");
      });
    });
  }

}

