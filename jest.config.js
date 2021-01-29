const path = require('path');

module.exports = {
	collectCoverage: true,
	collectCoverageFrom: [
		'src/graphql/datasources/**/*.(js|ts|tsx)',
	],
	moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
	testMatch: ['**/src/**/*.test.(js|ts|tsx)?(x)'],
	setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
};
