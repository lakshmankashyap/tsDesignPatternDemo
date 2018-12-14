import {BehaviorSubject, Observable, of, from} from 'rxjs';
import {takeUntil, take, takeWhile, filter} from 'rxjs/operators';
import PromiseObs from './promiseObs';
enum APDU_STATE {
  WAIT,
  PROC,
  DONE,
  CANCEL
}
interface STATE {
  state: APDU_STATE,
  obs: BehaviorSubject<any> 
};
interface TODO {
  sid: number,
  handler: Function,
  params?: any
};
interface PROC {
  sid: number,
  promiseObj: PromiseObs
}
const STATE_QUEUE: Map<number, STATE> = new Map();
const TODO_QUEUE: Array<TODO> = [];
const PROC_QUEUE: Array<PROC> = [];

let obsTODO = new BehaviorSubject(TODO_QUEUE);
let obsPROC = new BehaviorSubject(PROC_QUEUE);
let obsSTATE = new BehaviorSubject(STATE_QUEUE);
const AddTask = async (todo: TODO) =>{
  let {sid, handler, params} = todo;
  console.log(`sid:#${sid}, params: ${params}`);
  addSTATE(sid, APDU_STATE.WAIT);
  addTODO(sid, handler, params);
  // TODO_QUEUE next 
  obsTODO.next(TODO_QUEUE);
  // return state observable
  STATE_QUEUE.get(sid).obs.subscribe({
    next: (value) => {
      console.log(`next `, value);
    }
  });
  let source = STATE_QUEUE.get(sid).obs.pipe(takeWhile(value => value.state >= APDU_STATE.PROC)).pipe(take(1));
  source.subscribe({
    next: (value) => {
      console.log('source: ', value);
    }
  })
  // let source2 = takeUntil(source);
  return source.toPromise();
};
obsTODO.subscribe({
  next: (todoList) => {
    if (todoList.length > 0) {
      let nextDO = todoList[0];
      if (PROC_QUEUE.length == 0) {
        addPROC(nextDO);
        obsTODO.next(TODO_QUEUE);
      } else {
        let proc = PROC_QUEUE[0];
        console.log(`[first] prev sid: #${proc.sid} is cancelled by ${nextDO.sid}`);
        handlerPROC();
        // obsTODO.next(TODO_QUEUE);
      }
    } else {
      if (PROC_QUEUE.length > 0) {
        // let proc = PROC_QUEUE[0];
        // console.log(`prev sid: #${proc.sid} is cancelled by ${nextDO.sid}`);
        handlerPROC();
      }
    }
  }
});
const addSTATE = (sid: number, state: APDU_STATE) => {
  let stateObj = {sid, state};
  let obs = new BehaviorSubject(stateObj);
  STATE_QUEUE.set(sid, {state, obs});
};

const addTODO = (sid: number, handler: Function, params: any) => {
  // remove previous
  let prev = TODO_QUEUE.shift();
  if (prev) {
    console.log(`[todo] prev sid: #${prev.sid} is cancelled by ${sid}`);
    changeSTATE(prev.sid, APDU_STATE.CANCEL);
  }
  TODO_QUEUE.unshift({sid, handler, params});
};

const changeSTATE = (sid: number, state: APDU_STATE) => {
  let target = STATE_QUEUE.get(sid);
  if (target) {
    target.state = state;
    target.obs.next({sid, state});
  }
  obsSTATE.next(STATE_QUEUE);
};
const addPROC = (todo: TODO) => {
  let {sid, handler, params} = todo;
  TODO_QUEUE.shift();
  let promise = handler(params);
  let promiseObj = new PromiseObs(promise, ()=> TODO_QUEUE.length > 0);
  PROC_QUEUE.unshift({sid, promiseObj});
  changeSTATE(sid, APDU_STATE.PROC);
  obsPROC.next(PROC_QUEUE);
  // obsTODO.next(TODO_QUEUE);
};
obsPROC.subscribe({
  next: (procList) => {
    if (procList.length == 0) {
      let nextDO = TODO_QUEUE[0];
      if (nextDO ) {
        addPROC(nextDO);
      }
    }
  }
})
const handlerPROC = () => {
  let proc = PROC_QUEUE[0];
  console.log(`proc: sid :${proc.sid}`);
  proc.promiseObj.getPromisObs().subscribe({
    complete: () => {
      console.log(`process finished sid #${proc.sid}`);
      changeSTATE(proc.sid, APDU_STATE.DONE);
      // console.log(PROC_QUEUE.length);
      if (PROC_QUEUE.length > 0) {
        PROC_QUEUE.shift();
        obsPROC.next(PROC_QUEUE);
      }
      // if (TODO_QUEUE.length > 0) {
      //   addPROC(TODO_QUEUE[0]);
      //   obsTODO.next(TODO_QUEUE);
      // }
      // addPROC(TODO_QUEUE[0]);
      // obsTODO.next(TODO_QUEUE);
      
    }
  });
};

const getHookPromise = (sid: number) => {
  return PROC_QUEUE.find((value) => value.sid == sid); 
};
export {AddTask, obsPROC, obsTODO, obsSTATE, STATE_QUEUE, getHookPromise };