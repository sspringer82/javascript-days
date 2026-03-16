import { describe, it } from "node:test";
import { strictEqual } from "node:assert";

import Math from "./math.js";

describe('Math', () => {
    describe('add', () => {

        it('should add 1 and 1 and return 2', () => {
            const math = new Math();
            const result = math.add(1,1 );
            strictEqual(result, 2);
        })
    });
});