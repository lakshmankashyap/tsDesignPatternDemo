import * as moment from 'moment';
const sayHi = async (sid:number, timeout: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(()=>{
      resolve({message: `[reply] sayHi response with sid: ${sid}`});
    }, timeout);
  });
};

const selectApplet = async (sid:number, timeout: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(()=>{
      console.log(`[task] selectApplet fires about ${timeout} ms`);
      resolve({message: `[reply] selectApplet response with sid: ${sid}`});
    }, timeout);
  });
};

const dispatch = async (cb: Function, timeout: number, launchTime: number) => {
  return new Promise((resolve, reject)=> {
    setTimeout(() => {
      let sid = moment().unix()*1000;
      resolve(cb(sid, timeout));
    }, launchTime);
  });
};

export {sayHi, selectApplet, dispatch};
