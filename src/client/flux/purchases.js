
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import Reflux from 'reflux';

import api from '../cloudtrade-api';
import config from '../config';

/****************************************************************************************/

var PurchasesActions = Reflux.createActions([
	'findAll', 'findOne', 'insertOne' , 'updateOneStatus',
	'findAllArticles', 'findAllProviders',
	'getDatedReport', 'getDetailReport'
]);

class PurchasesStore extends Reflux.Store {
    constructor() {
        super();

        this.state = {
			company: config.company,

        	listStatus : 'ready',
        	list : { columns: [], rows: [] },

			viewerStatus: 'ready', // loading, ready, error
			selectedItem: null,
        }

        this.listenables = PurchasesActions;
	}

	onFindAll() {
		let auth = localStorage.getItem('authorization');
		if(auth){
			this.setState({listStatus: 'loading'});
			api.inventory.purchases.findAll({company: this.state.company}, auth, (err, res)=>{
				if(err){
					this.setState({listStatus: 'error'});
				}else{
					res.purchases.rows.forEach(purchase=>{
						purchase.status = this.translateStatus(purchase.status);
					});
					this.setState({list: res.purchases, listStatus: 'ready'});
				}
			});
		}else{
			this.setState({listStatus: 'error'});
		}
	}

	onFindOne(purchaseCode) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			this.setState({viewerStatus: 'loading'});
			api.inventory.purchases.findOne({company: this.state.company, purchase: purchaseCode}, auth, (err, res)=>{
				if(err){
					this.setState({viewerStatus: 'error'});
				}else{
					res.purchase.status = this.translateStatus(res.purchase.status);
					this.setState({selectedItem: res.purchase, viewerStatus: 'ready'});
				}
			});
		}else{
			this.setState({viewerStatus: 'error'});
		}
	}

	onInsertOne(data, callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			data.company = this.state.company;
			api.inventory.purchases.insertOne(data, auth, callback);
		}else{
			callback({status: 500, response:{message: 'Acceso no autorizado'}});
		}
	}

	updateOneStatus(data, callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			data.company = this.state.company;
			api.inventory.purchases.updateOneStatus(data, auth, (err, res)=>{
				if(err){
					callback(err)
				}else{
					res.purchase.status = this.translateStatus(res.purchase.status);
					this.setState({selectedItem: res.purchase});
					callback(null, res);
				}
			});
		}else{
			callback({status: 500, response:{message: 'Acceso no autorizado'}});
		}
	}

	findAllProviders(callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			api.inventory.providers.findAll({company: this.state.company}, auth, callback);
		}else{
			callback({status: 500, response:{message: 'Acceso no autorizado'}});
		}
	}

	findAllArticles(callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			api.inventory.articles.findAll({company: this.state.company}, auth, callback);
		}else{
			callback({status: 500, response:{message: 'Acceso no autorizado'}});
		}
	}


	getDatedReport(data, callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			data.company = this.state.company;
			api.inventory.reports.purchases.getDatedReport(data, auth, callback);
		}else{
			callback({status: 500, response:{message: 'Acceso no autorizado'}});
		}
	}

	getDetailReport(purchaseCode, callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			api.inventory.reports.purchases.getDetailReport({company: this.state.company, purchase: purchaseCode}, auth, callback);
		}else{
			callback({status: 500, response:{message: 'Acceso no autorizado'}});
		}
	}

	/********************* */

	translateStatus(value) {
		switch(value) { //created, approved, cancelled, delayed, delivered, joined
			case 'created': return 'Creado';
			case 'approved': return 'Aprobado';
			case 'cancelled': return 'Cancelado';
			case 'delivered': return 'Recibido';
			case 'delayed': return 'Retrasado';
			case 'joined': return 'Depositado en almacén';
			default: return 'Desconocido'
		}
	}
}

export { PurchasesActions, PurchasesStore }