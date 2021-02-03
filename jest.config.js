const path = require('path');

module.exports = {
	collectCoverage: true,
	collectCoverageFrom: [
		'src/graphql/**/*.(js|jsx|ts|tsx)',
		'src/server/**/*.(js|jsx|ts|tsx)',
	],
	moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
	testMatch: ['**/src/**/*.test.(js|ts|tsx)?(x)'],
	//	testMatch: ['**/src/graphql/datasources/**/*.test.(js|ts|tsx)?(x)'],
	setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
};
