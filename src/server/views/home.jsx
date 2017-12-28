
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
				<title>TableTec - Principal</title>

				<meta name="viewport" content="width=device-width, user-scalable=yes, initial-scale=1, maximum-scale=1"/>
				<meta name="theme-color" content="#212121"/>
				<meta name="description" content="Empresa dedicada a la comercialización de tableros melaminicos, aglomerados, multilaminados , MDF y todo insumos para la fabricación de muebles"/>

				<meta property="og:title" content="Página de inicio - TableTec" />
				<meta property="og:url" content="http://www.tabletec.ml/" />
				<meta property="og:description" content="Empresa dedicada a la comercialización de todo insumos para la fabricación de muebles" />
				<meta property="og:image" content="/images/tabletec-banner-300x200.png" />
				<meta property="og:type" content="article" />
				<meta property="og:locale" content="es_ES" />

				<link rel="icon" href="/images/tabletec-icon.png"/>
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