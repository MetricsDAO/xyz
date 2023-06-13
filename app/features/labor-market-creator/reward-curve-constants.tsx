import { BigNumber } from "ethers";

const constantLikert = {
  auxilaries: [BigNumber.from(100)],
  alphas: [BigNumber.from(0), BigNumber.from(25), BigNumber.from(50), BigNumber.from(75), BigNumber.from(90)],
  betas: [BigNumber.from(0), BigNumber.from(25), BigNumber.from(50), BigNumber.from(75), BigNumber.from(100)],
};

const aggresive = {
  auxilaries: [BigNumber.from(100)],
  alphas: [BigNumber.from(0), BigNumber.from(74), BigNumber.from(90)],
  betas: [BigNumber.from(0), BigNumber.from(50), BigNumber.from(100)],
};

const acceptable = {
  auxilaries: [BigNumber.from(100)],
  alphas: [BigNumber.from(0), BigNumber.from(49), BigNumber.from(74)],
  betas: [BigNumber.from(0), BigNumber.from(50), BigNumber.from(100)],
};

const passFail = {
  auxilaries: [BigNumber.from(100)],
  alphas: [BigNumber.from(0), BigNumber.from(70)],
  betas: [BigNumber.from(0), BigNumber.from(100)],
};

export function getRewardCurveArgs(curveType: string) {
  console.log(curveType);
  switch (curveType) {
    case "Constant":
      return constantLikert;
    case "Aggressive":
      return aggresive;
    case "Acceptable":
      return acceptable;
    case "Pass / Fail":
      return passFail;
    default:
      return constantLikert;
  }
}
