
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import React from 'react';
import ReactDOM from'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';

import material from '../vendor/materialize-src/sass/materialize.scss';
import style from './styles/client.scss';

import { Home } from './views/home.jsx';

/****************************************************************************************/

class Main extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (<div>{this.props.children}</div>);
	}
}

/****************************************************************************************/

class App {
	constructor() {
		document.addEventListener("DOMContentLoaded", this.onDOMContentLoaded.bind(this));
	}

	onDOMContentLoaded() {
		this._mainSection = window.document.getElementById('app-main');

		this.render();
	}

	render() {
		ReactDOM.render(
		<BrowserRouter>
			<Main>
				<Route exact={true} path="/" component={Home}/>
			</Main>
		</BrowserRouter>,
		this._mainSection);
	}
}

/****************************************************************************************/

var app = new App();
