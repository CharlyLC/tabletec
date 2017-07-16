
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import Reflux from 'reflux';

import api from '../cloudtrade-api';
import config from '../config';

/****************************************************************************************/

var TransfersActions = Reflux.createActions([
	'findAll', 'findOne', 'insertOne', 'updateOneStatus',
	'findAllWarehouses', 'findAllArticlesFor'
]);

class TransfersStore extends Reflux.Store {
    constructor() {
		super();

        this.state = {
			company: config.company,

			listStatus : 'ready',
        	list : { columns: [], rows: [] },

			viewerStatus: 'ready', // loading, ready, error
			selectedItem: null,
		}

		this.listenables = TransfersActions;
	}

	findAll() {
		let auth = localStorage.getItem('authorization');
		if(auth){
			this.setState({listStatus: 'loading'});
			api.inventory.transfers.findAll({company: this.state.company}, auth, (err, res)=>{
				if(err){
					this.setState({listStatus: 'error'});
				}else{
					res.transfers.rows.forEach(transfer=>{
						transfer.status = this.translateStatus(transfer.status);
					});
					this.setState({list: res.transfers, listStatus: 'ready'});
				}
			});
		}else{
			this.setState({listStatus: 'error'});
		}
	}

	/********************* */

	translateStatus(value) {
		switch(value) { //created, approved, cancelled, delayed, delivered, joined
			case 'created': return 'Creado';
			case 'approved': return 'Aprobado';
			case 'cancelled': return 'Cancelado';
			case 'withdrawn': return 'Retirado del almacen de origen';
			case 'delayed': return 'Retrasado';
			case 'joined': return 'Depositado en almacén destino';
			default: return 'Desconocido'
		}
	}
}

export { TransfersActions, TransfersStore }