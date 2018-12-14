import {BehaviorSubject} from 'rxjs';
import { async } from 'rxjs/internal/scheduler/async';

export default class PromiseObs {
  private sPromise = null;
  private obsPros = null;
  private wrappedProms = null;

  constructor(sPromise: Promise<any>, condition) {
    this.sPromise = sPromise;
    this.obsPros = new BehaviorSubject(sPromise);
    let me = this;

    this.sPromise.then((value)=> {
      me.obsPros.next(value);
      me.obsPros.complete();
    }).catch(e=> {
      me.obsPros.error(e);
    });

    this.wrappedProms = this.wrapPromise(condition);
  }

  wrapPromise = async(condition) => {
    let me = this;
    return new Promise((resolve, reject) => {
      me.sPromise.then((value)=>{
        if (condition()) {
          reject('reject request');
        }
        else {
          resolve(value);
        }
      }).catch(e => {
        reject(e);
      });
    })
  };

  getWrappedProms = () => {
    return this.wrappedProms;
  }

  getPromisObs = () => {
    return this.obsPros;
  }
}