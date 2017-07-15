
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import React from 'react';
import { Link } from 'react-router-dom';

/****************************************************************************************/

class Navbar extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.updateMaterialComponents();
	}

	componentDidUpdate() {
		this.updateMaterialComponents();
	}

	updateMaterialComponents() {
		if(this.props.useSideMenu){
			$(this.refs.sideBtn).sideNav({
				menuWidth: 250, // Default is 300
				closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
				draggable: true // Choose whether you can drag to open on touch screens
			});
		}

		if(this.props.user){
			$(this.refs.userDropdown).dropdown({
				constrainWidth: false,
				alignment: 'right'
			});
		}
	}

	onOpenUserDropdown() {
		$(this.refs.userDropdown).dropdown('open');
	}

	render() {
		let BrandLogo = this.props.brandLogoComponent,
			BrandIcon = this.props.brandIconComponent,
			UserMenu = this.props.userMenuComponent;

		return(
		<div className="navbar-fixed">
			<nav>
				<div className={'nav-wrapper container'}>
					<ul className="left">
						{
							this.props.useSideMenu ?
							<li >
								<a style={{color: '#64ffda'}}>
									<i className="material-icons">menu</i>
								</a>
							</li>
							:
							null
						}
						{ BrandIcon ? <li><BrandIcon/></li>:null }
						{ BrandLogo ? <li><BrandLogo/></li>:null }
					</ul>

					<ul className="right">
						{
							this.props.user ?
							<li ref="userDropdown" className="dropdown-button" data-activates="navbarUserMenu"
								onClick={this.onOpenUserDropdown.bind(this)}>
								<a className="hide-on-large-only">
									<i className="material-icons">person</i>
								</a>
								<a className="hide-on-med-and-down">
									{this.props.user.name}
									<i className="material-icons right">arrow_drop_down</i>
								</a>
							</li>
							: (this.props.signin ?
								<li>
									<Link to="/login">
										<i className="material-icons right">input</i>
										<span className="hide-on-med-and-down">Inicie sesión</span>
									</Link>
								</li> : null)
							
						}
						{
							this.props.user ? <UserMenu/> : null
						}
					</ul>
				</div>
			</nav>
		</div>)
	}
}

export { Navbar }