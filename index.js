import fs from "fs";

let mocks = [];
const CONDITIONS = ["BAD", "OK", "GOOD", "VERY GOOD", "LIKE NEW"];
const MONTHS_IN_YEAR = 12;

/**
 * @param {number} min
 * @param {number} max
 */
const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const calculateOverallRating = (quality, initialPrice, sellingPrice) => {
  const MAX_RATING = 5;

  const qualityRating = Number(
    (quality / CONDITIONS.length) * MAX_RATING
  ).toFixed(1);
  const priceDelta = initialPrice - sellingPrice;

  const priceRating = (priceDelta / initialPrice) * MAX_RATING;

  const overallRating = qualityRating * 0.8 + priceRating * 0.2;

  return Math.max(overallRating, 1).toFixed(1);
};

/**
 * @param {Number} length
 * @param {Object} options
 * @param {number[]} options.priceRange The range of initial Price
 * @param {number[]} options.ageRange Range of product age
 * @param {number[]} options.lifeSpanRange Range of procuct lifespan (effecting price decision)
 * @example
 * generateData(10, {
 *  priceRange: [100, 1000],
 *  ageRange: [0, 12] //in months
 *  lifeSpan: [1, 10] // in years
 * })
 */
const generateData = (length = 10, options = {}) => {
  const priceRange = options?.priceRange || [100, 500];
  const ageRange = options?.ageRange || [0, 60];
  const lifeSpanRange = options.lifeSpanRange || [1, 10];

  for (let i = 0; i < length; i++) {
    const productName = `Product ${i + 1}`;
    const initialPrice = randomNumber(priceRange[0], priceRange[1]);
    const qualityIndex = randomNumber(0, CONDITIONS.length);
    const quality = CONDITIONS[qualityIndex];

    const productLifeSpan = randomNumber(lifeSpanRange[0], lifeSpanRange[1]);
    const ageInMonths = Math.min(
      randomNumber(ageRange[0], ageRange[1]),
      productLifeSpan * MONTHS_IN_YEAR
    );

    const qualityFactor =
      ((CONDITIONS.length - qualityIndex) / CONDITIONS.length) *
      initialPrice *
      0.5;
    const ageFactor =
      (ageInMonths / (MONTHS_IN_YEAR * productLifeSpan)) * initialPrice * 0.5;

    const sellingPrice = Number(
      (initialPrice - (qualityFactor + ageFactor)).toFixed(2)
    );

    const purchased = Math.round(Math.random());
    const rating =
      calculateOverallRating(qualityIndex + 1, initialPrice, sellingPrice) *
      purchased;
    mocks.push({
      productName,
      initialPrice,
      quality,
      ageInMonths,
      sellingPrice,
      rating,
      purchased,
    });
  }
};

const writeJSON = () => {
  fs.writeFileSync("output/mock.json", JSON.stringify(mocks), (err) => {
    if (err) {
      console.log(err);
      return;
    }
  });
};

generateData(100);
writeJSON();
