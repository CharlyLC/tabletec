
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import Reflux from 'reflux';

import api from '../cloudtrade-api';
import config from '../config';

/****************************************************************************************/

var PurchasesActions = Reflux.createActions([
	'setCompany', 'findAllArticles', 'findAllProviders',
	'insertOne' , 'findAll', 'findOne', 'updateOneStatus'
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
}

export { PurchasesActions, PurchasesStore }