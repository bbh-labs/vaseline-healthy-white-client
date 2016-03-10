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
		case 'capturing':
			page = <Capturing />;
			break;
		case 'raw-output':
			page = <RawOutput rawOutput={ this.state.rawOutput } />;
			break;
		case 'post-processing':
			page = <PostProcessing />;
			break;
		case 'output':
			page = <Output outputs={ this.state.outputs } />;
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
		rawOutput: null,
		outputs: [],
	};
	componentDidMount() {
		this.listenerID = dispatcher.register((payload) => {
			switch (payload.page) {
			case 'goto':
				if (payload.page == 'raw-output') {
					this.setState({ page: payload.page, rawOutput: payload.rawOutput });
				} else if (payload.page == 'output') {
					this.setState({ page: payload.page, outputs: payload.outputs });
				} else {
					this.setState({ page: payload.page });
				}
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
				<button className='take-photo-button flex align-center justify-center' onClick={ () => { dispatcher.dispatch({ type: 'goto', page: 'capturing' }) } }>
					<img className='take-photo-icon' src='images/icon_camera.png' />
					<span className='take-photo-text'>TAKE PHOTO</span>
				</button>
			</div>
		)
	}
}

class Capturing extends React.Component {
	render() {
		return (
			<div id='capturing' className='flex column one'>
				<div>
					<img className='logo-small' src='images/vaseline_logo_s.png' />
				</div>
				<div className='flex column one align-center justify-center'>
					<Spinner />
					<h1 className='capturing-text'>Your image is being captured..</h1>
				</div>
			</div>
		)
	}
	componentDidMount() {
		$.ajax({
			url: '/api/capture',
			method: 'POST',
		}).done((rawOutput) => {
			dispatcher.dispatch({ type: 'goto', page: 'raw-output', rawOutput: rawOutput });
		}).fail((response) => {
			alert('Failed to capture the photo!');
			dispatcher.dispatch({ type: 'goto', page: 'main' });
		});
	}
}

class RawOutput extends React.Component {
	render() {
		return (
			<div id='raw-output' className='flex one column align-center justify-center'>
				<h1>Here is your image in UV light</h1>
				<img className='raw-output-image' src={ 'tv/' + this.props.rawOutput } />
				<div className='flex'>
					<button className='back-button flex align-center justify-center' onClick={ () => { dispatcher.dispatch({ type: 'goto', page: 'main' }); } }>Back</button>
					<button className='next-button flex align-center justify-center' onClick={ () => { dispatcher.dispatch({ type: 'goto', page: 'post-processing' }); } }>Next</button>
				</div>
			</div>
		)
	}
}

class PostProcessing extends React.Component {
	render() {
		return (
			<div id='post-processing' className='flex column one'>
				<div>
					<img className='logo-small' src='images/vaseline_logo_s.png' />
				</div>
				<div className='flex column one align-center justify-center'>
					<Spinner />
					<h1 className='post-processing-text'>Your image is being processed..</h1>
				</div>
			</div>
		)
	}
	componentDidMount() {
		$.ajax({
			url: '/api/post_process',
			method: 'POST',
			dataType: 'json',
		}).done((outputs) => {
			dispatcher.dispatch({ type: 'goto', page: 'output', outputs: outputs });
		}).fail((response) => {
			alert('Failed to capture the photo!');
			dispatcher.dispatch({ type: 'goto', page: 'main' });
		});
	}
}

class Output extends React.Component {
	render() {
		return (
			<div id='output' className='flex one column align-center justify-center'>
				<h1>Here's your post-processed images</h1>
				<div className='flex one align-center justify-center'>
					<img className='output-image' onClick={ this.choose.bind(this, 0) }src={ 'tv/' + this.props.outputs[0] } />
					<img className='output-image' onClick={ this.choose.bind(this, 1) }src={ 'tv/' + this.props.outputs[1] } />
					<img className='output-image' onClick={ this.choose.bind(this, 2) }src={ 'tv/' + this.props.outputs[2] } />
				</div>
				<button className='back-button flex align-center justify-center' onClick={ this.finalize }>Finalize</button>
			</div>
		)
	}
	state = {
		chosenOutput: -1,
	};
	finalize = () => {
		let outputs = this.props.outputs;
		let chosenOutput = this.state.chosenOutput;

		if (chosenOutput >= 0) {
			$.ajax({
				url: '/api/finalize',
				method: 'POST',
				data: { output: outputs[chosenOutput] } ,
			}).done(() => {
				dispatcher.dispatch({ type: 'goto', page: 'main' });
			}).fail((response) => {
				alert('Failed to finalize photo!');
				dispatcher.dispatch({ type: 'goto', page: 'main' });
			});
		} else {
			alert('You must choose an output!');
		}
	};
	choose = (i) => {
		this.setState({ chosenOutput: i });
	};
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
