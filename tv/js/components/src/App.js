'use strict'

import React from 'react'
import ReactDOM from 'react-dom'
import Flux from 'flux'
import cx from 'classnames'
import $ from 'jquery'

let dispatcher = new Flux.Dispatcher();

class App extends React.Component {
	render() {
		let page;

		switch (this.state.page) {
		case 'main':
			page = <Main file={ this.state.file } />;
			break;
		default:
			page = null;
			break;
		}

		return (
			<div id='app'>
				{ page }
			</div>
		)
	}
	state = {
		page: 'main',
		file: null,
	};
	componentDidMount() {
		this.listenerID = dispatcher.register((payload) => {
			switch (payload.type) {
			case 'goto':
				this.setState({ page: payload.page, file: payload.file });
				break;
			}
		});
	}
	componentWillUnmount() {
		dispatcher.unregister(this.listenerID);
	}
}

class Main extends React.Component {
	render() {
		return (
			<div id='main'>
				<img src={ this.props.file } />
			</div>
		)
	}
	componentDidMount() {
		setInterval(this.getResult, 1000);
	}
	getResult() {
		$.ajax({
			url: '/api/result',
			method: 'GET',
		}).done((file) => {
			dispatcher.dispatch({
				type: 'goto',
				page: 'main',
				file: file,
			});
			console.log(file);
		});
	}
}

ReactDOM.render(<App />, document.getElementById('root'));
