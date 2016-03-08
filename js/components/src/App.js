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
		case 'processing':
			page = <Processing />;
			break;
		case 'result':
			page = <Result file={ this.state.file } />;
			break;
		default:
			page = null;
			break;
		}

		return (
			<div id='app' className='flex one'>
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
			switch (payload.page) {
			case 'main':
			case 'processing':
				this.setState({ page: payload.page });
				break;
			case 'result':
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
			<div id='main' className='flex column one align-center justify-center'>
				<img src='images/vaseline_logo.png' />
				<h1 className='main-title'>VASELINE HEALTHY WHITE</h1>
				<button className='take-photo-button flex align-center justify-center' onClick={ () => { dispatcher.dispatch({ page: 'processing' }) } }>
					<img className='take-photo-icon' src='images/icon_camera.png' />
					<span className='take-photo-text'>TAKE PHOTO</span>
				</button>
			</div>
		)
	}
}

class Processing extends React.Component {
	render() {
		return (
			<div id='processing' className='flex column one'>
				<div>
					<img className='logo-small' src='images/vaseline_logo_s.png' />
				</div>
				<div className='flex column one align-center justify-center'>
					<Spinner />
					<h1 className='processing-text'>Your image is being processed..</h1>
				</div>
			</div>
		)
	}
	componentDidMount() {
		$.ajax({
			url: '/api/capture',
			method: 'POST',
		}).done((file) => {
			dispatcher.dispatch({ page: 'result', file: 'tv/' + file });
		}).fail((response) => {
			alert('Failed to capture the photo!');
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
				<button onClick={ () => { dispatcher.dispatch({ page: 'main' }); } }>Back</button>
			</div>
		)
	}
}

class Spinner extends React.Component {
	render() {
		return (
			<div>
				<div className='cssload-thing'></div>
				<div className='cssload-thing'></div>
				<div className='cssload-thing'></div>
				<div className='cssload-thing'></div>
				<div className='cssload-thing'></div>
				<div className='cssload-thing'></div>
				<div className='cssload-thing'></div>
				<div className='cssload-thing'></div>
				<div className='cssload-thing'></div>
				<div className='cssload-thing'></div>
				<div className='cssload-thing'></div>
				<div className='cssload-thing'></div>
				<div style={ { clear: 'both' } } />
			</div>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('root'));
