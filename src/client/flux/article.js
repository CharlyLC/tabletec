
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import Reflux from 'reflux';

import api from '../cloudtrade-api';
import config from '../config';

/****************************************************************************************/

var ArticleActions = Reflux.createActions([
	'findAll', 'findOne', 'insertOne',
	'findAllBrands', 'findAllCategories'
]);

class ArticleStore extends Reflux.Store {
    constructor() {
        super();

        this.state = {
			company: config.company,

			selectedItem: null,
            list: { columns: [], rows: [] },

			listStatus: 'loading', // loading, ready, error
			viewerStatus: 'ready', // loading, ready, error
        }

        this.listenables = ArticleActions;
	}

	onFindAll() {
		let auth = localStorage.getItem('authorization');
		if(auth){
			this.setState({listStatus: 'loading'});
			api.inventory.articles.findAll({company: this.state.company}, auth, (err, res)=>{
				if(err){
					this.setState({listStatus: 'error'});
				}else{
					console.log(res);
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
}

export { ArticleActions, ArticleStore }