import Game from "./Game";
import Order from "./Order";
import {Currencies} from "./Currencies";
import ExponentialMovingAverage from "./ExponentialMovingAverage";

class Bot {

    settingsData: {
        [key: string]: string
    } = {};
    lowEma: ExponentialMovingAverage | undefined | null;
    speedEma: ExponentialMovingAverage | undefined | null;
    lastSpeedEmaValue: number = 0;
    lastLowEmaValue: number = 0;

    game: Game = new Game();
    order: Order = new Order(Currencies.USDT, Currencies.BTC);
    saver: number = 0;

    constructor() {

    }

    settings(variable: string, value: string) {
        this.settingsData[variable] = value;
    }

    update(data: string) {
        const [type, ...rest] = data.split(" ");
        if (type === "game") {
            const [action, ...data] = rest;
            this.game.update(action, data.join(" "));
        }
    }

    action() {
        const btc = this.game.getStack(Currencies.BTC);
        const usdt = this.game.getStack(Currencies.USDT);
        const period = 10
        const [beforeCandle, lastCandle] = this.game.getCandles().slice(-2)
        const variation = this.game.getCandles().slice(-(period - 1)).map((acc) => acc.close - acc.open)
        const benefice = variation.filter((acc) => acc > 0)
        const beneficeAverage = benefice.reduce((acc, val) => Math.abs(acc + val), 0) / benefice.length
        const lost = variation.filter((acc) => acc < 0)
        const lostAverage = lost.reduce((acc, val) => Math.abs(acc + val), 0) / lost.length
        const RS = beneficeAverage / lostAverage
        const RSI = 100 - (100 / (1 + RS))
        const value = usdt + (btc * lastCandle.close)

        if (!this.lowEma)
            this.lowEma = new ExponentialMovingAverage(period, this.game.getCandles().slice(-(period * 4)))
        else {
            this.lastLowEmaValue = this.lowEma.getValue()
            this.lowEma.update(lastCandle)
        }
        if (!this.speedEma)
            this.speedEma = new ExponentialMovingAverage(period, this.game.getCandles().slice(-period))
        else {
            this.lastSpeedEmaValue = this.speedEma.getValue()
            this.speedEma.update(lastCandle)
        }

        if (value > 1200) {
            const usdt_need = 1200 - usdt
            const btc_need = usdt_need / lastCandle.close
            if (btc_need > 0 && btc > btc_need) {
                this.order.sell(btc_need);
                return;
            }
        }

        if (value < 900) {
            if (btc > 0) {
                this.order.sell(btc);
                return
            }
        }

        if (this.lastSpeedEmaValue < this.lastLowEmaValue && this.speedEma.getValue() > this.lastLowEmaValue) {
            const amount = (10 / lastCandle.close) * ((RSI / 100) + 1)
            console.error("buy 1 stack", usdt, "amount", amount, "price", lastCandle.close * amount)
            if (usdt >= lastCandle.close * amount) {
                this.order.buy(amount);
            } else {
                process.stdout.write("pass\n");
            }
        } else if (this.lastSpeedEmaValue > this.lastLowEmaValue && this.speedEma.getValue() < this.lastLowEmaValue) {
            const amount = 0.0005 * ((RSI / 100) + 1)
            console.error("sell 1 stack", btc, "amount", amount, "price", lastCandle.close * amount)
            if (btc > amount)
                this.order.sell(amount);
            else
                process.stdout.write("pass\n");
        }

        if (beforeCandle.close < this.speedEma.getValue() && lastCandle.close > this.speedEma.getValue()) {
            const amount = (100 / lastCandle.close) * ((RSI / 100) + 1)
            console.error("buy 2 stack", usdt, "amount", amount, "price", lastCandle.close * amount)
            if (usdt > lastCandle.close * amount) {
                this.order.buy(amount);
            } else {
                process.stdout.write("pass\n");
            }
        } else if (beforeCandle.close > this.speedEma.getValue() && lastCandle.close < this.speedEma.getValue()) {
            const amount = 0.005 * ((RSI / 100) + 1)
            console.error("sell 2 stack", btc, "amount", amount, "price", lastCandle.close * 0.01)
            if (btc > amount)
                this.order.sell(amount);
            else
                process.stdout.write("pass\n");
        } else {
            process.stdout.write("pass\n");
        }
    }
}

export default Bot;
