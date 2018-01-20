
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import Reflux from 'reflux';

import api from '../cloudtrade-api';
import config from '../config';

/****************************************************************************************/

var WarehouseOutletsActions = Reflux.createActions([
	'findAll', 'findOne', 'insertOne',
	'findAllWarehouses', 'findAllApprovedTransfers', 'findAllTransferArticles','getDatedReport'
]);

class WarehouseOutletsStore extends Reflux.Store {
    constructor() {
        super();

        this.state = {
			company: config.company,

			list: { columns: [], rows: [] },
			listStatus: 'loading', // loading, ready, error

			selectedItem: null,
			viewerStatus: 'ready', // loading, ready, error
		}

		this.listenables = WarehouseOutletsActions;
	}

	findAll() {
		let auth = localStorage.getItem('authorization');
		if(auth){
			this.setState({listStatus: 'loading'});
			api.inventory.warehouses.outlets.findAll({company: this.state.company}, auth, (err, res)=>{
				if(err){
					this.setState({listStatus: 'error'});
				}else{
					res.outlets.rows.forEach(outlet=>{
						outlet.transactionsTypeName = this.translateTypeName(outlet.transactionsTypeName);
					});
					this.setState({list: res.outlets, listStatus: 'ready'});
				}
			});
		}else{
			this.setState({listStatus: 'error'});
		}
	}

	findOne(outletCode) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			this.setState({viewerStatus: 'loading'});
			api.inventory.warehouses.outlets.findOne({company: this.state.company, outletCode}, auth, (err, res)=>{
				if(err){
					this.setState({viewerStatus: 'error'});
				}else{
					res.outlet.tTransactionsTypeName = this.translateTypeName(res.outlet.transactionsTypeName);
					this.setState({selectedItem: res.outlet, viewerStatus: 'ready'});
				}
			});
		}else{
			this.setState({viewerStatus: 'error'});
		}
	}

	insertOne(data, callback) {
		let auth = localStorage.getItem('authorization');
		data.company = this.state.company;
		if(auth){
			api.inventory.warehouses.outlets.insertOne(data, auth, callback);
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

	findAllApprovedTransfers(callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			api.inventory.transfers.findAllApproved({company: this.state.company}, auth, callback);
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

	getDatedReport(data, callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			data.company = this.state.company;
			//api.inventory.reports.outlets.getDatedReport(data, auth, callback);
		}else{
			callback({status: 500, response:{message: 'Acceso no autorizado'}});
		}
	}

	translateTypeName(value) {
		switch(value) {
			case 'transfers': return 'Transferencia';
			case 'custom': return 'Salida';
			default: return 'Desconocido'
		}
	}
}

export { WarehouseOutletsActions, WarehouseOutletsStore }