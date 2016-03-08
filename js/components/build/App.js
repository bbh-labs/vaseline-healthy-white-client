'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _flux = require('flux');

var _flux2 = _interopRequireDefault(_flux);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var dispatcher = new _flux2.default.Dispatcher();

var App = function (_React$Component) {
	_inherits(App, _React$Component);

	function App() {
		var _Object$getPrototypeO;

		var _temp, _this, _ret;

		_classCallCheck(this, App);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(App)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = {
			page: 'main',
			file: null
		}, _temp), _possibleConstructorReturn(_this, _ret);
	}

	_createClass(App, [{
		key: 'render',
		value: function render() {
			var page = undefined;

			switch (this.state.page) {
				case 'main':
					page = _react2.default.createElement(Main, null);
					break;
				case 'capture':
					page = _react2.default.createElement(Capture, null);
					break;
				case 'post-process':
					page = _react2.default.createElement(PostProcess, null);
					break;
				case 'result':
					page = _react2.default.createElement(Result, { file: this.state.file });
					break;
				default:
					page = null;
					break;
			}

			return _react2.default.createElement(
				'div',
				{ id: 'app' },
				page
			);
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this2 = this;

			this.listenerID = dispatcher.register(function (payload) {
				switch (payload.page) {
					case 'main':
					case 'capture':
					case 'post-process':
						_this2.setState({ page: payload.page });
						break;
					case 'result':
						_this2.setState({ page: payload.page, file: payload.file });
						break;
				}
			});
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			dispatcher.unregister(this.listenerID);
		}
	}]);

	return App;
}(_react2.default.Component);

var Main = function (_React$Component2) {
	_inherits(Main, _React$Component2);

	function Main() {
		_classCallCheck(this, Main);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Main).apply(this, arguments));
	}

	_createClass(Main, [{
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{ id: 'main' },
				_react2.default.createElement(
					'button',
					{ onClick: function onClick() {
							dispatcher.dispatch({ page: 'capture' });
						} },
					'Capture'
				)
			);
		}
	}]);

	return Main;
}(_react2.default.Component);

var Capture = function (_React$Component3) {
	_inherits(Capture, _React$Component3);

	function Capture() {
		_classCallCheck(this, Capture);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Capture).apply(this, arguments));
	}

	_createClass(Capture, [{
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{ id: 'capture' },
				_react2.default.createElement(
					'h1',
					null,
					'Capturing photo..'
				)
			);
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			_jquery2.default.ajax({
				url: '/api/capture',
				method: 'POST'
			}).done(function (response) {
				console.log('captured');
				dispatcher.dispatch({ page: 'post-process' });
			}).fail(function (response) {
				alert('Failed to capture the photo!');
				dispatcher.dispatch({ page: 'main' });
			});
		}
	}]);

	return Capture;
}(_react2.default.Component);

var PostProcess = function (_React$Component4) {
	_inherits(PostProcess, _React$Component4);

	function PostProcess() {
		_classCallCheck(this, PostProcess);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(PostProcess).apply(this, arguments));
	}

	_createClass(PostProcess, [{
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{ id: 'post-process' },
				_react2.default.createElement(
					'h1',
					null,
					'Post Processing..'
				)
			);
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			_jquery2.default.ajax({
				url: '/api/post_process',
				method: 'POST'
			}).done(function (file) {
				dispatcher.dispatch({ page: 'result', file: 'tv/' + file });
			}).fail(function (response) {
				alert('Failed to post process the photo!');
				dispatcher.dispatch({ page: 'main' });
			});
		}
	}]);

	return PostProcess;
}(_react2.default.Component);

var Result = function (_React$Component5) {
	_inherits(Result, _React$Component5);

	function Result() {
		_classCallCheck(this, Result);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Result).apply(this, arguments));
	}

	_createClass(Result, [{
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{ id: 'result' },
				_react2.default.createElement(
					'h1',
					null,
					'Result'
				),
				_react2.default.createElement('img', { src: this.props.file }),
				_react2.default.createElement(
					'button',
					{ onClick: function onClick() {
							dispatcher.dispatch({ page: 'main' });
						} },
					'Back'
				)
			);
		}
	}]);

	return Result;
}(_react2.default.Component);

_reactDom2.default.render(_react2.default.createElement(App, null), document.getElementById('root'));