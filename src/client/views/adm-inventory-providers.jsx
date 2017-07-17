
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
import { ProvidersActions, ProvidersStore } from '../flux/providers';

import Tools from '../tools';

/****************************************************************************************/

class ProvidersWelcome extends React.Component {
	constructor(props) {
		super(props);

		this.state = {}
	}

	render() {
		return(
		<SectionCard title="Bienvenido" iconName="library_books">
			<div style={{padding: '0rem 0.5rem 1rem 0.5rem'}}>
				<Alert type="info" text="Bienvenido a la página de administración de proveedores."/>
			</div>
		</SectionCard>);
	}
}

class ProvidersList extends Reflux.Component {
	constructor(props) {
		super(props);

		this.state = {}

		this.store = ProvidersStore;

		this.dropdowOptions = [
			{
				text:'Insertar nuevo proveedor',
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
		ProvidersActions.findAll();
	}

	onSelectItem(item) {
		this.props.history.push(this.props.url + '/ver/' + item.code);
	}

	onDropdowOptionInsert() {
		this.props.history.push(this.props.url + '/insertar/' + Tools.makeid(32));
	}

	onDropdowOptionUpdate() {
		ProvidersActions.findAll();
	}

	render() {
		return(
		<SectionCard title="Lista de proveedores" iconName="view_list" menuID="providersList" menuItems={this.dropdowOptions}>
			<div style={{padding: '0rem 1rem'}}>
				<span>
					Lista de todos los proveedores registrados en la base de datos.
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
						<Alert type="error" text="ERROR: No se pudo cargar la lista de proveedores"/>
					</Case>
				</Switch>
			</div>
		</SectionCard>);
	}
}

class ProviderViewer extends Reflux.Component {
	constructor(props) {
		super(props);

		this.state = {}

		this.store = ProvidersStore;

		this.dropdowOptions = [];
	}

	componentWillMount() {
		super.componentWillMount();

		if(this.props.providerCode){
			ProvidersActions.findOne(this.props.providerCode);
		}
	}

	componentWillReceiveProps(nextProps) {
		if(this.props.providerCode !== nextProps.providerCode){
			if(nextProps.providerCode){
				ProvidersActions.findOne(nextProps.providerCode);
			}
		}
	}

	render(){
		var item = this.state.selectedItem;
		switch(this.state.viewerStatus){
		case 'ready':
			return item ? (
			<SectionCard title="Datos de proveedor" iconName="people" menuID="providersViewer" menuItems={this.dropdowOptions}>

				<h6 style={{fontWeight: 'bold', padding: '1rem'}}>{item.name}</h6>

				<Collapsible defaultActiveIndex={0}>
					<CollapsibleCard title="Datos del proveedor" iconName="info_outline">
						<div className="row" style={{marginBottom: '0.5rem'}}>
							<ItemProperty name="Nombre" value={item.name} className="col s6"/>
							<ItemProperty name="NIT" value={item.nit} className="col s6"/>
						</div>

						<div className="row" style={{marginBottom: '0.5rem'}}>
							<ItemProperty name="Ciudad" value={item.city} className="col s6"/>
							<ItemProperty name="Teléfono" value={item.phone} className="col s6"/>
						</div>

						<div className="row" style={{marginBottom: '0.5rem'}}>
							<ItemProperty name="Correo electrónico" value={item.email} className="col s6"/>
						</div>

						<div className="row" style={{marginBottom: '0.5rem'}}>
							<ItemProperty name="Dirección" value={item.address} className="col s12"/>
						</div>

						<div className="row" style={{marginBottom: '0.5rem'}}>
							<ItemProperty name="Descripcion" value={item.description} className="col s12"/>
						</div>
					</CollapsibleCard>
				</Collapsible>
			</SectionCard>) : (
			<SectionCard title="Datos de proveedor" iconName="people">
				<div style={{padding: '0rem 0.5rem 1rem 0.5rem'}}>
					<Alert type="info" text="Seleccione una elemento de la lista de proveedores."/>
				</div>
			</SectionCard>);
		case 'loading':
			return (
			<SectionCard title="cargando datos de proveedor" iconName="people">
				<div className="row">
					<Progress type="indeterminate"/>
				</div>
			</SectionCard>);
		case 'error':
			return (
			<SectionCard title="Datos de proveedor" iconName="people">
				<Alert type="error" text="ERROR: No se pudo cargar los datos del proveedor"/>
			</SectionCard>);
		}
	}
}

class ProviderInsert extends Reflux.Component {
	constructor(props) {
		super(props);

		this.state = {
			cities: []
		}

		this.stores = [ProvidersStore];

		this._formValidationRules = {
			rules: {
				email: { email: true }
			},
			messages: {
				email: {
					required: 'Debes ingresar un email',
					email: 'Por favor, introduzca una dirección email válida'
				}
			}
		}
	}

	componentWillMount() {
		super.componentWillMount();

		ProvidersActions.findAllCities((err, res)=>{
			if(err){} else if(res){ this.setState({cities: res.cities}); }
		});
	}

	componentDidMount() {
		Materialize.updateTextFields();
	}

	onFormSubmit(form) {
		var data = {
			name: this.refs.providerName.value(),
			nit: this.refs.providerNIT.value(),
			description: this.refs.providerDescription.value,
			city: this.refs.providerCity.value(),
			phone: this.refs.providerPhone.value(),
			email: this.refs.email.value(),
			address: this.refs.providerAddress.value()
		}

		this.refs.messageModal.show('sending');
		ProvidersActions.insertOne(data, (err, res)=>{
			if(err){
				this.refs.messageModal.show('save_error', 'Error: ' + err.status + ' <' + err.response.message + '>');
			}else{
				this.refs.messageModal.show('success_save');
			}
		});
	}

	render() {
		return(
		<SectionCard title="Insertar nuevo proveedor" iconName="library_books">
			<div style={{padding: '0rem 1rem'}}>
				<span>Introduzca los datos para el nuevo proveedor.</span>
			</div>

			<Form ref="insertForm" rules={this._formValidationRules} onSubmit={this.onFormSubmit.bind(this)}>
				<div style={{padding: '0rem 0.3rem'}}>
					<h6 style={{fontWeight: 'bold', padding: '0rem 0.5rem'}}>Campos obligatorios</h6>

					<div className="row no-margin">
						<Input ref="providerName" name="providerName" className="col s6" type="text"
							label="Nombre del proveedor *" placeholder="Ingrese el nombre del proveedor" required={true}/>
						<Input ref="providerNIT" name="providerNIT" className="col s6" type="text"
							label="NIT *" placeholder="Ingrese el NIT del proveedor" required={true}/>
					</div>

					<div className="row no-margin">
						<Input ref="providerCity" name="providerCity" className="col s6" type="autocomplete"
							label="Ciudad del proveedor *" placeholder="Ingrese la ciudad del proveedor" required={true} options={{data: this.state.cities, key: 'name', minLength: 1}}/>
						<Input ref="providerPhone" name="providerPhone" className="col s6" type="text"
							label="Teléfono *" placeholder="Ingrese el teléfono del proveedor" required={true}/>
					</div>
				</div>
				<div style={{padding: '0rem 0.3rem'}}>
					<h6 style={{fontWeight: 'bold', padding: '0rem 0.5rem'}}>Campos opcionales</h6>
					<div className="row no-margin">
						<div className="input-field col s12">
							<textarea ref="providerDescription" id="providerDescription" className="materialize-textarea" data-length="10240" placeholder="Detalles de la descripción"/>
							<label htmlFor="providerDescription">{'Detalles de la descripción'}</label>
						</div>
					</div>
					<div className="row no-margin">
						<Input ref="email" name="email" className="col s12" type="email" label="Email" placeholder="Email"/>
					</div>
					<div className="row no-margin">
						<Input ref="providerAddress" name="providerAddress" type="text" label="Dirección"
							className="col s12" placeholder="Ingrese la dirección del proveedor"/>
					</div>
				</div>

				<div className="row">
					<h6 style={{fontWeight: 'bold', padding: '0rem 0.8rem'}}>Finalizar</h6>
					<div>
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
		</SectionCard>);
	}
}

/****************************************************************************************/

class AdmInventoryProviders extends Reflux.Component {
	constructor(props) {
        super(props);

		this.state = {
			signed: false
		}

		this.stores = [AccountStore, InventoryStore];
    }

	componentWillMount() {
		super.componentWillMount();

		this.url = '/adm/inventarios/proveedores';

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
								<ProvidersWelcome path="welcome"/>
								<ProviderViewer path="ver" url={this.url} history={this.props.history}
									providerCode={this.props.match.params.provider}/>
								<ProviderInsert path="insertar"/>
							</Switch>
						</SectionView>
						<SectionView className="col s12 m6 l7">
							<ProvidersList url={this.url} history={this.props.history}/>
						</SectionView>
					</div> : null
				}
			</main>
			<Footer/>
		</div>);
	}
}

export {AdmInventoryProviders}