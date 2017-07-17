
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import React from 'react';

import {AdminView} from '../../views/admin.jsx';

/****************************************************************************************/

class AdminController {
	constructor() {
	}

	index(req, res) {
		res.render(<AdminView/>);
	}
}

export {AdminController}