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
			rawOutput: null,
			outputs: []
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
				case 'capturing':
					page = _react2.default.createElement(Capturing, null);
					break;
				case 'raw-output':
					page = _react2.default.createElement(RawOutput, { rawOutput: this.state.rawOutput });
					break;
				case 'post-processing':
					page = _react2.default.createElement(PostProcessing, null);
					break;
				case 'output':
					page = _react2.default.createElement(Output, { outputs: this.state.outputs });
					break;
				default:
					page = null;
					break;
			}

			return _react2.default.createElement(
				'div',
				{ id: 'app', className: 'flex one' },
				page
			);
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this2 = this;

			this.listenerID = dispatcher.register(function (payload) {
				switch (payload.page) {
					case 'goto':
						if (payload.page == 'raw-output') {
							_this2.setState({ page: payload.page, rawOutput: payload.rawOutput });
						} else if (payload.page == 'output') {
							_this2.setState({ page: payload.page, outputs: payload.outputs });
						} else {
							_this2.setState({ page: payload.page });
						}
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
				{ id: 'main', className: 'flex column one align-center justify-center' },
				_react2.default.createElement('img', { src: 'images/vaseline_logo.png' }),
				_react2.default.createElement(
					'h1',
					{ className: 'main-title' },
					'VASELINE HEALTHY WHITE'
				),
				_react2.default.createElement(
					'button',
					{ className: 'take-photo-button flex align-center justify-center', onClick: function onClick() {
							dispatcher.dispatch({ type: 'goto', page: 'capturing' });
						} },
					_react2.default.createElement('img', { className: 'take-photo-icon', src: 'images/icon_camera.png' }),
					_react2.default.createElement(
						'span',
						{ className: 'take-photo-text' },
						'TAKE PHOTO'
					)
				)
			);
		}
	}]);

	return Main;
}(_react2.default.Component);

var Capturing = function (_React$Component3) {
	_inherits(Capturing, _React$Component3);

	function Capturing() {
		_classCallCheck(this, Capturing);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Capturing).apply(this, arguments));
	}

	_createClass(Capturing, [{
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{ id: 'capturing', className: 'flex column one' },
				_react2.default.createElement(
					'div',
					null,
					_react2.default.createElement('img', { className: 'logo-small', src: 'images/vaseline_logo_s.png' })
				),
				_react2.default.createElement(
					'div',
					{ className: 'flex column one align-center justify-center' },
					_react2.default.createElement(Spinner, null),
					_react2.default.createElement(
						'h1',
						{ className: 'capturing-text' },
						'Your image is being captured..'
					)
				)
			);
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			_jquery2.default.ajax({
				url: '/api/capture',
				method: 'POST'
			}).done(function (rawOutput) {
				dispatcher.dispatch({ type: 'goto', page: 'raw-output', rawOutput: rawOutput });
			}).fail(function (response) {
				alert('Failed to capture the photo!');
				dispatcher.dispatch({ type: 'goto', page: 'main' });
			});
		}
	}]);

	return Capturing;
}(_react2.default.Component);

var RawOutput = function (_React$Component4) {
	_inherits(RawOutput, _React$Component4);

	function RawOutput() {
		_classCallCheck(this, RawOutput);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(RawOutput).apply(this, arguments));
	}

	_createClass(RawOutput, [{
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{ id: 'raw-output', className: 'flex one column align-center justify-center' },
				_react2.default.createElement(
					'h1',
					null,
					'Here is your image in UV light'
				),
				_react2.default.createElement('img', { className: 'raw-output-image', src: 'tv/' + this.props.rawOutput }),
				_react2.default.createElement(
					'div',
					{ className: 'flex' },
					_react2.default.createElement(
						'button',
						{ className: 'back-button flex align-center justify-center', onClick: function onClick() {
								dispatcher.dispatch({ type: 'goto', page: 'main' });
							} },
						'Back'
					),
					_react2.default.createElement(
						'button',
						{ className: 'next-button flex align-center justify-center', onClick: function onClick() {
								dispatcher.dispatch({ type: 'goto', page: 'post-processing' });
							} },
						'Next'
					)
				)
			);
		}
	}]);

	return RawOutput;
}(_react2.default.Component);

