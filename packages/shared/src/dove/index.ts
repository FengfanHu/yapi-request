import { uuid } from "../utils";

enum MsgType {
  INITIATIVE, //主动消息
  PASSIVE, //被动消息
}

export interface Msg {
  key: string;
  type: MsgType;
  data: {
    msgType: any;
    data: any;
  };
}

/**
 * @description 通用消息收发器，带反馈功能
 */
export default class Dove {
  private sender: ((...args: any[]) => void) | null;
  private messagePool: Map<string, (value: any) => void> = new Map();
  private subscribePool: Map<any, Set<symbol>> = new Map();
  private subscribeMapCallback: Map<symbol, (data?: any) => void> = new Map();

  constructor(sender: any) {
    this.sender = sender;
  }

  sendMessage = <T = any>(
    msgType: Msg["data"]["msgType"],
    data?: Msg["data"]["data"]
  ): Promise<T> => {
    return new Promise((resolve) => {
      const key = uuid();
      //注册消息，等待反馈
      this.messagePool.set(key, resolve);
      //发送消息
      this.sender?.({
        key,
        type: MsgType.INITIATIVE,
        data: {
          msgType,
          data,
        },
      });
    });
  };

  receiveMessage = async (message: Msg) => {
    if (message.type === MsgType.INITIATIVE) {
      const keyPool =
        this.subscribePool?.get?.(message.data.msgType) || new Set();
      const gather: any[] = [];
      keyPool.forEach((key) => {
        const callback = this.subscribeMapCallback.get(key);
        if (callback) {
          gather.push(callback(message.data.data));
        } else {
          this.gc(message.data.msgType, key);
        }
      });
      const result = await Promise.all(gather);
      // 反馈消息
      this.sender?.({
        key: message.key,
        type: MsgType.PASSIVE,
        data: {
          msgType: message.type,
          data: result,
        },
      });
    } else if (message.type === MsgType.PASSIVE) {
      const resolve = this.messagePool.get(message.key);
      resolve?.(message.data.data);
    }
  };

  // 订阅消息
  subscribe = (msgType: any, callback: (data: any) => void): symbol => {
    const pool = this.subscribePool.get(msgType) || new Set();
    const key = Symbol();
    pool.add(key);

    this.subscribePool.set(msgType, pool);
    this.subscribeMapCallback.set(key, callback);
    return key;
  };

  // 取消订阅
  unSubscribe = (key: symbol) => {
    this.subscribeMapCallback.delete(key);
  };

  // 垃圾回收
  private gc = (msgType: any, key: symbol) => {
    setTimeout(() => {
      const pool = this.subscribePool.get(msgType) || new Set();
      pool.delete(key);
    });
  };

  //清除所有
  clearAll = () => {
    this.sender = null;
    this.messagePool = new Map();
    this.subscribePool = new Map();
    this.subscribeMapCallback = new Map();
  };
}
