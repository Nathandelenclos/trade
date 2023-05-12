class Order {

    currencyStart = "";
    currencyEnd = "";

    constructor(currencyStart: string, currencyEnd: string) {
        this.currencyStart = currencyStart
        this.currencyEnd = currencyEnd
    }

    sell(mount: number, currency?: string) {
        process.stdout.write(`sell ${this.currencyStart}_${this.currencyEnd} ${mount}\n`)
    }

    buy(mount: number) {
        process.stdout.write(`buy ${this.currencyStart}_${this.currencyEnd} ${mount}\n`)
    }
}

export default Order;
