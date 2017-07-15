
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import React from 'react';
import Reflux from 'reflux';
import { Link } from 'react-router-dom';

import {Navbar} from '../components/navbar.jsx';
import {BrandLogo, BrandIcon} from '../components/brand.jsx';
import Sidenav from '../components/sidenav.jsx';

import { AccountActions, AccountStore } from '../flux/account';
import { InventoryActions, InventoryStore } from '../flux/inventory';

/****************************************************************************************/

class InfoCard extends React.Component {
	constructor(props) {
        super(props);
	}

	render() {
		return(
		<div className="col s12 m3 l3">
			<a className="card horizontal hoverable" style={{borderRadius:'10px 10px 10px 10px'}}>
				<div className={'card-image white-text valign-wrapper center-align ' + this.props.themeColor}
					style={{width:'30%', borderRadius:'10px 0px 0px 10px'}}>
					<i className="medium material-icons   valing center " style={{width:'100%'}}>{this.props.iconName}</i>
				</div>
				<div className="card-stacked">
					<div className="card-content" style={{padding:'0.5rem 0rem 0.5rem 2rem'}}>
						<span style={{color:'black'}}><b>{this.props.text1}</b></span>
						<h3 style={{color:'black' , margin: '0rem'}}><b>{this.props.text2}</b></h3>
						<p style={{color:'black'}}>{this.props.text3}</p>
					</div>
				</div>
			</a>
		</div>
		)
	}
}

class InventoryUserMenu extends React.Component {
	constructor(props) {
        super(props);
	}

	onLogout() {
		
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

/****************************************************************************************/
class Inventory extends Reflux.Component {
	constructor(props) {
        super(props);

		this.state = {
			signed: false
		}

		this.stores = [AccountStore, InventoryStore];
	}

	componentWillMount() {
		super.componentWillMount();
		AccountActions.authenticate((err, res)=>{
			if(err){
				this.props.history.push('/login');
			}else{
				InventoryActions.loadSideMenuItems();
				this.setState({signed: true});
			}
		});
	}

	render() {
		return this.state.user ? (
		<div>
			<header>
				<Sidenav user={this.state.user} items={this.state.sideMenuItems}/>
				<Navbar brandIconComponent={BrandIcon} brandLogoComponent={BrandLogo}
					useSideMenu={true}
					user={this.state.user} signin={this.state.signed} userMenuComponent={InventoryUserMenu}/>
			</header>
			<main>
				<div className="row">
					<h5 className="center-align" style={{ textShadow:' 1px 1px 1px #999'}}><b>Inventarios</b></h5>
				</div>
				<div className="row">
					<InfoCard iconName="assessment" text1="titulo" text2="500" text3="xx" themeColor={'grey darken-1'}/>
					<InfoCard iconName="assessment" text1="titulo" text2="200" text3="xx" themeColor={'grey darken-1'}/>
					<InfoCard iconName="assessment" text1="titulo" text2="50" text3="xx" themeColor={'grey darken-1'}/>
					<InfoCard iconName="assessment" text1="titulo" text2="1000" text3="xx" themeColor={'grey darken-1'}/>
				</div>
			</main>
		</div>) : null;
	}
}

export {Inventory}