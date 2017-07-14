
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import React from 'react';

/****************************************************************************************/

class Home extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
		<div>
			<main>
				<div className="center-align">
					<img src="/images/tabletecbanner.jpg" alt="" className="responsive-img"/>
				</div>
			</main>
		</div>);
	}
}

export { Home }