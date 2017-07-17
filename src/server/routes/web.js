
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import express from 'express';

import {HomeController} from '../app/web/home-controller';

/****************************************************************************************/

class WebRouter {
	constructor() {
		this.router = express.Router();

		this.controller = {
			home: new HomeController
		}

		this.router.get('/', this.controller.home.index.bind(this.controller.default));
		this.router.get('/login', this.controller.home.index.bind(this.controller.default));
		this.router.get('/adm', this.controller.home.index.bind(this.controller.default));
		this.router.get('/adm/inventarios', this.controller.home.index.bind(this.controller.default));
		this.router.get('/adm/inventarios/articulos/:action?/:article?', this.controller.home.index.bind(this.controller.default));
		this.router.get('/adm/inventarios/almacenes/:action?/:warehouse?', this.controller.home.index.bind(this.controller.default));
		this.router.get('/adm/inventarios/proveedores/:action?/:provider?', this.controller.home.index.bind(this.controller.default));
		this.router.get('/adm/inventarios/compras/:action?/:purchase?', this.controller.home.index.bind(this.controller.default));
		this.router.get('/adm/inventarios/transferencias/:action?/:transfer?', this.controller.home.index.bind(this.controller.default));
		this.router.get('/adm/inventarios/almacenes-entradas/:action?/:entry?', this.controller.home.index.bind(this.controller.default));
	}
}

export {WebRouter}