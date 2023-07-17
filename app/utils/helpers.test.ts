import { ethers } from "ethers";
import { fromTokenAmount, hashToUint256 } from "./helpers";

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

describe("Participation id hashing", () => {
  test("review document", () => {
    const review = {
      serviceRequestId: "2468098975717564244596535739996048250590380252504592812668",
      submissionId: "309131532810312892982854808926614953617330872896",
      id: "979952040593592027018162751923477643798263213460",
    };
    const bn = hashToUint256(`${review.serviceRequestId}${review.submissionId}${review.id}`);
    expect(bn.lte(ethers.constants.MaxUint256)).toBe(true);
  });
});
