
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
	'findAllPurchaseArticles', 'findAllTransferArticles'
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