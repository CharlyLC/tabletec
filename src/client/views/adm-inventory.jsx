
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import React from 'react';
import Reflux from 'reflux';

import InfoCard from '../components/info-card.jsx';
import {Navbar} from '../components/navbar.jsx';
import {BrandLogo, BrandIcon} from '../components/brand.jsx';
import Sidenav from '../components/sidenav.jsx';
import { InventoryUserMenu } from '../components/user-menu.jsx';
import {Footer} from '../components/footer.jsx';
import Progress from'../components/progress.jsx';

import { AccountActions, AccountStore } from '../flux/account';
import { InventoryActions, InventoryStore } from '../flux/inventory';

/****************************************************************************************/

class AdmInventory extends Reflux.Component {
	constructor(props) {
        super(props);

		this.state = {
			infoStatus: 'loading',
			warehouses: [],
			signed: false
		}

		this.stores = [AccountStore, InventoryStore];
	}

	componentWillMount() {
		super.componentWillMount();
		AccountActions.authenticate((err, res)=>{
			if(err){
				window.location.replace('/login');
			}else{
				InventoryActions.loadSideMenuItems();
				this.setState({signed: true});
				InventoryActions.loadWarehouses((err, res)=>{
					if(err){
						this.setState({infoStatus: 'error'});
					}else{
						this.setState({warehouses: res.warehouses.rows, infoStatus: 'done'});
					}
				});
			}
		});
	}

	onInfoCardRequireArticles(warehouse, callback) {
		InventoryActions.loadWarehouseArticles(warehouse.code, callback);
	}

	renderInfo() {
		switch(this.state.infoStatus) {
		case 'done':
			return this.state.warehouses.map((row, i)=>{
				return <InfoCard key={i} iconName="assessment" data={row}
					onRequireArticles={this.onInfoCardRequireArticles.bind(this)}/>
			});
		case 'loading':
			return (
			<div className="row">
				<Progress type="indeterminate"/>
			</div>);
		}
	}

	render() {
		return (
		<div className="rs-body">
			<header>
				<Sidenav user={this.state.user} items={this.state.sideMenuItems}/>
				<Navbar brandIconComponent={BrandIcon} brandLogoComponent={BrandLogo}
					useSideMenu={true}
					user={this.state.user} signin={this.state.signed} userMenuComponent={InventoryUserMenu}/>
			</header>
			<main>
				{
					this.state.user ?
					<div>
						<div className="row">
							<h5 className="center-align" style={{ textShadow:' 1px 1px 1px #999'}}><b>Inventarios</b></h5>
						</div>
						<div className="row">
							{this.renderInfo()}
						</div>
					</div>: null
				}
			</main>
			<Footer/>
		</div>);
	}
}

export {AdmInventory}