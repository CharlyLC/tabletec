
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import Reflux from 'reflux';

import api from '../cloudtrade-api';
import config from '../config';

/****************************************************************************************/

var ProviderActions = Reflux.createActions([
	'findAll', 'findOne', 'insertOne', 'updateOne',
	'findAllCities'
]);

class ProviderStore extends Reflux.Store {
    constructor() {
        super();

		this.state = {
			company: config.company,

			selectedItem: null,
            list: { columns: [], rows: [] },

			listStatus: 'loading', // ready, loading, error
			viewerStatus: 'ready',
        }

		this.listenables = ProviderActions;
	}

	onFindAll() {
		let auth = localStorage.getItem('authorization');
		if(auth){
			this.setState({listStatus: 'loading'});
			api.inventory.providers.findAll({company: this.state.company}, auth, (err, res)=>{
				if(err){
					this.setState({listStatus: 'error'});
				}else{
					this.setState({list: res.providers, listStatus: 'ready'});
				}
			});
		}else{
			this.setState({listStatus: 'error'});
		}
	}

	onFindOne(providerCode) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			this.setState({viewerStatus: 'loading'});
			api.inventory.providers.findOne({company: this.state.company, provider: providerCode}, auth, (err, res)=>{
				if(err){
					this.setState({viewerStatus: 'error'});
				}else{
					this.setState({selectedItem: res.provider, viewerStatus: 'ready'});
				}
			});
		}else{
			this.setState({viewerStatus: 'error'});
		}
	}
}

export { ProviderActions, ProviderStore }