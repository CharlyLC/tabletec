
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import React from 'react';
import Reflux from 'reflux';

import {Navbar} from '../components/navbar.jsx';
import {BrandLogo, BrandIcon} from '../components/brand.jsx';
import Sidenav from '../components/sidenav.jsx';
import { InventoryUserMenu } from '../components/user-menu.jsx';

import Alert from '../components/alert.jsx';
import Progress from'../components/progress.jsx';
import PropertySingle from '../components/property-single.jsx';
import SectionCard from '../components/section-card.jsx';
import SectionView from '../components/section-view.jsx';
import { Switch, Case } from '../components/switch.jsx';
import Table from '../components/table.jsx';

import { AccountActions, AccountStore } from '../flux/account';
import { InventoryActions, InventoryStore } from '../flux/inventory';
import { ArticleActions, ArticleStore } from '../flux/article';

/****************************************************************************************/

class Slider extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		$(this.refs.slider).slider();
	}

	render() {
		return (
		<div ref="slider" className="slider">
			<ul className="slides">
				{
					this.props.images.map((image, i)=>{
						return(
						<li key={i}>
							<div className="center-align">
								<img src={'data:image/png;base64,' + btoa(image)} className="responsive-img"/>
							</div>
						</li>)
					})
				}
			</ul>
		</div>
		)
	}
}

/****************************************************************************************/

class ArticleWelcome extends React.Component {
	constructor(props) {
		super(props);

		this.state = {}
	}

	render() {
		return(
		<SectionCard title="Bienvenido" iconName="library_books">
			<div style={{padding: '0rem 0.5rem 1rem 0.5rem'}}>
				<Alert type="info" text="Bienvenido a la página de administración de artículos."/>
			</div>
		</SectionCard>);
	}
}

class ArticleList extends Reflux.Component {
	constructor(props) {
        super(props);

		this.state = {}

		this.store = ArticleStore;
		this.storeKeys = ['list', 'listStatus'];

		this.dropdowOptions = [
			{
				text:'Insertar nuevo artículo',
				select: this.onDropdowOptionInsert.bind(this)
			},
			{
				text: 'Actualizar',
				select: this.onDropdowOptionUpdate.bind(this)
			}
		];
    }

	componentWillMount() {
		super.componentWillMount();

		ArticleActions.findAll();
	}

	onDropdowOptionInsert(item) {
		this.props.history.push(this.props.url + '/insertar/' + Randomstring.generate());
	}

	onDropdowOptionUpdate(item) {
		ArticleActions.findAll();
	}

	onSelectArticle(article) {
		this.props.history.push(this.props.url + '/ver/' + article.code);
	}

	render() {
		return(
		<SectionCard title="Lista de artículos" iconName="view_list"
			menuID="articlesList" menuItems={this.dropdowOptions}>

			<div style={{padding: '0rem 1rem'}}>
				<span>
					Lista de todos los artículos en la base de datos.
				</span>
			</div>

			<div style={{padding: '0rem 0.5rem'}}>
				<Switch match={this.state.listStatus}>
					<Case path="loading" className="center">
						<div className="row">
							<Progress type="indeterminate"/>
						</div>
					</Case>
					<Case path="ready">
						<Table columns={this.state.list.columns} rows={this.state.list.rows} filterBy="name"
							onSelectRow={this.onSelectArticle.bind(this)}/>
					</Case>
					<Case path="error">
						<Alert type="error" text="ERROR: No se pudo cargar la lista de artículos"/>
					</Case>
				</Switch>
			</div>
		</SectionCard>)
	}
}

class ArticleViewer extends Reflux.Component {
	constructor(props) {
        super(props);

		this.state = {}

		this.store = ArticleStore;
		this.storeKeys = ['selectedItem', 'viewerStatus'];

		this.dropdowOptions = [];
    }

	componentWillMount() {
		super.componentWillMount();

		if(this.props.articleCode){
			ArticleActions.findOne(this.props.articleCode);
		}
	}

