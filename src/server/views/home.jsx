
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import React from 'react';

/****************************************************************************************/

class HomeView extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return(
		<html>
			<head>
				<meta name="viewport" content="width=device-width, user-scalable=yes, initial-scale=1, maximum-scale=1"/>
				<link href="http://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
				<link rel="stylesheet" type="text/css" href="/css/tabletec.min.css"/>
			</head>
			<body>
				<div id="app-main"></div>
				<script src="/js/tabletec.deps.min.js"/>
				<script src="/js/tabletec.min.js"/>
			</body>
		</html>)
	}
}

export {HomeView}