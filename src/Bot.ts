import Game from "./Game";
import Order from "./Order";
import { Currencies } from "./Currencies";

class Bot {

    settingsData: {
        [key: string]: string
    } = {};

    count: number = 0;

    game: Game = new Game();
    order: Order = new Order(Currencies.USDT, Currencies.BTC);

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
        const candle = this.game.getCandles("USDT_BTC").slice(-1)[0];
        const btc = this.game.getStack("BTC");
        const amount = 5 / candle.close;
        if (this.game.getStack("USDT")  > 100) {
            this.order.buy(amount)
        } else if (this.count == 0) {
            this.order.sell(btc * 0.1)
            this.count++;
        } else {
            process.stdout.write("pass\n")
        }
    }
}

export default Bot;
