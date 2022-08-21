import { Socket } from 'ngx-socket-io';
import { Helper } from './helper';

declare let io: any;

export class Streaming {
  socket = io('wss://streamer.cryptocompare.com');
  channelToSubscription = new Map();

  constructor() {
    this.socket.on('connect', () => {
      console.log('[this.socket] Connected');
    });

    this.socket.on('disconnect', (reason: any) => {
      console.log('[this.socket] Disconnected:', reason);
    });

    this.socket.on('error', (error: any) => {
      console.log('[this.socket] Error:', error);
    });

    this.socket.on('m', (data: any) => {
      console.log('[this.socket] Message:', data);
      const [
        eventTypeStr,
        exchange,
        fromSymbol,
        toSymbol,
        ,
        ,
        tradeTimeStr,
        ,
        tradePriceStr,
      ] = data.split('~');

      if (parseInt(eventTypeStr) !== 0) {
        // skip all non-TRADE events
        return;
      }
      const tradePrice = parseFloat(tradePriceStr);
      const tradeTime = parseInt(tradeTimeStr);
      const channelString = `0~${exchange}~${fromSymbol}~${toSymbol}`;
      const subscriptionItem = this.channelToSubscription.get(channelString);
      if (subscriptionItem === undefined) {
        return;
      }
      const lastDailyBar = subscriptionItem.lastDailyBar;
      const nextDailyBarTime = this.getNextDailyBarTime(lastDailyBar.time);

      let bar: any;
      if (tradeTime >= nextDailyBarTime) {
        bar = {
          time: nextDailyBarTime,
          open: tradePrice,
          high: tradePrice,
          low: tradePrice,
          close: tradePrice,
        };
        console.log('[this.socket] Generate new bar', bar);
      } else {
        bar = {
          ...lastDailyBar,
          high: Math.max(lastDailyBar.high, tradePrice),
          low: Math.min(lastDailyBar.low, tradePrice),
          close: tradePrice,
        };
        console.log('[this.socket] Update the latest bar by price', tradePrice);
      }
      subscriptionItem.lastDailyBar = bar;

      // send data to every subscriber of that symbol
      subscriptionItem.handlers.forEach((handler: any) =>
        handler.callback(bar)
      );
    });
  }

  getNextDailyBarTime(barTime: any) {
    const date = new Date(barTime * 1000);
    date.setDate(date.getDate() + 1);
    return date.getTime() / 1000;
  }

  subscribeOnStream(
    symbolInfo: any,
    resolution: any,
    onRealtimeCallback: any,
    subscribeUID: any,
    onResetCacheNeededCallback: any,
    lastDailyBar: any
  ) {
    const parsedSymbol = new Helper().parseFullSymbol(
      symbolInfo.full_name
    ) as any;
    const channelString = `0~${parsedSymbol.exchange}~${parsedSymbol.fromSymbol}~${parsedSymbol.toSymbol}`;
    const handler = {
      id: subscribeUID,
      callback: onRealtimeCallback,
    };
    let subscriptionItem = this.channelToSubscription.get(channelString);
    if (subscriptionItem) {
      // already subscribed to the channel, use the existing subscription
      subscriptionItem.handlers.push(handler);
      return;
    }
    subscriptionItem = {
      subscribeUID,
      resolution,
      lastDailyBar,
      handlers: [handler],
    };
    this.channelToSubscription.set(channelString, subscriptionItem);
    console.log(
      '[subscribeBars]: Subscribe to streaming. Channel:',
      channelString
    );
    this.socket.emit('SubAdd', { subs: [channelString] });
  }

  unsubscribeFromStream(subscriberUID: any) {
    // find a subscription with id === subscriberUID
    for (const channelString of this.channelToSubscription.keys()) {
      const subscriptionItem = this.channelToSubscription.get(channelString);
      const handlerIndex = subscriptionItem.handlers.findIndex(
        (handler: any) => handler.id === subscriberUID
      );

      if (handlerIndex !== -1) {
        // remove from handlers
        subscriptionItem.handlers.splice(handlerIndex, 1);

        if (subscriptionItem.handlers.length === 0) {
          // unsubscribe from the channel, if it was the last handler
          console.log(
            '[unsubscribeBars]: Unsubscribe from streaming. Channel:',
            channelString
          );
          this.socket.emit('SubRemove', { subs: [channelString] });
          this.channelToSubscription.delete(channelString);
          break;
        }
      }
    }
  }
}
