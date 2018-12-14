import { BehaviorSubject, pipe, of , Subject, from} from 'rxjs';
import {takeWhile, take, map} from 'rxjs/operators';
interface State {
  order: Order;

  cancelOrder();
  verifyPayment();
  shipOrder();
}
class Order {
  public cancelledOrderState: State;
  public paymentPendingState: State;
  public orderShippedState: State;
  public orderBeingPreparedState: State;

  public currentState: State;

  constructor() {
    this.cancelledOrderState = new CancelledOrderState(this);
    this.paymentPendingState = new PaymentPendingState(this);
    this.orderShippedState = new OrderShippedState(this);
    this.orderBeingPreparedState = new OrderBeingPreparedState(this);

    this.setState(this.paymentPendingState);
  }  

  public setState(state: State) {
    this.currentState = state; 
  }

  public getState(): State {
    return this.currentState;
  }
}

class PaymentPendingState implements State {
  public order: Order;  
  
  constructor(order: Order) {
    this.order = order;
  }
  public cancelOrder() {
    console.log('Cancelling your unpaid order...');
    this.order.setState(this.order.cancelledOrderState);
  }

  public verifyPayment() {
    console.log('Payment verified! Shipping soon...');
    this.order.setState(this.order.orderBeingPreparedState);
  }

  public shipOrder() {
    console.log('Cannot ship the order when order is pending...');
  }
}

class CancelledOrderState implements State {
  public order: Order;  
  
  constructor(order: Order) {
    this.order = order;
  }

  public cancelOrder() {
    console.log('Your order has already been canceled...');
  }

  public verifyPayment() {
    console.log('Order canceled, you cannot verify payment.');
  }

  public shipOrder() {
    console.log('Order cannot ship, it was cancelled.');
  }
}

class OrderBeingPreparedState implements State {
  public order: Order;  
  
  constructor(order: Order) {
    this.order = order;
  }

  public cancelOrder() {
    console.log('Cancelling your order...');
    this.order.setState(this.order.cancelledOrderState);
  }

  public verifyPayment() {
    console.log('Already verify your payment');
  }

  public shipOrder() {
    console.log('Shipping your order now');
    this.order.setState(this.order.orderShippedState);
  }
}

class OrderShippedState implements State {
  public order: Order;  
  
  constructor(order: Order) {
    this.order = order;
  }

  public cancelOrder() {
    console.log('You cannot cancel, already shipped!');
  }

  public verifyPayment() {
    console.log('You cannot verify payment, already shipped!');
  }

  public shipOrder() {
    console.log('You cannot ship it again, already shipped!');
  }
}

let order = new Order();
// let source = of(order);
let source = from([1,2,4,7]);
let fiS = source.pipe(takeWhile(value=> {
  // console.log(value);
  return value > 5;
})).pipe(map(value => {
  // console.log(value);
  return value;
}));
fiS.toPromise().then(data=> {console.log('before unde');console.log(data)});

// let fiS = source.pipe(takeWhile( value => { 
//    let currentState = value.currentState;
//    console.log('filtered state: ' , (<any> currentState).constructor.name);
//    return ((<any> currentState).constructor.name == 'OrderShippedState');
// })).pipe(val => {
//   console.log(val.source);
//   return val;
// });
let obs = new BehaviorSubject(fiS);
order.getState().verifyPayment();
console.log(`Order state: ${(<any> order.getState()).constructor.name}`);
order.getState().shipOrder();
// order.getState().cancelOrder();
console.log(`Order state: ${(<any> order.getState()).constructor.name}`);
// obs.toPromise().then(value => {
//   console.log(`finish`);
//   console.log(value);
// });
obs.subscribe({
  next: value => {
    // console.log(`curValue`);
    // console.log(value);
    console.log(`curValue: ${(<any> order.getState()).constructor.name}`);
    // this.complete();
    // obs.complete();
  },
  complete: () => {
    console.log('finish');
  }
});
// console.log(obs.value);
obs.pipe(take(1)).toPromise().then((data)=>{
  // console.log(`value`);
  // console.log(data);
  console.log(`finishValue: ${(<any> order.getState()).constructor.name}`);
  // console.log(data);
}).catch(e => {
  console.log(`error:`);
  console.log(e);
});
// let poBs = obs.toPromise();
// poBs.then((data)=> {
//   console.log('finish');
//   console.log(data);
//   // console.log(value);
// }).catch(e=>{
//   console.log(`error`);
//   console.log(e);
// })