
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
import CustomInputCollection from '../components/custom-input-collection.jsx';
import Fileupload from '../components/file-upload.jsx';
import Form from '../components/form.jsx';
import Input from '../components/input.jsx';
import MessageModal from '../components/message-modal.jsx';
import Progress from'../components/progress.jsx';
import PropertySingle from '../components/property-single.jsx';
import SectionCard from '../components/section-card.jsx';
import SectionView from '../components/section-view.jsx';
import { Switch, Case } from '../components/switch.jsx';
import Table from '../components/table.jsx';

import { AccountActions, AccountStore } from '../flux/account';
import { InventoryActions, InventoryStore } from '../flux/inventory';
import { ArticlesActions, ArticlesStore } from '../flux/articles';

import Tools from '../tools';
import config from '../config';

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

		this.store = ArticlesStore;
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

		ArticlesActions.findAll();
	}

	onDropdowOptionInsert(item) {
		this.props.history.push(this.props.url + '/insertar/' + Tools.makeid(32));
	}

	onDropdowOptionUpdate(item) {
		ArticlesActions.findAll();
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

		this.store = ArticlesStore;
		this.storeKeys = ['selectedItem', 'viewerStatus'];

		this.dropdowOptions = [];
    }

	componentWillMount() {
		super.componentWillMount();

		if(this.props.articleCode){
			ArticlesActions.findOne(this.props.articleCode);
		}
	}

	componentWillReceiveProps(nextProps) {
		if(this.props.articleCode !== nextProps.articleCode){
			if(nextProps.articleCode){
				ArticlesActions.findOne(nextProps.articleCode);
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
				<div style={{padding: '0rem 0.5rem 1rem 0.5rem'}}>
					<Alert type="info" text="Seleccione una elemento de la lista de artículos."/>
				</div>
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

class ArticleInsert extends Reflux.Component {
	constructor(props) {
        super(props);

		this.state = {
			brands: [],
			categories: []
		}

		this.stores = [ArticlesStore];

		this._formValidationRules = {
			rules: {
				articleCode: { required: true, minlength: 4 },
				articleName: { required: true, minlength: 6 },
				articleDescription: { required: true, minlength: 8 }
			},
			messages: {
				articleCode: {
					minlength: 'Debe escribir almenos 4 caracteres para el código de artículo'
				},
				articleName: {
					minlength: 'Debe escribir almenos 6 caracteres para el nombre de artículo'
				},
				articleDescription: {
					minlength: 'Debe escribir almenos 8 caracteres para descripción de artículo'
				}
			}
		}
    }

	componentWillMount() {
		super.componentWillMount();

		ArticlesActions.findAllBrands((err, res)=>{
			if(err){} else if(res){ this.setState({brands: res.brands}); }
		});
		ArticlesActions.findAllCategories((err, res)=>{
			if(err){} else if(res){ this.setState({categories: res.categories}); }
		});
	}

	componentDidMount() {
		Materialize.updateTextFields();

		this.onReadBarChange();
	}

	onFormSubmit(form) {
		var data = {
			clientCode: this.refs.articleCode.value(),
			barCode: this.refs.articleBarCode.value(),
			name: this.refs.articleName.value(),
			brand: this.refs.articleBrand.value(),
			category: this.refs.articleCategory.value(),
			description: this.refs.articleDescription.value,
			images: this.refs.articleImages.getUniqueNames().map(imgname=>{ return {code: imgname} }),
			customFields: this.refs.customFields.values()
		}

		this.refs.messageModal.show('sending');
		ArticlesActions.insertOne(data, (err, res)=>{
			if(err){
				this.refs.messageModal.show('save_error', 'Error: ' + err.status + ' <' + err.response.message + '>');
			}else{
				this.refs.messageModal.show('success_save');
			}
		});
	}

	onCustomFieldsChange() {
		this.refs.insertForm.revalidate();
	}

	onReadBarChange(checked) {
		var s = '';
		if(checked){
			this.refs.articleBarCode.enable();
		}else{
			s = makeid(32);
			this.refs.articleBarCode.disable();
		}
		this.refs.articleBarCode.value(s);
	}

	render() {
		let auth = localStorage.getItem('authorization');
		return(
		<SectionCard title="Insertar nuevo artículo" iconName="library_books">
			<div style={{padding: '0rem 1rem'}}>
				<span>Introduzca los datos para el nuevo artículo.</span>
			</div>

			<Form ref="insertForm" rules={this._formValidationRules} onSubmit={this.onFormSubmit.bind(this)}>
				<div>
					<h6 style={{fontWeight: 'bold', padding: '0rem 0.5rem'}}>Campos obligatorios</h6>

					<div className="row no-margin">
						<Input ref="articleCode" name="articleCode" className="col s6" type="text"
							label="Código *" placeholder="Código del artículo" required={true}/>
						<Input ref="articleBarCode" name="articleBarCode" className="col s6" type="text"
							label="Código de barras *" placeholder="Código de barras del artículo" required={true}/>
					</div>
					<div className="row no-margin">
						<Input ref="readBarCode" name="readBarCode" className="col s12" type="switch"
							label="Usar lector de código de barras" onChange={this.onReadBarChange.bind(this)}/>
					</div>
					<div className="row no-margin">
						<Input ref="articleName" name="articleName" type="text" label="Nombre *"
							className="col s12" placeholder="Ingrese el nombre del artículo" required={true}/>
					</div>
					<div className="row no-margin">
						<Input ref="articleBrand" name="articleBrand" className="col s6" type="autocomplete"
							label="Marca *" placeholder="Marca del artículo" required={true} options={{data: this.state.brands, key: 'name', minLength: 1}}/>
						<Input ref="articleCategory" name="articleCategory" className="col s6" type="autocomplete"
							label="Categoria *" placeholder="Categoria del artículo" required={true} options={{data: this.state.categories, key: 'name', minLength: 1}}/>
					</div>
					<div className="row no-margin">
						<div className="input-field col s12">
							<textarea ref="articleDescription" id="articleDescription" className="materialize-textarea" required data-length="10240" placeholder="Detalles de la descripción"/>
							<label htmlFor="articleDescription">{'Detalles de la descripción *'}</label>
						</div>
					</div>
				</div>
				<div>
					<h6 style={{fontWeight: 'bold', padding: '0rem 0.5rem'}}>Campos opcionales</h6>

					<div style={{padding: '0rem 0.8rem'}}>
						<span>Fotografías del artículo</span>
						<Fileupload ref="articleImages" headers={{'authorization': auth}}
							url={config.apiDomainURL + '/api/empresa/' + this.state.company + '/adm/inventarios/articulos/upload-image'}/>
					</div>
				</div>
				<div>
					<CustomInputCollection ref="customFields" onInsertOrDeleteField={this.onCustomFieldsChange.bind(this)}>
						<h6 style={{fontWeight: 'bold', padding: '0rem 0.5rem'}}>Campos personalizados</h6>
					</CustomInputCollection>
				</div>
				<div className="row">
					<h6 style={{fontWeight: 'bold', padding: '0rem 0.8rem'}}>Finalizar</h6>

					<div style={{padding: '0rem 0.5rem'}}>
						<button className="btn waves-effect waves-light col s12 red darken-2" type="submit"
							style={{textTransform: 'none', fontWeight: 'bold', marginBottom: '1rem'}}>
							Guardar datos
							<i className="material-icons right">send</i>
						</button>
					</div>
				</div>
			</Form>
			<MessageModal ref="messageModal"/>
		</SectionCard>);
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
							<ArticleInsert path="insertar"/>
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