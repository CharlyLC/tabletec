
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
			<li><a href="/adm">Administración</a></li>
			<li><a href="/adm/inventarios">Inventarios</a></li>
			<li className="divider"></li>
			<li>
				<a onClick={this.onLogout.bind(this)}>Cerrar sesión</a>
			</li>
		</ul>)
	}
}

class AdminUserMenu extends UserMenu {
	constructor(props) {
        super(props);
	}

	render() {
		return(
		<ul id="navbarUserMenu" className="dropdown-content">
			<li><a href="/">Página principal</a></li>
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
			<li><a href="/">Página principal</a></li>
			<li><Link to="/adm">Administración</Link></li>
			<li className="divider"></li>
			<li>
				<a onClick={this.onLogout.bind(this)}>Cerrar sesión</a>
			</li>
		</ul>)
	}
}

export { HomeUserMenu, AdminUserMenu, InventoryUserMenu }