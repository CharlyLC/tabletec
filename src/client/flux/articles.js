
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import Reflux from 'reflux';

import api from '../cloudtrade-api';
import config from '../config';

/****************************************************************************************/

var ArticlesActions = Reflux.createActions([
	'findAll', 'findOne', 'insertOne', 'updateOne',
	'findAllBrands', 'findAllCategories',
	'getStockReport'
]);

class ArticlesStore extends Reflux.Store {
    constructor() {
        super();

        this.state = {
			company: config.company,

			selectedItem: null,
            list: { columns: [], rows: [] },

			listStatus: 'loading', // loading, ready, error
			viewerStatus: 'ready', // loading, ready, error
        }

        this.listenables = ArticlesActions;
	}

	onFindAll() {
		let auth = localStorage.getItem('authorization');
		if(auth){
			this.setState({listStatus: 'loading'});
			api.inventory.articles.findAll({company: this.state.company}, auth, (err, res)=>{
				if(err){
					this.setState({listStatus: 'error'});
				}else{
					this.setState({list: res.articles, listStatus: 'ready'});
				}
			});
		}else{
			this.setState({listStatus: 'error'});
		}
	}

	onFindOne(articleCode) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			this.setState({viewerStatus: 'loading'});
			api.inventory.articles.findOne({company: this.state.company, article: articleCode}, auth, (err, res)=>{
				if(err){
					this.setState({viewerStatus: 'error'});
				}else{
					this.setState({selectedItem: res.article, viewerStatus: 'ready'});
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
			api.inventory.articles.insertOne(data, auth, callback);
		}else{
			callback({status: 500, response:{message: 'Acceso no autorizado'}});
		}
	}

	onUpdateOne(data, callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			data.company = this.state.company;
			api.inventory.articles.updateOne(data, auth, callback);
		}else{
			callback({status: 500, response:{message: 'Acceso no autorizado'}});
		}
	}
	
	findAllBrands(callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			api.inventory.articles.findAllBrands({company: this.state.company}, auth, callback);
		}else{
			callback({status: 500, response:{message: 'Acceso no autorizado'}});
		}
	}

	findAllCategories(callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			api.inventory.articles.findAllCategories({company: this.state.company}, auth, callback);
		}else{
			callback({status: 500, response:{message: 'Acceso no autorizado'}});
		}
	}

	getStockReport(articleCode, callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			api.inventory.reports.articles.getStockReport({company: this.state.company, article: articleCode}, auth, callback);
		}else{
			callback({status: 500, response:{message: 'Acceso no autorizado'}});
		}
	}
}

export { ArticlesActions, ArticlesStore }