import Candle from "./Candle";


export default class Schema {
    candles: Candle[] = [];
    overview: number[] = [];
    repeated: number = 0;
    static schemaSize: number = 5;
    static marginOfErrorShape: number = 2;
    static marginOfErrorAmplitude: number = 100;

    constructor(candles: Candle[]) {
        this.candles = candles;
        this.overview = Schema.toOverview(candles);
    }

    /**
     * Compare two schemas
     * @param schema - The schema to compare
     * @param numberOfCompare - The number of candle to compare
     * @param marginOfErrorAmplitude
     * @param marginOfErrorShape
     */
    compare(schema: Schema, numberOfCompare = Schema.schemaSize, marginOfErrorAmplitude = Schema.marginOfErrorAmplitude ,marginOfErrorShape = Schema.marginOfErrorShape): number {
        let count: number = 0;
        const marginOfErrorAmplitudeBase = marginOfErrorAmplitude;
        for (let i: number = 0; i < numberOfCompare; i++) {
            const baseCount = count;
            marginOfErrorAmplitude = Math.abs(this.overview[i]) * marginOfErrorAmplitudeBase / 100;
            if (this.overview[i] + marginOfErrorAmplitude <= schema.overview[i] &&
            this.overview[i] - marginOfErrorAmplitude >= schema.overview[i]) count++;
            if (baseCount === count && marginOfErrorShape > 0) {
                marginOfErrorShape--;
                count++;
            }
        }
        return count;
    }

    /**
     * Add a schema to the list of schemas
     * @param schemas - The list of schemas
     * @param candles - The candles to add
     */
    static addSchema(schemas: Schema[], candles: Candle[]): Schema[] {
        if (candles.length < Schema.schemaSize) return schemas;
        for (const schema of schemas) {
            if (schema.compare(new Schema(candles)) >= Schema.schemaSize) {
                schema.repeated++;
                return schemas;
            }
        }
        schemas.push(new Schema(candles));
        return schemas
    }

    /**
     * Convert candles to overview
     * @param candles - The candles to convert
     */
    static toOverview(candles: Candle[]): number[] {
        const overview: number[] = [];
        for (let i = 0; i < Schema.schemaSize; i++) {
            if (!candles[i]) continue;
            overview.push(Math.round(candles[i].close - candles[i].open));
        }
        return overview;
    }
}
