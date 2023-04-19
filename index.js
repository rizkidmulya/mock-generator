const fs = require("fs");

let mocks = [];
const CONDITIONS = ["BAD", "OK", "GOOD", "VERY GOOD", "NEW"];

const MONTHS_IN_YEAR = 12;

/**
 * @param {number} min
 * @param {number} max
 */
const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

/**
 * @param {Number} length
 * @param {Object} opitons
 * @param {number} opitons.minPrice
 * @param {number} opitons.maxPrice
 */
const generateData = (length = 10, opitons = {}) => {
  const MAX_PRICE = opitons?.maxPrice || 500;
  const MIN_PRICE = opitons?.minPrice || 100;

  for (let i = 0; i < length; i++) {
    const productName = `Product ${i + 1}`;
    const initalPrice = randomNumber(MIN_PRICE, MAX_PRICE);
    const qualityIndex = randomNumber(0, CONDITIONS.length);
    const quality = CONDITIONS[qualityIndex];
    const ageInMonths = randomNumber(0, 24);

    const productLifeSpan = randomNumber(1, 10);

    const qualityFactor = (qualityIndex + 1) / CONDITIONS.length;
    const ageFactor = ageInMonths / (MONTHS_IN_YEAR * productLifeSpan);
    const initalSellingPrice = initalPrice * (qualityFactor - ageFactor);

    const sellingPrice = Number(
      Math.max(initalSellingPrice, initalPrice * qualityFactor).toFixed(2)
    );

    mocks.push({
      productName,
      initalPrice,
      quality,
      productLifeSpan,
      ageInMonths,
      sellingPrice,
    });

    processDone = i + 1;
  }
};

const writeJSON = () => {
  fs.writeFileSync("output/mock.json", JSON.stringify(mocks), (err) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log("Done");
  });
};

generateData(100);
writeJSON();
