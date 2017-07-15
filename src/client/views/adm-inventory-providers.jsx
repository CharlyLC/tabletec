
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
import Progress from'../components/progress.jsx';
import SectionCard from '../components/section-card.jsx';
import SectionView from '../components/section-view.jsx';
import { Switch, Case } from '../components/switch.jsx';
import Table from '../components/table.jsx';

import { AccountActions, AccountStore } from '../flux/account';
import { InventoryActions, InventoryStore } from '../flux/inventory';
import { ProviderActions, ProviderStore } from '../flux/provider';

import Tools from '../tools';

/****************************************************************************************/

class ItemProperty extends Reflux.Component {
	constructor(props) {
        super(props);
    }

	render() {
		return(
		<div className={this.props.className}>
			<h6 style={{fontWeight: 'bold', fontSize: '1rem'}}>{ this.props.name + ':'}</h6>
			<div style={{paddingLeft: '1rem'}}>
				<span>{ this.props.value }</span>
			</div>
		</div>)
	}
}

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

		this.store = ProviderStore;

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
		ProviderActions.findAll();
	}

	onSelectItem(item) {
		this.props.history.push(this.props.url + '/ver/' + item.code);
	}

	onDropdowOptionInsert() {
		this.props.history.push(this.props.url + '/insertar/' + Tools.makeid(32));
	}

	onDropdowOptionUpdate() {
		ProviderActions.findAll();
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

		this.store = ProviderStore;

		this.dropdowOptions = [];
	}

	componentWillMount() {
		super.componentWillMount();

		if(this.props.providerCode){
			ProviderActions.findOne(this.props.providerCode);
		}
	}

	componentWillReceiveProps(nextProps) {
		if(this.props.providerCode !== nextProps.providerCode){
			if(nextProps.providerCode){
				ProviderActions.findOne(nextProps.providerCode);
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
							<ProvidersWelcome path="welcome"/>
							<ProviderViewer path="ver" url={this.url} history={this.props.history}
								providerCode={this.props.match.params.provider}/>
						</Switch>
					</SectionView>
					<SectionView className="col s12 m6 l7">
						<ProvidersList url={this.url} history={this.props.history}/>
					</SectionView>
				</div>
			</main>
		</div>) : null;
	}
}

export {AdmInventoryProviders}