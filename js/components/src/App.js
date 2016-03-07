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
			page = <Main />;
			break;
		case 'capture':
			page = <Capture />;
			break;
		case 'post-process':
			page = <PostProcess />;
			break;
		case 'result':
			page = <Result file={ payload.file } />;
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
	};
	componentDidMount() {
		this.listenerID = dispatcher.register((payload) => {
			switch (payload.page) {
			case 'main':
			case 'capture':
			case 'post-process':
			case 'result':
				this.setState({ page: payload.page });
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
				<button onClick={ () => { dispatcher.dispatch({ page: 'capture' }) } }>
					Capture
				</button>
			</div>
		)
	}
}

class Capture extends React.Component {
	render() {
		return (
			<div id='capture'>
				<h1>Capturing photo..</h1>
			</div>
		)
	}
	componentDidMount() {
		$.ajax({
			url: '/api/capture',
			method: 'POST',
		}).done((response) => {
			console.log('captured');
			dispatcher.dispatch({ page: 'post-process' });
		}).fail((response) => {
			alert('Failed to capture the photo!');
			dispatcher.dispatch({ page: 'main' });
		});
	}
}

class PostProcess extends React.Component {
	render() {
		return (
			<div id='post-process'>
				<h1>Post Processing..</h1>
			</div>
		)
	}
	componentDidMount() {
		$.ajax({
			url: '/api/post_process',
			method: 'POST',
		}).done((file) => {
			dispatcher.dispatch({ page: 'result', file: file });
		}).fail((response) => {
			alert('Failed to post process the photo!');
			dispatcher.dispatch({ page: 'main' });
		});
	}
}

class Result extends React.Component {
	render() {
		return (
			<div id='result'>
				<h1>Result</h1>
				<img src={ this.props.file } />
			</div>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('root'));
