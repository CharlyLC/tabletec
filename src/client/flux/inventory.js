
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import Reflux from 'reflux';

import api from '../cloudtrade-api';
import config from '../config';

/****************************************************************************************/

var InventoryActions = Reflux.createActions(['loadSideMenuItems', 'loadWarehouses', 'loadWarehouseArticles']);

class InventoryStore extends Reflux.Store {
    constructor() {
        super();

        this.state = {
			company: config.company,
			sideMenuItems: []
        }

        this.listenables = InventoryActions;
    }

	onLoadSideMenuItems() {
		var loadedData = [
			{text: 'Inicio', iconName: 'home', linkTo: '/adm/inventarios'},
			{text: 'Artículos', iconName: 'library_books', linkTo: '/adm/inventarios/articulos' },
			{
				text: 'Almacenes',
				iconName: 'store',
				subItems: [
					{
						text: 'Lista',
						iconName: 'view_list',
						linkTo: '/adm/inventarios/almacenes',
					},
					{
						text: 'Entradas',
						iconName: 'system_update_alt',
						linkTo: '/adm/inventarios/almacenes-entradas',
					},
					{
						text: 'Salidas',
						iconName: 'keyboard_tab',
						linkTo: '/adm/inventarios/almacenes-salidas',
					}
				]
			},
			{text: 'Proveedores', iconName: 'business', linkTo: '/adm/inventarios/proveedores' },
			{text: 'Compras', iconName: 'shopping_cart', linkTo: '/adm/inventarios/compras' },
			{text: 'Transeferencias', iconName: 'swap_horiz', linkTo: '/adm/inventarios/transferencias' }
		]

		this.setState({ sideMenuItems: loadedData });
	}

	onLoadWarehouses(callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			api.inventory.warehouses.findAll({company: this.state.company}, auth, callback);
		}else{
			callback({status: 500, response:{message: 'Acceso no autorizado'}});
		}
	}

	onLoadWarehouseArticles(warehouseCode,callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			api.inventory.warehouses.findAllArticlesFor({company:this.state.company, warehouse: warehouseCode} ,auth, callback);
		}else{
			callback({status: 500, response:{message: 'Acceso no autorizado'}});
		}
	}
}

export { InventoryActions, InventoryStore }
