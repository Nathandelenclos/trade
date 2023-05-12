export default interface Candle {
    open: number;
    close: number;
    high: number;
    low: number;
    volume: number;
    time: Date;
    currencyPair: string;
}
