const { paths, baseUrl } = require('./tsconfig.json').compilerOptions;
const { pathsToModuleNameMapper } = require('ts-jest');

module.exports = {
  modulePathIgnorePatterns: ['dist'],
  modulePaths: [baseUrl],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(paths, { prefix: '<rootDir>' }),
    '^lodash-es$': 'lodash'
  },
  transformIgnorePatterns: ['node_modules/(?!@cpp|@angular|@ngrx|.*\\.mjs)'],
  snapshotSerializers: [
    '<rootDir>/node_modules/jest-preset-angular/build/serializers/no-ng-attributes',
    '<rootDir>/node_modules/jest-preset-angular/build/serializers/ng-snapshot',
    '<rootDir>/node_modules/jest-preset-angular/build/serializers/html-comment'
  ]
};
