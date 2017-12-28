
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Victor Bedoya.
	For conditions of distribution and use, see copyright notice in LICENSE

/****************************************************************************************/

import React from 'react';

/****************************************************************************************/

module.exports = class ItemProperty extends React.Component {
	constructor(props) {
        super(props);
    }

	render() {
		return(
		<div className={this.props.className}>
			<h6 style={{fontWeight: 'bold', fontSize: '1rem'}}>{ this.props.name + ':'}</h6>
			<div style={{paddingLeft: '1rem'}}>
				<span>{ this.props.value }</span>
			</div>
		</div>)
	}
}
