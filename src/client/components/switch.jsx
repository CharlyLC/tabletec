
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import React from 'react';

/****************************************************************************************/

class Switch extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let match = (this.props.children && this.props.children.find) ?
		this.props.children.find((child)=>{
			return child.props.path === this.props.match;
		}) : this.props.children;

		return match ? match : null;
	}
}

class Case extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return(<div className={this.props.className}>{this.props.children}</div>)
	}
}

export { Switch, Case }
