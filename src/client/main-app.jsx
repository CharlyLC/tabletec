
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
import { Login } from './views/login.jsx';
import { Admin } from './views/adm.jsx';
import { AdmInventory } from './views/adm-inventory.jsx';
import { AdmInventoryArticles } from './views/adm-inventory-articles.jsx';

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
				<Route exact={true} path="/login" component={Login}/>
				<Route exact={true} path="/adm" component={Admin}/>
				<Route exact={true} path="/adm/inventarios" component={AdmInventory}/>
				<Route path="/adm/inventarios/articulos/:action?/:article?" component={AdmInventoryArticles}/>
			</Main>
		</BrowserRouter>,
		this._mainSection);
	}
}

/****************************************************************************************/

var app = new App();
