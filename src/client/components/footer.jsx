
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import React from 'react';

/****************************************************************************************/

class Footer extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
		<footer className="page-footer grey darken-4">
			<div className="footer-copyright">
				<div className="container">
					©2017 <a className="brown-text text-lighten-3" href="/">TableTec</a>. Todos los derechos reservados.
				</div>
			</div>
		</footer>);
	}
}

export {Footer}