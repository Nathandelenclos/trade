import Candle from "./Candle";
import Schema from "./Schema";

class Game {

    schema: Schema[] = [];
    candles: Candle[] = [];
    stacks: {
        [key: string]: number,
    }= {};

    constructor() {
    }

    nextCandles(data: string): void {
        const rates = data.split(";");
        for (const rate of rates) {
            const [currencyPair, time, high, low, open, close, volume] = rate.split(",");
            this.candles.push({
                open: parseFloat(open),
                close: parseFloat(close),
                currencyPair: currencyPair,
                high: parseFloat(high),
                low: parseFloat(low),
                time: new Date(time),
                volume: parseFloat(volume)
            })
            Schema.addSchema(this.schema, this.candles.slice(-Schema.schemaSize));
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

    getSchemas(): Schema[] {
        return this.schema;
    }

}

export default Game;
