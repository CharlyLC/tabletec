
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import React from 'react';
import Reflux from 'reflux';
import { Link } from 'react-router-dom';

import {Navbar} from '../components/navbar.jsx';
import {BrandLogo, BrandIcon} from '../components/brand.jsx';
import { HomeUserMenu } from '../components/user-menu.jsx';
import {Footer} from '../components/footer.jsx';

import { AccountActions, AccountStore } from '../flux/account';

/****************************************************************************************/

class Home extends Reflux.Component {
	constructor(props) {
		super(props);

		this.state = {
			signed: false
		}

		this.stores = [AccountStore];
	}

	componentWillMount() {
		super.componentWillMount();
		AccountActions.authenticate((err, res)=>{
			this.setState({signed: true});
		});
	}

	render() {
		return (
		<div className="rs-body">
			<header>
				<Navbar brandIconComponent={BrandIcon} brandLogoComponent={BrandLogo}
					user={this.state.user} signin={this.state.signed} userMenuComponent={HomeUserMenu}/>
			</header>
			<main>
				<div className="center-align">
					<img src="/images/tabletec-banner.png" alt="" className="responsive-img"/>
				</div>
			</main>
			<Footer/>
		</div>);
	}
}

export { Home }