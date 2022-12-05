import {Inject, Injectable} from '@angular/core';
import { WEB3 } from '../../core/web3';
//import contract from 'truffle-contract'; //acceso a libreria deprecada
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Subject } from 'rxjs';

import Web3 from 'web3';
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { environment } from 'src/environments/environment';

declare let require: any;
const cardTokenAbi = require('../../../../../Blockchain/build/contracts/Card.json');
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

  private _loading = new BehaviorSubject<boolean>(false);
  public loading$ ;


  constructor(@Inject(WEB3) private web3: Web3 ) {
    this.loading$ = this._loading.asObservable();
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: "27e484dcd9e3efcfd25a83a78777cdf1" // required
        }
      }
    };

    this.web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: true, // optional
      providerOptions, // required
      theme: {
        background: "rgb(39, 49, 56)",
        main: "rgb(199, 199, 199)",
        secondary: "rgb(136, 136, 136)",
        border: "rgba(195, 195, 195, 0.14)",
        hover: "rgb(16, 26, 32)"
      }
    });
  }


  async connectAccount() {
    this.provider = await this.web3Modal.connect(); // set provider
    this.web3js = new Web3(this.provider); // create web3 instance
    this.accounts = await this.web3js.eth.getAccounts();
    return this.accounts;
  }

  async accountInfo(accounts){
    const initialvalue = await this.web3js.eth.getBalance(accounts[0]);
    this.balance = this.web3js.utils.fromWei(initialvalue , 'ether');
    return this.balance;
  }


  async accountIsAdmin(){
    await this.connectAccount();
    return this.accounts[0] == environment.admin_address;
  }


  async createNFTCard(originAccount,metadataHash){
    await this.connectAccount();
    return new Promise((resolve, reject) => {
    const tokenURI = `${environment.pinata_gateway_url}/${metadataHash}`;
    const cardContract = contract(cardTokenAbi);
    cardContract.setProvider(this.provider);
    cardContract.deployed().then((instance) => {
      return instance.mintCard(
        originAccount,
        tokenURI,
        {from: originAccount, value: Web3.utils.toWei('0.2', 'ether'),  gas:1000000}
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

  async getAccountCards(originAccount){
    await this.connectAccount();
    return new Promise((resolve, reject) => {
      const cardContract = contract(cardTokenAbi);
      cardContract.setProvider(this.provider);
      cardContract.deployed().then((instance) => {
        return instance.getCardsByOwner(
          originAccount,
          {from: originAccount}
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


  async buyNFTCard(tokenId, price){
    await this.connectAccount();
    return new Promise((resolve, reject) => {
      const cardContract = contract(cardTokenAbi);
      cardContract.setProvider(this.provider);
      cardContract.deployed().then((instance) => {
        return instance.buyCard(
          this.accounts[0],
          tokenId,
          {from: this.accounts[0], value: Web3.utils.toWei(String(price), 'ether'),  gas:1000000}
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

  async sendNFTCard(to,tokenId,price){
    await this.connectAccount();
    return new Promise((resolve, reject) => {
      const cardContract = contract(cardTokenAbi);
      cardContract.setProvider(this.provider);
      cardContract.deployed().then((instance) => {
        return instance.sendCard(
          to,
          tokenId,
          {from: this.accounts[0], value: Web3.utils.toWei(String(price), 'ether'),  gas:1000000}
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



}

