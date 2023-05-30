import Candle from "./Candle";

export default class ExponentialMovingAverage {

    val: number = 0;
    coef: number = 0;

    constructor(period: number, candles: Candle[]) {
        let sma = candles.reduce((acc, candle) => acc + candle.close, 0) / period;
        this.coef = 2 / (period + 1)
        this.val = (candles.slice(-1)[0].close - sma) * this.coef + sma;
    }

    update(candle: Candle) {
        this.val = (candle.close - this.val) * this.coef + this.val;
    }

    getValue() {
        return this.val;
    }
}
