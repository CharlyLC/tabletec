
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
	'findAllWarehouses', 'findAllApprovedTransfers', 'findAllTransferArticles'
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


	translateTypeName(value) {
		switch(value) {
			case 'transfers': return 'Transferencia';
			case 'custom': return 'Salida';
			default: return 'Desconocido'
		}
	}
}

export { WarehouseOutletsActions, WarehouseOutletsStore }