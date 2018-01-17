
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
import { Button } from '../components/button.jsx';
import Select from '../components/select.jsx';
import ItemProperty from '../components/item-property.jsx';
import MessageModal from '../components/message-modal.jsx';
import Progress from'../components/progress.jsx';
import SectionCard from '../components/section-card.jsx';
import SectionView from '../components/section-view.jsx';
import { Switch, Case } from '../components/switch.jsx';
import Table from '../components/table.jsx';
import PdfViewerModal from '../components/pdf-viewer-modal.jsx';

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
				text: 'Editar',
				select: this.onDropdowOptionEdit.bind(this)
			},
			{
				text: 'Reporte de existencias',
				select: this.onDropdowOptionStockReport.bind(this)
			},
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

	onDropdowOptionEdit(item) {
		this.props.history.push(this.props.url + '/editar/' + this.props.warehouseCode);
	}

	onDropdowOptionStockReport() {
		this.props.history.push(this.props.url + '/reporte-existencias/' + this.props.warehouseCode);
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
				<MessageModal ref="messageModal"/>
				<PdfViewerModal ref="pdfViewer"/>
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

		this.title = "Insertar nuevo almacén";
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
		var data = this.getCompileAndValidateInputData();

		this.refs.messageModal.show('sending');
		WarehousesActions.insertOne(data, (err, res)=>{
			if(err){
				this.refs.messageModal.show('save_error', 'Error: ' + err.status + ' <' + err.response.message + '>');
			}else{
				this.refs.messageModal.show('success_save');
			}
		});
	}

	getCompileAndValidateInputData() {
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

		return data;
	}

	render() {
		return(
		<SectionCard title={this.title} iconName="library_books">
			<div className="row no-margin">
				<h6 style={{padding: '0rem 0.8rem'}}>Introduzca los datos para el almacén.</h6>
			</div>

			<Form ref="insertForm" rules={this._formValidationRules} onSubmit={this.onFormSubmit.bind(this)}>
				<div style={{padding: '0.5rem 0.3rem'}}>
					<h6 style={{fontWeight: 'bold', padding: '0rem 0.5rem'}}>Campos obligatorios</h6>

					<div className="row">
						<Input ref="warehouseSubsidiary" name="warehouseSubsidiary" className="col s6" type="text"
							label="Sucursal" placeholder="Sucursal" disabled={true}/>
						<Input ref="warehouseCode" name="warehouseCode" className="col s6" type="text"
							label="Código del almacén *" placeholder="Ingrese el código del almacén" required={true}/>
					</div>
					<div className="row">
						<Input ref="warehouseType" name="warehouseType" className="col s12" type="text"
							label="Tipo *" placeholder="Ingrese el tipo de almacén" required={true}/>
					</div>
					<div className="row">
						<Input ref="warehouseName" name="warehouseName" className="col s12" type="text"
							label="Nombre *" placeholder="Ingrese el nombre del almacén" required={true}/>
					</div>

					<div className="row">
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

					<div className="row">
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

class WarehousesUpdate extends WarehousesInsert {
	constructor(props) {
		super(props);

		this.title = "Editar datos de almacén";
	}

	componentDidMount() {
		if(this.props.warehouseCode && ((this.state.viewerStatus !== 'ready') || !this.state.selectedItem)){
			WarehousesActions.findOne(this.props.warehouseCode);
		}

		this.onFillData();
		Materialize.updateTextFields();
	}

	componentDidUpdate() {
		this.onFillData();
		Materialize.updateTextFields();
	}

	onFillData() {
		if((this.state.viewerStatus === 'ready') && this.state.selectedItem){
			this.refs.warehouseCode.value(this.state.selectedItem.clientCode);
			this.refs.warehouseType.value(this.state.selectedItem.type);
			this.refs.warehouseName.value(this.state.selectedItem.name);
			this.refs.warehouseCountry.value(this.state.selectedItem.country);
			this.refs.warehouseCity.value(this.state.selectedItem.city);
			this.refs.warehouseAddress.value(this.state.selectedItem.address);
			this.refs.warehousePhone.value(this.state.selectedItem.phone);
			this.refs.warehousePostcode.value(this.state.selectedItem.postcode);
		}
	}

	onFormSubmit(form) {
		var data = this.getCompileAndValidateInputData();
		data.code = this.props.warehouseCode;

		this.refs.messageModal.show('sending');
		WarehousesActions.updateOne(data, (err, res)=>{
			if(err){
				this.refs.messageModal.show('save_error', 'Error: ' + err.status + ' <' + err.response.message + '>');
			}else{
				this.refs.messageModal.close();
				this.props.history.push(this.props.url + '/ver/' + this.props.warehouseCode);
			}
		});
	}

	render() {
		switch(this.state.viewerStatus){
		case 'ready':
			return this.state.selectedItem ? (super.render()) :
			(<SectionCard title={this.title} iconName="library_books">
				<div style={{padding: '0rem 0.5rem 1rem 0.5rem'}}>
					<Alert type="info" text="Seleccione una elemento de la lista de almacenes."/>
				</div>
			</SectionCard>);
		case 'loading':
			return (
			<SectionCard title="Cargando datos de almacén..." iconName="library_books">
				<div className="row">
					<Progress type="indeterminate"/>
				</div>
			</SectionCard>);
		case 'error':
			return (
			<SectionCard title={this.title} iconName="library_books">
				<Alert type="error" text="ERROR: No se pudo cargar los datos del almacén"/>
			</SectionCard>);
		}
	}
}

class WarehousesReports extends Reflux.Component {
	constructor(props) {
		super(props);
		this.title = "Reporte de existencias";

		this.state = {
			options: [
				{
					texto : 'Filtrar por Código',
					valor : 'code',
				},
				{
					texto : 'Filtrar por Nombre',
					valor : 'name',
				},
				{
					texto : 'Filtrar por Marca',
					valor : 'brand',
				},
				{
					texto : 'Filtrar por Categoria',
					valor : 'category',
				},
				{
					texto : 'Mostrar Todos',
					valor : 'all',
				}
			]
		}

		this.store = WarehousesStore;
		this.storeKeys = ['selectedItem','viewerStatus'];
	}
	componentDidMount() {
		Materialize.updateTextFields();
	}

	componentWillMount() {
		super.componentWillMount();

		if(this.props.warehouseCode){
			WarehousesActions.findOne(this.props.warehouseCode);
		}
	}

	onFormSubmit(Form) {
		let data = {
			warehouseCode : this.props.warehouseCode,
			filter : {
				option : this.refs.option.value(),
				text : this.refs.filter.value()
			}
		}
		console.log(data);
		this.refs.messageModal.show('sending');
		WarehousesActions.getStockReport( data, (err, res)=>{
			if(err){
				this.refs.messageModal.show('save_error', 'Error: ' + err.status + ' <' + err.response.message + '>');
			}else{
				this.refs.messageModal.close();

				if(this.refs.pdfViewer.supports()){
					this.refs.pdfViewer.setDoc('data:application/pdf;base64,'+res.pdf);
					this.refs.pdfViewer.open();
				}	else {
					window.open('data:application/pdf;base64,'+res.pdf);
				}
			}
		});
	}

	render() {
		switch(this.state.viewerStatus){
		case 'ready':
		return(

			<SectionCard title={this.title} iconName="library_books">
				<div className="row no-margin">
					<h6 style={{padding: '0rem 0.8rem'}}>Seleccione la opcion almacén. {this.state.selectedItem.name}</h6>
				</div>
				<Form ref="datedReportForm" onSubmit={this.onFormSubmit.bind(this)}>
					<div className="row no-margin" style={{padding: '0rem 0.8rem'}}>
						<Select ref="option" className="col s12" options={this.state.options} nameField="texto" valueField="valor"
							label="opciones" placeholder="Seleccione una opción"/>
					</div>
					<div className="row no-margin" style={{padding: '0rem 0.8rem'}}>
						<Input ref="filter" name="filter" type="text" className="col s12"
							label="texto" placeholder="escriba texto"/>
					</div>
					<div className="row no-margin" style={{padding: '0rem 0.8rem 1rem 0.8rem'}}>
						<h6 style={{fontWeight: 'bold'}}>Crear</h6>
						<Button ref="submitBtn" className="col s12 red darken-2" text="Crear reporte" iconName="send" type="submit"/>
					</div>
				</Form>
				<MessageModal ref="messageModal"/>
				<PdfViewerModal ref="pdfViewer"/>
			</SectionCard>
		)
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
								<WarehousesUpdate path="editar" url={this.url} history={this.props.history}
									warehouseCode={this.props.match.params.warehouse}/>
								<WarehousesReports path="reporte-existencias" url={this.url} history={this.props.history}
									warehouseCode={this.props.match.params.warehouse}/>	
									
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
