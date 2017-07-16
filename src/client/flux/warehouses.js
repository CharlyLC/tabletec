
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import Reflux from 'reflux';

import api from '../cloudtrade-api';
import config from '../config';

/****************************************************************************************/

var WarehousesActions = Reflux.createActions([
	'findAll', 'findOne', 'insertOne',
	'findAllCities',
	'getStockReport'
]);

class WarehousesStore extends Reflux.Store {
    constructor() {
        super();

		this.state = {
			company: config.company,

			selectedItem: null,
			list: { columns: [], rows: [] },

			listStatus: 'loading', // loading, ready, error
			viewerStatus: 'ready', // loading, ready, error
		}

		this.listenables = WarehousesActions;
	}

	onFindAll() {
		let auth = localStorage.getItem('authorization');
		if(auth){
			this.setState({listStatus: 'loading'});
			api.inventory.warehouses.findAll({company: this.state.company}, auth, (err, res)=>{
				if(err){
					this.setState({listStatus: 'error'});
				}else{
					this.setState({list: res.warehouses, listStatus: 'ready'});
				}
			});
		}else{
			this.setState({listStatus: 'error'});
		}
	}

	onFindOne(warehouseCode) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			this.setState({viewerStatus: 'loading'});
			api.inventory.warehouses.findOne({company: this.state.company, warehouse: warehouseCode}, auth, (err, res)=>{
				if(err){
					this.setState({viewerStatus: 'error'});
				}else{
					this.setState({selectedItem: res.warehouse, viewerStatus: 'ready'});
				}
			});
		}else{
			this.setState({viewerStatus: 'error'});
		}
	}

	/******* */
	getStockReport(warehouseCode, callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			api.inventory.warehouses.getStockReport({company: this.state.company, warehouse: warehouseCode}, auth, callback);
		}else{
			callback({status: 500, response:{message: 'Acceso no autorizado'}});
		}
	}
}

export { WarehousesActions, WarehousesStore }