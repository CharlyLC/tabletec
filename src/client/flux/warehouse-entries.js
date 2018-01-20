
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import Reflux from 'reflux';

import api from '../cloudtrade-api';
import config from '../config';

/****************************************************************************************/

var WarehouseEntriesActions = Reflux.createActions([
	'findAll', 'findOne', 'insertOne',
	'findAllWarehouses', 'findAllDeliveredPurchases', 'findAllWithdrawnTransfers',
	'findAllPurchaseArticles', 'findAllTransferArticles', 'findAllArticles', 'getDatedReport'
]);

class WarehouseEntriesStore extends Reflux.Store {
    constructor() {
        super();

        this.state = {
			company: config.company,

			selectedItem: null,
			list: { columns: [], rows: [] },

			listStatus: 'loading', // loading, ready, error
			viewerStatus: 'ready', // loading, ready, error
		}

		this.listenables = WarehouseEntriesActions;
	}

	onFindAll() {
		let auth = localStorage.getItem('authorization');
		if(auth){
			this.setState({listStatus: 'loading'});
			api.inventory.warehouses.entries.findAll({company: this.state.company}, auth, (err, res)=>{
				if(err){
					this.setState({listStatus: 'error'});
				}else{
					res.entries.rows.forEach(entry=>{
						entry.transactionsTypeName = this.translateTypeName(entry.transactionsTypeName);
					});
					this.setState({list: res.entries, listStatus: 'ready'});
				}
			});
		}else{
			this.setState({listStatus: 'error'});
		}
	}

	onFindOne(entryCode) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			this.setState({viewerStatus: 'loading'});
			api.inventory.warehouses.entries.findOne({company: this.state.company, entryCode}, auth, (err, res)=>{
				if(err){
					this.setState({viewerStatus: 'error'});
				}else{
					res.entry.tTransactionsTypeName = this.translateTypeName(res.entry.transactionsTypeName);
					this.setState({selectedItem: res.entry, viewerStatus: 'ready'});
				}
			});	
		}else{
			this.setState({viewerStatus: 'error'});
		}
	}
	
	onInsertOne(data, callback) {
		let auth = localStorage.getItem('authorization');
		data.company = this.state.company;
		if(auth){
			api.inventory.warehouses.entries.insertOne(data, auth, callback);
		}else{
			callback({status: 500, response:{message: 'Acceso no autorizado'}});
		}
	}



	findAllWarehouses(callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			api.inventory.warehouses.findAll({company: this.state.company}, auth, callback);
		}else{
			callback({status: 500, response:{message: 'Acceso no autorizado'}});
		}
	}

	findAllDeliveredPurchases(callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			api.inventory.purchases.findAllDelivered({company: this.state.company}, auth, callback);
		}else{
			callback({status: 500, response:{message: 'Acceso no autorizado'}});
		}
	}

	findAllPurchaseArticles(purchaseCode, callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			api.inventory.purchases.findOneArticles({company: this.state.company, purchase: purchaseCode}, auth, callback);
		}else{
			this.setState({viewerStatus: 'error'});
		}
	}

	findAllWithdrawnTransfers(callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			api.inventory.transfers.findAllWithdrawn({company: this.state.company}, auth, callback);
		}else{
			callback({status: 500, response:{message: 'Acceso no autorizado'}});
		}
	}

	findAllTransferArticles(transferCode, callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			api.inventory.transfers.findOneArticles({company: this.state.company, transfer: transferCode}, auth, callback);
		}else{
			this.setState({viewerStatus: 'error'});
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
			api.inventory.reports.entries.getDatedReport(data, auth, callback);
		}else{
			callback({status: 500, response:{message: 'Acceso no autorizado'}});
		}
	}


	translateTypeName(value) {
		switch(value) {
			case 'purchases': return 'Compra';
			case 'transfers': return 'Transferencia';
			case 'custom': return 'Entrada';
			default: return 'Desconocido'
		}
	}
}

export { WarehouseEntriesActions, WarehouseEntriesStore }