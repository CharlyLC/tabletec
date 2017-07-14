
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
	}
}

export {WebRouter}