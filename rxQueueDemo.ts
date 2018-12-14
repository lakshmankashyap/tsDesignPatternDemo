import {RxQueue} from 'rx-queue';

const queue = new RxQueue();
queue.next(2);
queue.next(1);
queue.next(5);
queue.subscribe(console.log);