
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import React from 'react';
import Reflux from 'reflux';
import { Link } from 'react-router-dom';

import {Navbar} from '../components/navbar.jsx';
import {BrandLogo, BrandIcon} from '../components/brand.jsx';
import { AdminUserMenu } from '../components/user-menu.jsx';
import {Footer} from '../components/footer.jsx';

import { AccountActions, AccountStore } from '../flux/account';

/****************************************************************************************/

class ButtonAdmin extends React.Component {
	constructor(props) {
        super(props);
	}

	render() {
		return(
		<div className="col s6 m3 l3">
			<div  className="card " style={{color:'white',borderRadius:'10px 10px 10px 10px' }}>
				<div className="center aling #37474f blue-grey darken-3 white-text hoverable z-depth-3" style={{borderRadius:'10px 10px 10px 10px'}}>
					<div className=" waves-effect waves-block waves-light ">
						<Link to={this.props.to}>
							<i className="large material-icons " style={{color:'white', padding:'1.5rem 0rem 0rem 0rem'}}>{this.props.iconName}</i>
							<p className="white-text" style={{marginTop:'0rem'}}>
								<b>{this.props.text}</b>
							</p>
						</Link>
					</div>
				</div>
			</div>
		</div>)
	}
}

/****************************************************************************************/

class Admin extends Reflux.Component {
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
			if(err){
				window.location.replace('/login');
			}else{
				this.setState({signed: true});
			}
		});
	}

	render() {
		return (
		<div className="rs-body">
			<header>
				<Navbar brandIconComponent={BrandIcon} brandLogoComponent={BrandLogo}
					user={this.state.user} signin={this.state.signed} userMenuComponent={AdminUserMenu}/>
			</header>
			<main>
				{
					this.state.user ?
					<div className="container">
						<div className="row">
							<h5 className="center-align" style={{ textShadow:' 1px 1px 1px #999'}}><b>Menu Principal</b></h5>
						</div>
						<div className="row"> 
							<ButtonAdmin text="Inventarios" to={'/adm/inventarios'} iconName="work"/>	
							<ButtonAdmin text="Compras" to="" iconName="language"/>
							<ButtonAdmin text="Ventas" to="" iconName="shopping_cart"/>
							<ButtonAdmin text="Administracion" to="" iconName="settings"/>
						</div>
					</div> : null
				}
			</main>
			<Footer/>
		</div>);
	}
}

export {Admin}