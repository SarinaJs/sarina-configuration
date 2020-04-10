module.exports = {
  name: "sarina-configuration",
  verbose: true,
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testRegex: ".spec.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverageFrom: ["src/**/*.(t|j)s"],
  coverageDirectory: "test_result/coverage",
  testEnvironment: "node",
  moduleNameMapper: {
    "@sarina/configuration/(.*)": "<rootDir>/src/$1",
    "@sarina/configuration": "<rootDir>/src/index.ts",
  },
};
