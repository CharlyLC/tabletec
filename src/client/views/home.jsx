
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import React from 'react';
import Reflux from 'reflux';
import { Link } from 'react-router-dom';

import {Navbar} from '../components/navbar.jsx';
import {BrandLogo, BrandIcon} from '../components/brand.jsx';
import { HomeUserMenu } from '../components/user-menu.jsx';
import {Footer} from '../components/footer.jsx';

import { AccountActions, AccountStore } from '../flux/account';

/****************************************************************************************/

class Home extends Reflux.Component {
	constructor(props) {
		super(props);

		this.state = {
			signed: false
		}

		this.stores = [AccountStore];
	}

	componentWillMount() {
		super.componentWillMount();
		AccountActions.authenticate((err, res)=>{
			this.setState({signed: true});
		});
	}

	componentDidMount() {
    	$('.parallax').parallax();
    }

	render() {
		return (
		<div className="rs-body">
			<header>
				<Navbar brandIconComponent={BrandIcon} brandLogoComponent={BrandLogo}
					user={this.state.user} signin={this.state.signed} userMenuComponent={HomeUserMenu}/>
			</header>
			<main>
				<div className="center-align">
					<img src="/images/tabletec-banner.png" alt="" className="responsive-img"/>
				</div>

				<section>
					<div className="container">
						<div className="section">
							<div className="row">
								<div className="col s12 center">
									<h3><i className="mdi-content-send brown-text"></i></h3>
									<h5 style={{ textShadow:' 1px 1px 1px #999'}}>NOSOTROS</h5>
									<h6 className="center-align" >Somos una empresa dedicada a la comercialización de tableros melaminicos, aglomerados, multilaminados , MDF y todo insumos para la fabricación de muebles</h6>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section>
					<div className="parallax-container valign-wrapper">
						<div className="parallax">
							<img src="/images/tabletecImage1.jpg" alt=""/>
						</div>
					</div>
				</section>
			</main>
			
			<footer className="page-footer red darken-4">
				<div className="container">
					<div className="row">
						<div className="col s8 offset-s4">
							<h5 className="white-text" style={{ textShadow:' 1px 1px 1px #000'}}>Contáctanos</h5>
							<h6 className="grey-text text-lighten-4">Teléfono: 4 6441156</h6>
							<h6 className="grey-text text-lighten-4">Dirección: Av. German Busch # 738 Ciudad Sucre, Chuquisaca, Bolivia</h6>
							<h6 className="grey-text text-lighten-4">Messenger: @tabletecinsumosparaelmueble</h6>
						</div>
					</div>
				</div>
				<div className="footer-copyright">
					<div className="container">
						©2017 <a className="brown-text text-lighten-3" href="/">TableTec</a>. Todos los derechos reservados.
					</div>
				</div>
			</footer>
		</div>);
	}
}

export { Home }