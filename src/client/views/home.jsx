
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import React from 'react';
import Reflux from 'reflux';

import {Navbar} from '../components/navbar.jsx';
import {BrandLogo, BrandIcon} from '../components/brand.jsx';

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
		<div>
			<header>
				<Navbar user={this.state.user} signin={this.state.signed} brandIconComponent={BrandIcon} brandLogoComponent={BrandLogo}/>
			</header>
			<main>
				<div className="center-align">
					<img src="/images/tabletec-banner.png" alt="" className="responsive-img"/>
				</div>
			</main>
		</div>);
	}
}

export { Home }