import { fromTokenAmount } from "./helpers";

describe("fromTokenAmount rounding", () => {
  test("numbers greater than or equal to 1", () => {
    let result = fromTokenAmount("1000000000000000000", 18, 2);
    expect(result).toBe("1.0");
    result = fromTokenAmount("7765555500000000000000", 18, 2);
    expect(result).toBe("7765.56");
    result = fromTokenAmount("7765555500000000000000", 18, 3);
    expect(result).toBe("7765.556");
  });
  test("numbers less than 1", () => {
    let result = fromTokenAmount("355555000000000", 18, 2);
    expect(result).toBe("0.00036");
    result = fromTokenAmount("355555000000000", 18, 4);
    expect(result).toBe("0.0003556");
    result = fromTokenAmount("12555", 18, 2);
    expect(result).toBe("0.000000000000013");
  });
});
