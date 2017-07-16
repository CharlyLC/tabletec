
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
import { PurchasesActions, PurchasesStore } from '../flux/purchases';

import Tools from '../tools';

/****************************************************************************************/

class PurchasesWelcome extends React.Component {
	constructor(props) {
		super(props);

		this.state = {}
	}

	render() {
		return(
		<SectionCard title="Bienvenido" iconName="shopping_cart">
			<div style={{padding: '0rem 0.5rem 1rem 0.5rem'}}>
				<Alert type="info" text="Bienvenido a la página de administración de compras."/>
			</div>
		</SectionCard>);
	}
}

class PurchasesList extends Reflux.Component {
	constructor(props) {
		super(props);

		this.state = {}

		this.store = PurchasesStore;

		this.dropdowOptions = [
			{
				text:'Crear nueva compra',
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
		PurchasesActions.findAll();
	}

	onSelectItem(item) {
		this.props.history.push(this.props.url + '/ver/' + item.code);
	}

	onDropdowOptionInsert() {
		this.props.history.push(this.props.url + '/insertar/' + Tools.makeid(32));
	}

	onDropdowOptionUpdate() {
		PurchasesActions.findAll();
	}

	render() {
		return(
		<SectionCard title="Lista de compras" iconName="view_list" menuID="purchasesList" menuItems={this.dropdowOptions}>
			<div style={{padding: '0rem 1rem'}}>
				<span>
					Lista de todos las compras registradas en la base de datos.
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
						<Table columns={this.state.list.columns} rows={this.state.list.rows} filterBy="business"
							onSelectRow={this.onSelectItem.bind(this)}/>
					</Case>
					<Case path="error">
						<Alert type="error" text="ERROR: No se pudo cargar la lista de compras"/>
					</Case>
				</Switch>
			</div>

		</SectionCard>)
	}
}

class PurchaseViewer extends Reflux.Component {
	constructor(props) {
		super(props);

		this.state = {}

		this.store = PurchasesStore;
		this.storeKeys = ['selectedItem', 'viewerStatus'];

		this.dropdowOptions = [
			{
				text: 'Cambiar estado',
				select: this.onDropdowOptionUpdateStatus.bind(this)
			}
		];
	}

	componentWillMount() {
		super.componentWillMount();

		if(this.props.purchaseCode){
			PurchasesActions.findOne(this.props.purchaseCode);
		}
	}

	componentWillReceiveProps(nextProps) {
		if(this.props.purchaseCode !== nextProps.purchaseCode){
			if(nextProps.purchaseCode){
				PurchasesActions.findOne(nextProps.purchaseCode);
			}
		}
	}

	onDropdowOptionUpdateStatus() {
		this.props.history.push(this.props.url + '/cambiar-estado/' + this.props.purchaseCode);
	}

	render() {
		let item = this.state.selectedItem;
		switch(this.state.viewerStatus){
		case 'ready':
			return item ? (
			<SectionCard title="Orden de compra" iconName="shopping_cart" menuID="purchaseViewer" menuItems={this.dropdowOptions}>
				<h6 style={{fontWeight: 'bold', padding: '0.3rem 1rem'}}>{item.business}</h6>
			
				<Collapsible defaultActiveIndex={0}>
					<CollapsibleCard title="Datos de la compra" iconName="assignment_turned_in">
						<div className="row" style={{marginBottom: '0.5rem'}}>
							<ItemProperty name="Asunto" value={item.business} className="col s6"/>
							<ItemProperty name="Referencia del pedido" value={item.order} className="col s6"/>
						</div>
						<div className="row" style={{marginBottom: '0.5rem'}}>
							<ItemProperty name="Número de guía" value={item.guideNumber} className="col s6"/>
							<ItemProperty name="Estado" value={item.status} className="col s6"/>
						</div>
						<div className="row" style={{marginBottom: '0.5rem'}}>
							<ItemProperty name="Proveedor" value={item.provider.name} className="col s6"/>
							<ItemProperty name="Nombre de contacto" value={item.contactName} className="col s6"/>
						</div>
						<div className="row" style={{marginBottom: '0.5rem'}}>
							<ItemProperty name="Fecha de pago" value={item.payDate} className="col s6"/>
						</div>

						<div className="row" style={{marginBottom: '0.5rem'}}>
							<ItemProperty name="Términos y condiciones" value={item.terms} className="col s12"/>
						</div>
						<div className="row" style={{marginBottom: '0.5rem'}}>
							<ItemProperty name="Descripción" value={item.description} className="col s12"/>
						</div>
					</CollapsibleCard>
				</Collapsible>
				<h6 style={{fontWeight: 'bold', padding: '0rem 0.5rem'}}>Información sobre los artículos</h6>
				<Collapsible>
					{
						item.articles ?
						item.articles.map(function(article, i){
							return (
							<CollapsibleCard key={i} title={article.name} iconName="view_stream">
								<div className="row" style={{marginBottom: '0.5rem'}}>
									<ItemProperty name="Cantidad" value={article.quantity} className="col s6"/>
									<ItemProperty name="Precio unitario" value={article.unitPrice} className="col s6"/>
								</div>
								<div className="row" style={{marginBottom: '0.5rem'}}>
									<ItemProperty name="Unidad de medida" value={article.measurement} className="col s6"/>
								</div>
								<div className="row" style={{marginBottom: '0.5rem'}}>
									<ItemProperty name="Observación" value={article.remark} className="col s12"/>
								</div>
							</CollapsibleCard>)
						}) : null
					}
				</Collapsible>
			</SectionCard>) : (
			<SectionCard title="Orden de compra" iconName="shopping_cart">
				<div style={{padding: '0rem 0.5rem 1rem 0.5rem'}}>
					<Alert type="info" text="Seleccione una elemento de la lista de compras."/>
				</div>
			</SectionCard>);
		case 'loading':
			return (
			<SectionCard title="Cargando datos de compra..." iconName="shopping_cart">
				<div className="row">
					<Progress type="indeterminate"/>
				</div>
			</SectionCard>);

		case 'error':
			return (
			<SectionCard title="Orden de compra" iconName="shopping_cart">
				<Alert type="error" text="ERROR: No se pudo cargar los datos"/>
			</SectionCard>);
		}
	}
}

/****************************************************************************************/

class AdmInventoryPurchases extends Reflux.Component {
	constructor(props) {
        super(props);

		this.state = {
			signed: false
		}

		this.stores = [AccountStore, InventoryStore];
	}

	componentWillMount() {
		super.componentWillMount();

		this.url = '/adm/inventarios/compras';

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
							<PurchasesWelcome path="welcome"/>
							<PurchaseViewer path="ver" url={this.url} history={this.props.history}
								purchaseCode={this.props.match.params.purchase}/>
						</Switch>
					</SectionView>
					<SectionView className="col s12 m6 l7">
						<PurchasesList url={this.url} history={this.props.history}/>
					</SectionView>
				</div>
			</main>
		</div>) : null;
	}
}

export { AdmInventoryPurchases }