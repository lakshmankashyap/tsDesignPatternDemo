import {AddTask, obsPROC, obsSTATE, obsTODO, STATE_QUEUE, getHookPromise} from './pocQueue';
import {sayHi, selectApplet, dispatch} from './taskFn';

let handler = (sessionID, timeout) => ()=> sayHi(sessionID, timeout);

setTimeout(()=>AddTask({handler: handler(1, 1000), sid: 1}).then(value=>{
  // console.log(`test`);
  console.log(`test`,value);
  
  let key = value["sid"];
  // let pos = getPromiseHook(key);
  // pos.then((value)=>{
    console.log(`specific sid: #${key}`);
    // console.log(value);
    let finishProm = getHookPromise(key);
    finishProm.promiseObj.getWrappedProms().then(value=> {
      console.log(`final result: [1] ${key}`);
      console.log(value);
      // STATE_QUEUE.delete(key);
    }).catch(e=>{
      console.log(`final error1: `);
      console.log(e);
      // STATE_QUEUE.delete(key);
    });
    // STATE_QUEUE.delete(key);
  // }).catch(e=>{
  //   console.log(`final error: ${e}`);
  //   STATE_QUEUE.delete(key);
  // });
}).catch(e => {
  console.log(`out error1: ${e}`);
}), 1000);

setTimeout(()=>AddTask({handler: handler(2, 1000), sid: 2}).then(value=>{
  // console.log(`rwarw`);
  console.log(`test2`,value);
  if (value) {
    let key = value['sid'];
    // let pos = getPromiseHook(key);
    // pos.then((value)=>{
      console.log(`specific sid: #${key}`);
      // console.log(value);
      let finishProm = getHookPromise(key);
      console.log(finishProm);
      if (finishProm) {
        finishProm.promiseObj.getWrappedProms().then(value=> {
          console.log(`final result: [] ${key}`);
          console.log(value);
          STATE_QUEUE.delete(key);
        }).catch(e=>{
          console.log(`final error 1`);
          console.log(e);
          STATE_QUEUE.delete(key);
        });
      }
      // STATE_QUEUE.delete(key);
      // STATE_QUEUE.delete(key);
    // }).catch(e=>{
    //   console.log(`final error: ${e}, s#${key}`);
    //   STATE_QUEUE.delete(key);
    // })
      
  }
}).catch(e => {
  console.log(`out error2: ${e}`);
}), 2000);

// setTimeout(()=>AddTask({handler: handler(3, 2000), sid: 3}).then(value=>{
//   let key = value["sid"];
//   // let pos = getPromiseHook(key);
//   // pos.then((value)=>{
//     console.log(`key: ${key}`);
//     let finishProm = getHookPromise(key);
//     console.log(`3###`);
//     console.log(finishProm);
//     if (finishProm) {
//       console.log('test 1: ', finishProm.sid);
//       finishProm.promiseObj.getWrappedProms().then(value=> {
//         console.log(`final result: `);
//         console.log(value);
//       }).catch(e=>{
//         console.log(`final error`);
//         console.log(e);
//       });
//     }
//     STATE_QUEUE.delete(key);
//   // }).catch(e=>{
//   //   console.log(`final error: ${e}, #${key}`);
//   //   STATE_QUEUE.delete(key);
//   // })
// }).catch(e => {
//   console.log(`out error: ${e}`);
// }), 2000);