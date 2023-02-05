/**
 * @type {import('jest').Config}
 */
const config = {
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: ['config/**/*.js', 'modules/**/*.js'],
  coveragePathIgnorePatterns: ['index.js'],
  coverageDirectory: 'coverage',
};

module.exports = config;
