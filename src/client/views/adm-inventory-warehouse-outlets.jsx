
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import React from 'react';
import Reflux from 'reflux';

import {Navbar} from '../components/navbar.jsx';
import {BrandLogo, BrandIcon} from '../components/brand.jsx';
import Sidenav from '../components/sidenav.jsx';
import { InventoryUserMenu } from '../components/user-menu.jsx';

import Alert from '../components/alert.jsx';
import { Button } from '../components/button.jsx';
import Progress from'../components/progress.jsx';
import SectionCard from '../components/section-card.jsx';
import SectionView from '../components/section-view.jsx';
import { Switch, Case } from '../components/switch.jsx';
import Table from '../components/table.jsx';

import { AccountActions, AccountStore } from '../flux/account';
import { InventoryActions, InventoryStore } from '../flux/inventory';
import { WarehouseOutletsActions, WarehouseOutletsStore } from '../flux/warehouse-outlets';

/****************************************************************************************/

class WarehouseOutletsWelcome extends React.Component {
	constructor(props) {
		super(props);

		this.state = {}
	}

	render() {
		return(
		<SectionCard title="Bienvenido" iconName="library_books">
			<div style={{padding: '0rem 0.5rem 1rem 0.5rem'}}>
				<Alert type="info" text="Bienvenido a la página administracion de salidas de almacenes."/>
			</div>
		</SectionCard>);
	}
}

class WarehouseOutletsList extends Reflux.Component {
	constructor(props) {
		super(props);

		this.state = {};

		this.store = WarehouseOutletsStore;

		this.dropdowOptions = [
			{
				text:'Registrar nueva salida',
				select: this.onDropdowOptionInsert.bind(this)
			},
			{
				text: 'Actualizar',
				select: this.onDropdowOptionUpdate.bind(this)
			}
		];
	}

	componentWillMount() {
		super.componentWillMount();
		WarehouseOutletsActions.findAll();
	}

	onSelectItem(item) {
		this.props.history.push(this.props.url + '/ver/' + item.code);
	}

	onDropdowOptionInsert() {
		this.props.history.push(this.props.url + '/insertar/' + Randomstring.generate());
	}

	onDropdowOptionUpdate() {
		WarehouseOutletsActions.findAll();
	}

	render() {
		return(
		<SectionCard title="Lista de salidas" iconName="view_list" menuID="warehouseOutletsList" menuItems={this.dropdowOptions}>

			<div style={{padding: '0rem 1rem'}}>
				<span>
					Lista de todas las salidas registradas en los almacenes.
				</span>
			</div>

			<div style={{padding: '0rem 0.5rem 1rem 0.5rem'}}>
				<Switch match={this.state.listStatus}>
					<Case path="loading" className="center">
						<div className="row">
							<Progress type="indeterminate"/>
						</div>
					</Case>
					<Case path="ready">
						<Table columns={this.state.list.columns} rows={this.state.list.rows} filterBy="description"
							onSelectRow={this.onSelectItem.bind(this)}/>
					</Case>
					<Case path="error">
						<Alert type="error" text="ERROR: No se pudo cargar la lista de salidas de almacenes"/>
					</Case>
				</Switch>
			</div>
		</SectionCard>)
	}
}

/****************************************************************************************/

class AdmInventoryWarehouseOutlets extends Reflux.Component {
	constructor(props) {
        super(props);

		this.state = {
			signed: false
		}

		this.stores = [AccountStore, InventoryStore];
	}

	componentWillMount() {
		super.componentWillMount();

		this.url = '/adm/inventarios/almacenes-salidas';

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
		let action = this.props.match.params.action ? this.props.match.params.action : 'welcome';
		return (
		<div>
			<header>
				<Sidenav user={this.state.user} items={this.state.sideMenuItems}/>
				<Navbar brandIconComponent={BrandIcon} brandLogoComponent={BrandLogo}
					useSideMenu={true}
					user={this.state.user} signin={this.state.signed} userMenuComponent={InventoryUserMenu}/>
			</header>
			<main>
				{
					this.state.user ?
					<div className="row no-margin" style={{backgroundColor: '#eeeeee'}}>
						<SectionView className="col s12 m6 l5"  >
							<Switch match={action}>
								<WarehouseOutletsWelcome path="welcome"/>
							</Switch>
						</SectionView>
						<SectionView className="col s12 m6 l7">
							<WarehouseOutletsList url={this.url} history={this.props.history}/>
						</SectionView>
					</div> : null
				}
			</main>
		</div>);
	}
}

export {AdmInventoryWarehouseOutlets}