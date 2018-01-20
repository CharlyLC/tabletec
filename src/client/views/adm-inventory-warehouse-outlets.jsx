
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
import { Button } from '../components/button.jsx';
import { Collapsible, CollapsibleCard } from '../components/collapsible.jsx';
import { DataImporter, TransactionMutator } from '../components/data-importer.jsx';
import Form from '../components/form.jsx';
import Input from '../components/input.jsx';
import ItemProperty from '../components/item-property.jsx';
import MessageModal from '../components/message-modal.jsx';
import Progress from'../components/progress.jsx';
import SectionCard from '../components/section-card.jsx';
import SectionView from '../components/section-view.jsx';
import Select from '../components/select.jsx';
import { Switch, Case } from '../components/switch.jsx';
import Table from '../components/table.jsx';
import PdfViewerModal from '../components/pdf-viewer-modal.jsx';

import { AccountActions, AccountStore } from '../flux/account';
import { InventoryActions, InventoryStore } from '../flux/inventory';
import { WarehouseOutletsActions, WarehouseOutletsStore } from '../flux/warehouse-outlets';

import Tools from '../tools';
import {PretyDate} from '../tools/prety-date';

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
		this.props.history.push(this.props.url + '/insertar/' + Tools.makeid(32));
	}

	onDropdowOptionUpdate() {
		WarehouseOutletsActions.findAll();
	}

	onDropdowOptionDatedReport() {
		this.props.history.push(this.props.url + '/reporte-fechas/' + Tools.makeid(32));
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

class WarehouseOutletViewer extends Reflux.Component {
	constructor(props) {
		super(props);

		this.state = {}

		this.store = WarehouseOutletsStore;
	}

	componentWillMount() {
		super.componentWillMount();

		if(this.props.outletCode){
			WarehouseOutletsActions.findOne(this.props.outletCode);
		}
	}

	componentWillReceiveProps(nextProps) {
		if(this.props.outletCode !== nextProps.outletCode){
			if(nextProps.outletCode){
				WarehouseOutletsActions.findOne(nextProps.outletCode);
			}
		}
	}

	render(){
		let item = this.state.selectedItem;

		switch(this.state.viewerStatus){
		case 'ready': return item ? (
			<SectionCard title="Salida de almacén" iconName="store">
				
				<h6 style={{fontWeight: 'bold', padding: '1rem'}}>{item.description}</h6>

				<div className="row" style={{marginBottom: '0.5rem'}}>
					<ItemProperty name="Tipo de Operación" value={item.tTransactionsTypeName} className="col s12 m6"/>
					<ItemProperty name="Fecha de salida" value={item.outletDate} className="col s12 m6"/>
				</div>

				<h6 style={{fontWeight: 'bold', padding: '1rem'}}>Información sobre los artículos</h6>
				<Collapsible>
					{
						item.transactions ?
						item.transactions.map(function(tran, i){
							return (
							<CollapsibleCard key={i} title={item.tTransactionsTypeName + ': ' + tran.business} iconName="view_stream">
								{
									tran.articles.map((article, ii)=>{
										return (
										<div key={ii} className="row" style={{marginBottom: '0.5rem'}}>
											<div className="card grey lighten-2">
       											<div className="card-content" style={{padding: '0.5rem'}}>
													<h6 style={{fontWeight: 'bold', padding: '0.5rem'}}>{article.name}</h6>
													<div className="row no-margin">
														<ItemProperty name="Almacén" value={article.warehouseName} className="col s12"/>
													</div>
													<div className="row no-margin">
														<ItemProperty name="Cantidad" value={article.quantity} className="col s4"/>
														<ItemProperty name="Detalle" value={article.remark} className="col s8"/>
													</div>
												</div>
											</div>
										</div>)
									})
								}
							</CollapsibleCard>)
						}) : null
					}
				</Collapsible>
			</SectionCard>) : (
			<SectionCard title="Salida de almacén" iconName="store">
				<div style={{padding: '0rem 0.5rem 1rem 0.5rem'}}>
					<Alert type="info" text="Seleccione una elemento de la lista de salidas de almacén."/>
				</div>
			</SectionCard>);
		case 'loading': return (
			<SectionCard title="Cargando datos..." iconName="store">
				<div className="row">
					<Progress type="indeterminate"/>
				</div>
			</SectionCard>);
		case 'error': return (
			<SectionCard title="Salida de almacén" iconName="store">
				<Alert type="error" text="ERROR: No se pudo cargar los datos de la salida"/>
			</SectionCard>);
		}
	}
}

class WarehouseOutletInsert extends Reflux.Component {
	constructor(props) {
		super(props);

		this.state = {
			transactType: 'transfers',
			transactTypeOptions: [{name:'Transferencias',value:'transfers'},{name:'Otros',value:'custom'}],
			warehouses: [],
		}

		this._formValidationRules = {
		}
	}

	componentWillMount() {
		super.componentWillMount();

		WarehouseOutletsActions.findAllWarehouses((err, res)=>{
			if(res && res.warehouses){ this.setState({warehouses: res.warehouses.rows}); }
		});
	}

	componentDidMount() {
		Materialize.updateTextFields();
	}

	onRequireTransfers(callback) {
		WarehouseOutletsActions.findAllApprovedTransfers((err, res)=>{
			if(res){ callback(null, {data: res.transfers}); }else{ callback(err); }
		});
	}

	onRequireTransferArticles(transfer, callback) {
		WarehouseOutletsActions.findAllTransferArticles(transfer.code, (err, res)=>{
			if(err){
				callback(err);
			}else{
				transfer.typeName = 'Transferencia',
				transfer.articles = res.transferArticles;
				callback(null, res.transferArticles);
			}
		});
	}

	onDataImporterChange() {
		Materialize.updateTextFields();
		this.refs.insertForm.revalidate();
	}

	onChangeTransactType(value) {
		this.setState({transactType: value});

		if(value === 'custom'){ this.refs.submitBtn.disable(); }
		else{ this.refs.submitBtn.enable(); }
	}

	onFormSubmit(form) {
		var flag = false;
		let selectedTransactions = this.refs.transactions.getSelectedTransactions();

		let data = {
			transactionsTypeName: this.state.transactType,
			description: this.refs.outletDescription.value(),
			outletDate: this.refs.outletDate.value(),
			transactions: selectedTransactions.map(tran=>{
				return {
					code: tran.code,
					articles: tran.articles.map(article=>{
						if( article.op.quantity > article.quantity) { 
							flag = true;
						}
						return {
							code: article.code,
							warehouseCode: (this.state.transactType === 'transfers') ? tran.originWarehouseCode : article.op.warehouseCode,
							quantity: article.op.quantity,
							remark: article.op.remark
						}
					})
				}
			})
		}
		
		if(flag) {
			this.refs.messageModal.show('warning','Se está superando la cantidad solicitada')
		} else {
			this.refs.messageModal.show('sending');
			WarehouseOutletsActions.insertOne(data, (err, res)=>{
			if(err){
				this.refs.messageModal.show('save_error', 'Error: ' + err.status + ' <' + err.response.message + '>');
			}else{
				this.refs.messageModal.show('success_save');
			}
		});
		}
	}

	render() {
		let transfersColumns = [
			{ name: 'business', text: 'Asunto', visible: true },
			{ name: 'originWarehouseName', text: 'Almacen origen', visible: true },
			{ name: 'destinationWarehouseName', text: 'Almacén destino', visible: true }
		];

		return(
		<SectionCard title="Insertar nueva salida de almacén" iconName="library_books">
			<div className="row">
				<h6 style={{padding: '0rem 1rem'}}>Introduzca los datos para la nueva salida de almacén.</h6>
			</div>
			<Form ref="insertForm" rules={this._formValidationRules} onSubmit={this.onFormSubmit.bind(this)}>
				<h6 style={{fontWeight: 'bold', padding: '0rem 0.8rem'}}>Detalles de la salida</h6>
				<div className="row no-margin">
					<Input ref="outletDescription" name="outletDescription" type="text" className="col s12"
						label="Descripción" placeholder="Descripción" required={true}/>
				</div>
				<div className="row no-margin">
					<Input ref="outletDate" name="outletDate" type="date" className="col s12"
						label="Fecha de realización de la salida" placeholder="Fecha de realización de la salida"/>
				</div>
				<div className="row no-margin">
					<Select ref="transactType" className="col s12" nameField="name" valueField="value"
						options={this.state.transactTypeOptions}
						onChange={this.onChangeTransactType.bind(this)} label="Transacción" placeholder="Seleccione el tipo de operación"/>
				</div>
				<Switch match={this.state.transactType}>
					<Case path="transfers">
						<DataImporter ref="transactions" columns={transfersColumns} dataComponent={TransactionMutator} group={true} filterBy="business"
							loadData={this.onRequireTransfers.bind(this)} loadDataSubitem={this.onRequireTransferArticles.bind(this)}
							onChange={this.onDataImporterChange.bind(this)}/>
					</Case>
					<Case path="custom">
						<div>(Esta opción no está habilitada)</div>
					</Case>
				</Switch>
				<div>
					<h6 style={{fontWeight: 'bold', padding: '0rem 0.8rem'}}>Finalizar</h6>
					<div className="row no-margin" style={{padding: '0rem 0.5rem 1rem'}}>
						<Button ref="submitBtn" className="col s12 red darken-2" type="submit" text="Guardar datos" iconName="send"/>
					</div>
				</div>
			</Form>
			<MessageModal ref="messageModal"/>
		</SectionCard>)
	}
}

class WarehouseOutletDatedReport extends Reflux.Component {
	constructor(props){
		super(props);
	}

	componentDidMount() {
		Materialize.updateTextFields();

		let date1 = PretyDate.formated();
		this.refs.startDate.value(date1);
		this.refs.endDate.value(date1);
	}

	onFormSubmit(form) {
		let data = {
			startDate: this.refs.startDate.value(),
			endDate: this.refs.endDate.value()
		}
		var d1 = PretyDate.parse(data.startDate);
		var d2 = PretyDate.parse(data.endDate);

		if(d1 > d2) {
			this.refs.messageModal.show('save_error', 'No permitido: la fecha de inicio debe ser menor a la fecha fin.');
		}else{
			this.refs.messageModal.show('sending');
			/*TransfersActions.getDatedReport(data, (err, res)=>{
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
			});*/
		}
	}

	render() {
		return(
			<SectionCard title="Crear reporte de salidas de almacén" iconName="swap_horiz">
			<div style={{padding: '0rem 1rem'}}>
				<span>Seleccione las fechas para el reporte de salidas de almacén.</span>
			</div>
			<Form ref="datedReportForm" onSubmit={this.onFormSubmit.bind(this)}>
				<div className="row no-margin" style={{padding: '0rem 0.8rem'}}>
					<Input ref="startDate" name="startDate" type="date" className="col s12"
						label="Fecha inicio" placeholder="Seleccione fecha inicio"/>
				</div>
				<div className="row no-margin" style={{padding: '0rem 0.8rem'}}>
					<Input ref="endDate" name="endDate" type="date" className="col s12"
						label="Fecha fin" placeholder="Seleccione fecha fin"/>
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
								<WarehouseOutletsWelcome path="welcome"/>
								<WarehouseOutletViewer path="ver" url={this.url} history={this.props.history}
									outletCode={this.props.match.params.outlet}/>
								<WarehouseOutletInsert path="insertar"/>
								<WarehouseOutletDatedReport path="reporte-fechas"/>
							</Switch>
						</SectionView>
						<SectionView className="col s12 m6 l7">
							<WarehouseOutletsList url={this.url} history={this.props.history}/>
						</SectionView>
					</div> : null
				}
			</main>
			<Footer/>
		</div>);
	}
}

export {AdmInventoryWarehouseOutlets}