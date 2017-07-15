
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import React from 'react';

/****************************************************************************************/

class BrandLogo extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (<a>
			<span className="brand-logo rs-brand-logo">
				TABLETEC
			</span>
		</a>)
	}
}

class BrandIcon extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
		<a style={{padding: '12px 0'}}>
			<svg className="rs-brand-icon" height="32" width="32" viewBox="0 0 112 112" >
				{/*<line x1="20" x2="20" y1="2" y2="110" style={{stroke: 'rgb(200,200,200)', strokeWidth: '6'}}/>
				<line x1="2" x2="44" y1="20" y2="20" style={{stroke: 'rgb(200,200,200)', strokeWidth: '6'}}/>
				<line x1="2" x2="96" y1="92" y2="92" style={{stroke: 'rgb(200,200,200)', strokeWidth: '6'}}/>*/}
				<path d="M8 8 v24 h24 v-24 h-24 M44 62 v42 h42 v-42 h-42" fill="red"/>
				<path d="M8 44 v24 h24 v-24 h-24" fill="gray"/>
				<path d="M8 80 v24 h24 v-24 h-24 M44 8 v42 h42 v-42 h-42" fill="white"/>
			</svg>
		</a>)
	}
}

export {BrandLogo, BrandIcon}