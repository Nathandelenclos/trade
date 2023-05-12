import Candle from "./Candle";

class Game {

    candles: Candle[] = [];
    stacks: {
        [key: string]: number,
    }= {};

    constructor() {
    }

    nextCandles(data: string): void {
        const rates = data.split(";");
        for (const rate of rates) {
            const [currencyPair, time, open, close, high, low, volume] = rate.split(",");
            this.candles.push({
                open: parseFloat(open),
                close: parseFloat(close),
                currencyPair: currencyPair,
                high: parseFloat(high),
                low: parseFloat(low),
                time: new Date(time),
                volume: parseFloat(volume)
            })
        }
    }

    updateStacks(data: string): void {
        const rates = data.split(",");
        for (const rate of rates) {
            const [currency, amount] = rate.split(":");
            this.stacks[currency] = parseFloat(amount);
        }
    }

    update(type: string, data: string): void {
        if (type == "next_candles") this.nextCandles(data);
        if (type == "stacks") this.updateStacks(data);
    }

    getStack(currency: string): number {
        return this.stacks[currency];
    }

    getCandles(currencyPair?: string): Candle[] {
        if (!currencyPair) return this.candles;
        return this.candles.filter(candle => candle.currencyPair === currencyPair);
    }
}

export default Game;