var PostProcessing = function (_React$Component5) {
	_inherits(PostProcessing, _React$Component5);

	function PostProcessing() {
		_classCallCheck(this, PostProcessing);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(PostProcessing).apply(this, arguments));
	}

	_createClass(PostProcessing, [{
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{ id: 'post-processing', className: 'flex column one' },
				_react2.default.createElement(
					'div',
					null,
					_react2.default.createElement('img', { className: 'logo-small', src: 'images/vaseline_logo_s.png' })
				),
				_react2.default.createElement(
					'div',
					{ className: 'flex column one align-center justify-center' },
					_react2.default.createElement(Spinner, null),
					_react2.default.createElement(
						'h1',
						{ className: 'post-processing-text' },
						'Your image is being processed..'
					)
				)
			);
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			_jquery2.default.ajax({
				url: '/api/post_process',
				method: 'POST',
				dataType: 'json'
			}).done(function (outputs) {
				dispatcher.dispatch({ type: 'goto', page: 'output', outputs: outputs });
			}).fail(function (response) {
				alert('Failed to capture the photo!');
				dispatcher.dispatch({ type: 'goto', page: 'main' });
			});
		}
	}]);

	return PostProcessing;
}(_react2.default.Component);

var Output = function (_React$Component6) {
	_inherits(Output, _React$Component6);

	function Output() {
		var _Object$getPrototypeO2;

		var _temp2, _this7, _ret2;

		_classCallCheck(this, Output);

		for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
			args[_key2] = arguments[_key2];
		}

		return _ret2 = (_temp2 = (_this7 = _possibleConstructorReturn(this, (_Object$getPrototypeO2 = Object.getPrototypeOf(Output)).call.apply(_Object$getPrototypeO2, [this].concat(args))), _this7), _this7.state = {
			chosenOutput: -1
		}, _this7.finalize = function () {
			var outputs = _this7.props.outputs;
			var chosenOutput = _this7.state.chosenOutput;

			if (chosenOutput >= 0) {
				_jquery2.default.ajax({
					url: '/api/finalize',
					method: 'POST',
					data: { output: outputs[chosenOutput] }
				}).done(function () {
					dispatcher.dispatch({ type: 'goto', page: 'main' });
				}).fail(function (response) {
					alert('Failed to finalize photo!');
					dispatcher.dispatch({ type: 'goto', page: 'main' });
				});
			} else {
				alert('You must choose an output!');
			}
		}, _this7.choose = function (i) {
			_this7.setState({ chosenOutput: i });
		}, _temp2), _possibleConstructorReturn(_this7, _ret2);
	}

	_createClass(Output, [{
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{ id: 'output', className: 'flex one column align-center justify-center' },
				_react2.default.createElement(
					'h1',
					null,
					'Here\'s your post-processed images'
				),
				_react2.default.createElement(
					'div',
					{ className: 'flex one align-center justify-center' },
					_react2.default.createElement('img', { className: 'output-image', onClick: this.choose.bind(this, 0), src: 'tv/' + this.props.outputs[0] }),
					_react2.default.createElement('img', { className: 'output-image', onClick: this.choose.bind(this, 1), src: 'tv/' + this.props.outputs[1] }),
					_react2.default.createElement('img', { className: 'output-image', onClick: this.choose.bind(this, 2), src: 'tv/' + this.props.outputs[2] })
				),
				_react2.default.createElement(
					'button',
					{ className: 'back-button flex align-center justify-center', onClick: this.finalize },
					'Finalize'
				)
			);
		}
	}]);

	return Output;
}(_react2.default.Component);

var Spinner = function (_React$Component7) {
	_inherits(Spinner, _React$Component7);

	function Spinner() {
		_classCallCheck(this, Spinner);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Spinner).apply(this, arguments));
	}

	_createClass(Spinner, [{
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement('div', { className: 'cssload-thing' }),
				_react2.default.createElement('div', { className: 'cssload-thing' }),
				_react2.default.createElement('div', { className: 'cssload-thing' }),
				_react2.default.createElement('div', { className: 'cssload-thing' }),
				_react2.default.createElement('div', { className: 'cssload-thing' }),
				_react2.default.createElement('div', { className: 'cssload-thing' }),
				_react2.default.createElement('div', { className: 'cssload-thing' }),
				_react2.default.createElement('div', { className: 'cssload-thing' }),
				_react2.default.createElement('div', { className: 'cssload-thing' }),
				_react2.default.createElement('div', { className: 'cssload-thing' }),
				_react2.default.createElement('div', { className: 'cssload-thing' }),
				_react2.default.createElement('div', { className: 'cssload-thing' }),
				_react2.default.createElement('div', { style: { clear: 'both' } })
			);
		}
	}]);

	return Spinner;
}(_react2.default.Component);

_reactDom2.default.render(_react2.default.createElement(App, null), document.getElementById('root'));