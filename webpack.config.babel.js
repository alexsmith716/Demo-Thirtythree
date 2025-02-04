import path from 'path';
import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import LoadablePlugin from '@loadable/webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
//  import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import nodeExternals from 'webpack-node-externals';

const DIST_PATH = path.resolve(__dirname, 'public/dist');

const getConfig = (target) => ({
	name: target,
	mode: 'development',
	target,
	entry: target === 'node' ? './src/server/renderer.js' : './src/client/index.js',
	externals: target === 'node' ? ['@loadable/component', nodeExternals()] : undefined,
	output: {
		path: path.join(DIST_PATH, target),
		filename: '[name].js',
		publicPath: `/dist/${target}/`,
		libraryTarget: target === 'node' ? 'commonjs2' : undefined,
	},

	module: {
		rules: [

			{
				type: 'javascript/auto',
				test: /\.mjs$/,
				use: [],
				include: /node_modules/,
			},

			{
				test: /\.(graphql|gql)$/,
				exclude: /node_modules/,
				loader: 'graphql-tag/loader',
			},

			{
				test: /\.(ts|tsx|js|jsx)?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				options: {
					caller: { target },
				},
			},

			{
				test: /\.(css)$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					{
						loader: 'css-loader',
					},
					{
						loader: 'resolve-url-loader',
					},
					{
						loader: 'postcss-loader',
					},
				],
			},

			{
				test: /\.(scss)$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					{
						loader: 'css-loader',
					},
					{
						loader: 'resolve-url-loader',
					},
					{
						loader: 'postcss-loader',
					},
					{
						loader: 'sass-loader',
						options: {
							sassOptions: {
								outputStyle: 'compressed',
							},
						},
					},
				],
			},

			{
				test: /\.(woff|woff2|ttf)$/,
				use: [
					{
						loader: 'file-loader',
					},
				],
			},

			{
				test: /\.(gif|jpg|svg|png|ico)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							name: '[contenthash:8].[ext]',
							esModule: false,
						},
					},
				],
			},
		],
	},

	performance: {
		hints: false,
	},

	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					output: {
						comments: true,
					},
					compress: {
						drop_console: true,
					},
				},
			}),
		],
		moduleIds: 'deterministic',
		runtimeChunk: 'single',
		splitChunks: {
			chunks: 'all',
			maxInitialRequests: Infinity,
			minSize: 20000,
			cacheGroups: {
				defaultVendors: {
					test: /\/node_modules\//,
					name(module) {
						const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
						return `npm.${packageName.replace('@', '')}`;
					},
				},
			},
		},
		//	runtimeChunk: {
		//		name: 'manifest',
		//	},
		//	splitChunks: {
		//		minSize: 10000,
		//		maxSize: 250000,
		//		cacheGroups: {
		//			defaultVendors: {
		//				test: /node_modules/,
		//				chunks: 'all',
		//				enforce: true,
		//			},
		//		},
		//	},
	},

	resolve: {
		modules: ['node_modules'],
		extensions: ['.ts', '.tsx', '.js', '.json', '.jsx', '.css', '.scss', '.mjs'],
		alias: {
			react: path.resolve('./node_modules/react'),
			graphql: path.resolve('./node_modules/graphql'),
		},
		//	fallback: {
		//		'assert': require.resolve('assert/'),
		//	}
	},

	plugins: [
		new ForkTsCheckerWebpackPlugin(),
		new CopyPlugin({
			patterns: [{ from: './src/public', to: DIST_PATH },],
		}),
		new MiniCssExtractPlugin({
			filename: '[name].[contenthash:8].css'
		}),
		new webpack.ProvidePlugin({
			process: 'process/browser',
		}),
		new webpack.DefinePlugin({
			'process.env.IS_BROWSER': JSON.stringify(target !== 'node'),
		}),
		new LoadablePlugin(),
		//  new BundleAnalyzerPlugin({
		//  	analyzerMode: 'static',
		//  	reportFilename: './bundleAnalyzer/webpack.config.babel.html',
		//  	openAnalyzer: false,
		//  	generateStatsFile: false
		//  }),
	],
})

export default [ getConfig('web'), getConfig('node') ]
