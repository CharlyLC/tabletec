/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/classCallCheck");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/createClass");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _app = __webpack_require__(5);

/****************************************************************************************/

function main() {
	return new _app.App();
}
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

main();

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.App = undefined;

var _classCallCheck2 = __webpack_require__(0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _http = __webpack_require__(6);

var _http2 = _interopRequireDefault(_http);

var _path = __webpack_require__(7);

var _path2 = _interopRequireDefault(_path);

var _colors = __webpack_require__(8);

var _colors2 = _interopRequireDefault(_colors);

var _express = __webpack_require__(2);

var _express2 = _interopRequireDefault(_express);

var _server = __webpack_require__(9);

var _jsonfile = __webpack_require__(10);

var _jsonfile2 = _interopRequireDefault(_jsonfile);

var _web = __webpack_require__(11);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/****************************************************************************************/

var App = function () {
	function App() {
		(0, _classCallCheck3.default)(this, App);

		this.config = _jsonfile2.default.readFileSync(_path2.default.join(__dirname, 'config.json'));

		this.express = (0, _express2.default)();

		this.express.use(_express2.default.static(_path2.default.join(__dirname, 'assets')));
		this.express.use(this.setRender);

		var webRouter = new _web.WebRouter();
		this.express.use('/', webRouter.router);

		this.onLoad();
	}

	(0, _createClass3.default)(App, [{
		key: 'onLoad',
		value: function onLoad() {
			this.server = _http2.default.createServer(this.express);
			this.server.listen(this.config.port, this.onStart.bind(this));
		}
	}, {
		key: 'onStart',
		value: function onStart() {
			console.log(_colors2.default.blue('INFORMACIÓN: El servidor está listo y escuchando por el puerto:', this.config.port));
		}

		/**
   * Render Overrider Midleware
   */

	}, {
		key: 'setRender',
		value: function setRender(req, res, next) {
			res.render = function (Component) {
				return res.send((0, _server.renderToString)(Component));
			};
			next();
		}
	}]);
	return App;
}();
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

exports.App = App;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("colors");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("react-dom/server");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("jsonfile");

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.WebRouter = undefined;

var _classCallCheck2 = __webpack_require__(0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _express = __webpack_require__(2);

var _express2 = _interopRequireDefault(_express);

var _homeController = __webpack_require__(12);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/****************************************************************************************/

/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

var WebRouter = function WebRouter() {
	(0, _classCallCheck3.default)(this, WebRouter);

	this.router = _express2.default.Router();

	this.controller = {
		home: new _homeController.HomeController()
	};

	this.router.get('/', this.controller.home.index.bind(this.controller.default));
	this.router.get('/login', this.controller.home.index.bind(this.controller.default));
};

exports.WebRouter = WebRouter;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.HomeController = undefined;

var _classCallCheck2 = __webpack_require__(0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _react = __webpack_require__(3);

var _react2 = _interopRequireDefault(_react);

var _home = __webpack_require__(13);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/****************************************************************************************/

/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

var HomeController = function () {
	function HomeController() {
		(0, _classCallCheck3.default)(this, HomeController);
	}

	(0, _createClass3.default)(HomeController, [{
		key: 'index',
		value: function index(req, res) {
			res.render(_react2.default.createElement(_home.HomeView, null));
		}
	}]);
	return HomeController;
}();

exports.HomeController = HomeController;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.HomeView = undefined;

var _getPrototypeOf = __webpack_require__(14);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(15);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(16);

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = __webpack_require__(3);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/****************************************************************************************/

var HomeView = function (_React$Component) {
	(0, _inherits3.default)(HomeView, _React$Component);

	function HomeView(props) {
		(0, _classCallCheck3.default)(this, HomeView);
		return (0, _possibleConstructorReturn3.default)(this, (HomeView.__proto__ || (0, _getPrototypeOf2.default)(HomeView)).call(this, props));
	}

	(0, _createClass3.default)(HomeView, [{
		key: "render",
		value: function render() {
			return _react2.default.createElement(
				"html",
				null,
				_react2.default.createElement(
					"head",
					null,
					_react2.default.createElement("meta", { name: "viewport", content: "width=device-width, user-scalable=yes, initial-scale=1, maximum-scale=1" }),
					_react2.default.createElement("link", { href: "http://fonts.googleapis.com/icon?family=Material+Icons", rel: "stylesheet" }),
					_react2.default.createElement("link", { rel: "stylesheet", type: "text/css", href: "/css/tabletec.min.css" })
				),
				_react2.default.createElement(
					"body",
					null,
					_react2.default.createElement("div", { id: "app-main" }),
					_react2.default.createElement("script", { src: "/js/tabletec.deps.min.js" }),
					_react2.default.createElement("script", { src: "/js/tabletec.min.js" })
				)
			);
		}
	}]);
	return HomeView;
}(_react2.default.Component);
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

exports.HomeView = HomeView;

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/object/get-prototype-of");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/possibleConstructorReturn");

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/inherits");

/***/ })
/******/ ]);