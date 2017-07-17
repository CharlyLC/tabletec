
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import React from 'react';
import { Link } from 'react-router-dom';

import { AccountActions } from '../flux/account';

/****************************************************************************************/

class UserMenu extends React.Component {
	constructor(props) {
        super(props);
	}

	onLogout() {
		AccountActions.logout(()=>{
			window.location.replace('/login');
		});
	}
}

class HomeUserMenu extends UserMenu {
	constructor(props) {
        super(props);
	}

	render() {
		return(
		<ul id="navbarUserMenu" className="dropdown-content">
			<li><Link to="/adm">Administración</Link></li>
			<li><Link to="/adm/inventarios">Inventarios</Link></li>
			<li className="divider"></li>
			<li>
				<a onClick={this.onLogout.bind(this)}>Cerrar sesión</a>
			</li>
		</ul>)
	}
}

class InventoryUserMenu extends UserMenu {
	constructor(props) {
        super(props);
	}

	render() {
		return(
		<ul id="navbarUserMenu" className="dropdown-content">
			<li><Link to="/">Página principal</Link></li>
			<li><Link to="/adm">Administración</Link></li>
			<li className="divider"></li>
			<li>
				<a onClick={this.onLogout.bind(this)}>Cerrar sesión</a>
			</li>
		</ul>)
	}
}

export { HomeUserMenu, InventoryUserMenu }