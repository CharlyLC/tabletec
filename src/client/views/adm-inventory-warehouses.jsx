
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
import {Footer} from '../components/footer.jsx';

import Alert from '../components/alert.jsx';
import { Collapsible, CollapsibleCard } from '../components/collapsible.jsx';
import Form from '../components/form.jsx';
import Input from '../components/input.jsx';
import ItemProperty from '../components/item-property.jsx';
import MessageModal from '../components/message-modal.jsx';
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

class WarehousesInsert extends Reflux.Component {
	constructor(props) {
		super(props);

		this.state = {
			cities: [],
			countries: [{name: 'Bolivia'}]
		}

		this.stores = [WarehousesStore];

		this._formValidationRules = {
		}
	}

	componentWillMount() {
		super.componentWillMount();

		WarehousesActions.findAllCities((err, res)=>{
			if(err){} else if(res){ this.setState({cities: res.cities}); }
		});
	}

	componentDidMount() {
		Materialize.updateTextFields();
	}

	onFormSubmit(form) {
		var data = {
			clientCode: this.refs.warehouseCode.value(),
			name: this.refs.warehouseName.value(),
			type: this.refs.warehouseType.value(),
			country: this.refs.warehouseCountry.value(),
			city: this.refs.warehouseCity.value(),
			address: this.refs.warehouseAddress.value(),
			phone: this.refs.warehousePhone.value(),
			postcode: this.refs.warehousePostcode.value(),
		}

		this.refs.messageModal.show('sending');
		WarehousesActions.insertOne(data, (err, res)=>{
			if(err){
				this.refs.messageModal.show('save_error', 'Error: ' + err.status + ' <' + err.response.message + '>');
			}else{
				this.refs.messageModal.show('success_save');
			}
		});
	}

	render() {
		return(
		<SectionCard title="Insertar nuevo almacén" iconName="library_books">
			<div className="row no-margin">
				<h6 style={{padding: '0rem 0.8rem'}}>Introduzca los datos para el nuevo almacén.</h6>
			</div>

			<Form ref="insertForm" rules={this._formValidationRules} onSubmit={this.onFormSubmit.bind(this)}>
				<div style={{padding: '0.5rem 0.3rem'}}>
					<h6 style={{fontWeight: 'bold', padding: '0rem 0.5rem'}}>Campos obligatorios</h6>

					<div className="row no-margin">
						<Input ref="warehouseSubsidiary" name="warehouseSubsidiary" className="col s6" type="text"
							label="Sucursal" placeholder="Sucursal" disabled={true}/>
						<Input ref="warehouseCode" name="warehouseCode" className="col s6" type="text"
							label="Código del almacén *" placeholder="Ingrese el código del almacén" required={true}/>
					</div>
					<div className="row no-margin">
						<Input ref="warehouseType" name="warehouseType" className="col s12" type="text"
							label="Tipo *" placeholder="Ingrese el tipo de almacén" required={true}/>
					</div>
					<div className="row no-margin">
						<Input ref="warehouseName" name="warehouseName" className="col s12" type="text"
							label="Nombre *" placeholder="Ingrese el nombre del almacén" required={true}/>
					</div>

					<div className="row no-margin">
						<Input ref="warehouseCountry" name="warehouseCountry" className="col s6" type="autocomplete"
							label="País *" placeholder="País" required={true} options={{data: this.state.countries, key: 'name', minLength: 1}}/>
						<Input ref="warehouseCity" name="warehouseCity" className="col s6" type="autocomplete"
							label="Ciudad *" placeholder="Ciudad" required={true} options={{data: this.state.cities, key: 'name', minLength: 1}}/>
					</div>
					<div className="row no-margin">
						<Input ref="warehouseAddress" name="warehouseAddress" className="col s12" type="text"
							label="Dirección *" placeholder="Dirección del almacén" required={true}/>
					</div>
				</div>

				<div style={{padding: '0.5rem 0.3rem'}}>
					<h6 style={{fontWeight: 'bold', padding: '0rem 0.5rem'}}>Campos opcionales</h6>

					<div className="row no-margin">	
						<Input ref="warehousePhone" name="warehousePhone" className="col s6" type="text"
							label="Teléfono" placeholder="Ingrese el número de teléfono del almacén"/>
						<Input ref="warehousePostcode" name="warehousePostcode" className="col s6" type="text"
							label="Código postal" placeholder="Código postal"/>
					</div>
				</div>

				<div style={{padding: '0rem 0.3rem'}}>
					<h6 style={{fontWeight: 'bold', padding: '0rem 0.5rem'}}>Finalizar</h6>
					<div className="row">
						<div style={{padding: '0rem 0.5rem'}}>
							<button className="btn waves-effect waves-light col s12 red darken-2" type="submit"
								style={{textTransform: 'none', fontWeight: 'bold', marginBottom: '1rem'}}>
								Guardar datos
								<i className="material-icons right">send</i>
							</button>
						</div>
					</div>
				</div>
			</Form>
			<MessageModal ref="messageModal"/>
		</SectionCard>)
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
				window.location.replace('/login');
			}else{
				InventoryActions.loadSideMenuItems();
				this.setState({signed: true});
			}
		});
	}

	render() {
		let action = this.props.match.params.action ? this.props.match.params.action : 'welcome';
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
					<div className="row no-margin" style={{backgroundColor: '#eeeeee'}}>
						<SectionView className="col s12 m6 l5"  >
							<Switch match={action}>
								<WarehousesWelcome path="welcome"/>
								<WarehousesViewer path="ver" url={this.url} history={this.props.history}
									warehouseCode={this.props.match.params.warehouse}/>
								<WarehousesInsert path="insertar"/>
							</Switch>
						</SectionView>
						<SectionView className="col s12 m6 l7">
							<WarehousesList url={this.url} history={this.props.history}/>
						</SectionView>
					</div> : null
				}
			</main>
			<Footer/>
		</div>);
	}
}

export {AdmInventoryWarehouses}