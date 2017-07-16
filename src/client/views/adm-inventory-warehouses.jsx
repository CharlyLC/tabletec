
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
import { Collapsible, CollapsibleCard } from '../components/collapsible.jsx';
import ItemProperty from '../components/item-property.jsx';
import Progress from'../components/progress.jsx';
import SectionCard from '../components/section-card.jsx';
import SectionView from '../components/section-view.jsx';
import { Switch, Case } from '../components/switch.jsx';
import Table from '../components/table.jsx';

import { AccountActions, AccountStore } from '../flux/account';
import { InventoryActions, InventoryStore } from '../flux/inventory';
import { WarehousesActions, WarehousesStore } from '../flux/warehouses';

import Tools from '../tools';

/****************************************************************************************/

class WarehousesWelcome extends React.Component {
	constructor(props) {
		super(props);

		this.state = {}
	}

	render() {
		return(
		<SectionCard title="Bienvenido" iconName="library_books">
			<div style={{padding: '0rem 0.5rem 1rem 0.5rem'}}>
				<Alert type="info" text="Bienvenido a la página de administración de almacenes."/>
			</div>
		</SectionCard>);
	}
}

class WarehousesList extends Reflux.Component {
	constructor(props) {
		super(props);

		this.state = {}

		this.store = WarehousesStore;
		this.storeKeys = ['list', 'listStatus'];

		this.dropdowOptions = [
			{
				text:'Insertar nuevo almacén',
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
		WarehousesActions.findAll();
	}

	onSelectItem(item) {
		this.props.history.push(this.props.url + '/ver/' + item.code);
	}

	onDropdowOptionInsert() {
		this.props.history.push(this.props.url + '/insertar/' + Tools.makeid(32));
	}

	onDropdowOptionUpdate() {
		WarehousesActions.findAll();
	}

	render() {
		return(
		<SectionCard title="Lista de almacenes" iconName="view_list" menuID="warehousesList" menuItems={this.dropdowOptions}>

			<div style={{padding: '0rem 1rem'}}>
				<span>
					Lista de todos los almacenes registrados en la base de datos.
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
						<Table columns={this.state.list.columns} rows={this.state.list.rows} filterBy="name"
							onSelectRow={this.onSelectItem.bind(this)}/>
					</Case>
					<Case path="error">
						<Alert type="error" text="ERROR: No se pudo cargar la lista de almacenes"/>
					</Case>
				</Switch>
			</div>
		</SectionCard>)
	}
}

class WarehousesViewer extends Reflux.Component {
	constructor(props) {
		super(props);

		this.state = {}

		this.store = WarehousesStore;
		this.storeKeys = ['selectedItem', 'viewerStatus'];

		this.dropdowOptions = [
			{
				text: 'Reporte de existencias',
				select: this.onDropdowOptionReport1.bind(this)
			}
		];
	}

	componentWillMount() {
		super.componentWillMount();

		if(this.props.warehouseCode){
			WarehousesActions.findOne(this.props.warehouseCode);
		}
	}

	componentWillReceiveProps(nextProps) {
		if(this.props.warehouseCode !== nextProps.warehouseCode){
			if(nextProps.warehouseCode){
				WarehousesActions.findOne(nextProps.warehouseCode);
			}
		}
	}

	onDropdowOptionReport1() {
		WarehousesActions.getStockReport(this.props.warehouseCode, (err, res)=>{
			if(err){

			}else{
				window.open('data:application/pdf;base64,'+res.pdf);
			}
		});		
	}

	render(){
		var item = this.state.selectedItem;
		switch(this.state.viewerStatus){
		case 'ready':
			return item ? (
			<SectionCard title="Datos de almacen" iconName="store" menuID="warehousesViewer" menuItems={this.dropdowOptions}>
				
				<h6 style={{fontWeight: 'bold', padding: '1rem'}}>{item.name}</h6>

				<Collapsible defaultActiveIndex={0}>
					<CollapsibleCard title="Datos del almacen" iconName="info_outline">
						<div className="row" style={{marginBottom: '0.5rem'}}>
							<ItemProperty name="Sucursal" value={'Matríz'} className="col s6"/>
							<ItemProperty name="Código" value={item.clientCode} className="col s6"/>
						</div>

						<div className="row" style={{marginBottom: '0.5rem'}}>
							<ItemProperty name="Tipo" value={item.type} className="col s12"/>
						</div>
						<div className="row" style={{marginBottom: '0.5rem'}}>
							<ItemProperty name="Nombre" value={item.name} className="col s12"/>
						</div>

						<div className="row" style={{marginBottom: '0.5rem'}}>
							<ItemProperty name="País" value={item.country} className="col s6"/>
							<ItemProperty name="Ciudad" value={item.city} className="col s6"/>
						</div>
						<div className="row" style={{marginBottom: '0.5rem'}}>
							<ItemProperty name="Direccion" value={item.address} className="col s12"/>
						</div>

						<div className="row" style={{marginBottom: '0.5rem'}}>
							<ItemProperty name="Telefono" value={item.phone} className="col s6"/>
							<ItemProperty name="Código postal" value={item.postcode} className="col s6"/>
						</div>
					</CollapsibleCard>
				</Collapsible>
			</SectionCard>) : (
			<SectionCard title="Datos de almacen" iconName="store">
				<div style={{padding: '0rem 0.5rem 1rem 0.5rem'}}>
					<Alert type="info" text="Seleccione una elemento de la lista de almacenes."/>
				</div>
			</SectionCard>);

		case 'loading':
			return (
			<SectionCard title="Cargando datos de almacen..." iconName="store">
				<div className="row">
					<Progress type="indeterminate"/>
				</div>
			</SectionCard>);

		case 'error':
			return (
			<SectionCard title="Datos de almacen" iconName="store">
				<Alert type="error" text="ERROR: No se pudo cargar los datos del almacen"/>
			</SectionCard>);
		}
	}
}

/****************************************************************************************/

class AdmInventoryWarehouses extends Reflux.Component {
	constructor(props) {
        super(props);

		this.state = {
			signed: false
		}

		this.stores = [AccountStore, InventoryStore];
	}

	componentWillMount() {
		super.componentWillMount();

		this.url = '/adm/inventarios/almacenes';

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
		return this.state.user ? (
		<div>
			<header>
				<Sidenav user={this.state.user} items={this.state.sideMenuItems}/>
				<Navbar brandIconComponent={BrandIcon} brandLogoComponent={BrandLogo}
					useSideMenu={true}
					user={this.state.user} signin={this.state.signed} userMenuComponent={InventoryUserMenu}/>
			</header>
			<main>
				<div className="row no-margin" style={{backgroundColor: '#eeeeee'}}>
					<SectionView className="col s12 m6 l5"  >
						<Switch match={action}>
							<WarehousesWelcome path="welcome"/>
							<WarehousesViewer path="ver" url={this.url} history={this.props.history}
								warehouseCode={this.props.match.params.warehouse}/>
						</Switch>
					</SectionView>
					<SectionView className="col s12 m6 l7">
						<WarehousesList url={this.url} history={this.props.history}/>
					</SectionView>
				</div>
			</main>
		</div>) : null;
	}
}

export {AdmInventoryWarehouses}