	componentWillReceiveProps(nextProps) {
		if(this.props.articleCode !== nextProps.articleCode){
			if(nextProps.articleCode){
				ArticleActions.findOne(nextProps.articleCode);
			}
		}
	}

	render() {
		switch(this.state.viewerStatus){
		case 'ready':
			return this.state.selectedItem ? (
			<SectionCard title="Vista de artículo" iconName="library_books" menuID="articleViewer" menuItems={this.dropdowOptions}>
				<div style={{padding: '0rem 0.5rem 1rem 0.5rem'}}>
					<span>{this.state.selectedItem.name}</span>

					<div className="card" style={{paddingTop: '0.5rem'}}>
						{
							this.state.selectedItem.images[0] ?
							<Slider images={this.state.selectedItem.images}/>:
							<div className="center-align">
								<img className="responsive-img" style={{maxHeight: '20rem'}} src={'/images/noimage.png'}/>
							</div>
						}
						<div className="card-content" style={{padding: '1rem'}}>
							<h6 style={{fontWeight: 'bold'}}>{this.state.selectedItem.description}</h6>
						</div>
					</div>

					<PropertySingle name="Código" value={this.state.selectedItem.clientCode}/>
					<PropertySingle name="Nombre" value={this.state.selectedItem.name}/>
					<PropertySingle name="Marca" value={this.state.selectedItem.brand}/>
					<PropertySingle name="Categoría" value={this.state.selectedItem.category}/>
					{
						this.state.selectedItem.customFields ?
						this.state.selectedItem.customFields.map(function(field, i){
							return <PropertySingle key={i} name={field.name} value={field.value}/>
						}) : null
					}
					<PropertySingle name="Fecha de creación" value={this.state.selectedItem.creationDate}/>
					<PropertySingle name="Fecha de modificación" value={this.state.selectedItem.modifiedDate}/>
				</div>
			</SectionCard>) :
			(<SectionCard title="Vista de artículo" iconName="library_books">
				<p>Seleccione una elemento de la lista de artículos</p>
			</SectionCard>);
			
		case 'loading':
			return (
			<SectionCard title="Vista de artículo" iconName="library_books">
				<div className="row">
					<Progress type="indeterminate"/>
				</div>
			</SectionCard>);
		case 'error':
			return (
			<SectionCard title="Vista de artículo" iconName="library_books">
				<Alert type="error" text="ERROR: No se pudo cargar los datos del artículo"/>
			</SectionCard>);
		}
	}
}

/****************************************************************************************/

class AdmInventoryArticles extends Reflux.Component {
	constructor(props) {
        super(props);

		this.state = {
			signed: false
		}

		this.stores = [AccountStore, InventoryStore];
    }

	componentWillMount() {
		super.componentWillMount();

		this.url = '/adm/inventarios/articulos';

		AccountActions.authenticate((err, res)=>{
			if(err){
				this.props.history.push('/login');
			}else{
				InventoryActions.loadSideMenuItems();
				this.setState({signed: true});
			}
		});
	}

	render() {
		let action = this.props.match.params.action ? this.props.match.params.action : 'welcome';
		return this.state.user ? (
		<div>
			<header>
				<Sidenav user={this.state.user} items={this.state.sideMenuItems}/>
				<Navbar brandIconComponent={BrandIcon} brandLogoComponent={BrandLogo}
					useSideMenu={true}
					user={this.state.user} signin={this.state.signed} userMenuComponent={InventoryUserMenu}/>
			</header>
			<main>
				<div className="row no-margin" style={{backgroundColor: '#eeeeee'}}>
					<SectionView className="col s12 m6 l5"  >
						<Switch match={action}>
							<ArticleWelcome path="welcome"/>
							<ArticleViewer path="ver" url={this.url} history={this.props.history}
								articleCode={this.props.match.params.article}/>
						</Switch>
					</SectionView>
					<SectionView className="col s12 m6 l7">
						<ArticleList url={this.url} history={this.props.history}/>
					</SectionView>
				</div>
			</main>
		</div>) : null;
	}
}

export { AdmInventoryArticles }