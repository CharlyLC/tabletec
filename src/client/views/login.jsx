
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import React from 'react';
import Reflux from 'reflux';

import Input from '../components/input.jsx';
import Form from '../components/form.jsx';
import MessageModal from '../components/message-modal.jsx';

import { AccountActions, AccountStore } from '../flux/account';

/****************************************************************************************/

class StepPanel extends React.Component {
	constructor(props) {
        super(props);
    }

	render() {
		return(
		<div className="container">
			<div className="row">
				<div className="col s12 m8 l6 offset-m2 offset-l3" style={{padding: '0rem'}}>
					<div className="card">
						<div className="card-content" style={{padding: '1.4rem 2.4rem'}}>
						{
							this.props.children
						}
						</div>
					</div>
				</div>
			</div>
		</div>)
	}
}

class StepButton extends React.Component {
	constructor(props) {
        super(props);
    }

	render() {
		return(
		<button className="btn" type="submit" 
			style={{textTransform: 'none', backgroundColor: 'rgba(0, 0, 0, 0)', border: '0.05rem solid #0d47a1', color: '#0d47a1', boxShadow: '0rem 0rem'}}>
			{ this.props.children }
		</button>)
	}
}

class StepBrand extends React.Component {
	constructor(props) {
        super(props);
    }

	render() {
		return (
		<div className="grey darken-4 center" style={{padding: '1.5rem 0', marginBottom: '1rem'}}>
			<svg className="rs-brand-icon" height="64" width="64" viewBox="0 0 112 112" >
				<line x1="20" x2="20" y1="2" y2="110" style={{stroke: 'rgb(200,200,200)', strokeWidth: '3'}}/>
				<line x1="2" x2="44" y1="20" y2="20" style={{stroke: 'rgb(200,200,200)', strokeWidth: '3'}}/>
				<line x1="2" x2="96" y1="92" y2="92" style={{stroke: 'rgb(200,200,200)', strokeWidth: '3'}}/>
				<path d="M8 8 v24 h24 v-24 h-24 M44 62 v42 h42 v-42 h-42" fill="red"/>
				<path d="M8 44 v24 h24 v-24 h-24" fill="gray"/>
				<path d="M8 80 v24 h24 v-24 h-24 M44 8 v42 h42 v-42 h-42" fill="white"/>
			</svg>
			<span className="rs-brand-logo">
				TABLETEC
			</span>
		</div>)
	}
}

/****************************************************************************************/

class Login extends Reflux.Component {
	constructor(props) {
        super(props);

		this.state = {
			ready: false
		}

		this.stores = [AccountStore];

		this._formValidationRules = {
			rules: {
				userPass: { required: true },
				email: { required: true, email: true }
			},
			messages: {
				userPass: {
					required: 'Debes ingresar una contraseña'
				},
				email: {
					required: 'Debes ingresar un email',
					email: 'Por favor, introduzca una dirección email válida'
				}
			}
		}
	}

	componentWillMount() {
		super.componentWillMount();
		AccountActions.authenticate((err, res)=>{
			if(res && res.user){
				this.props.history.push('/');
			}else{
				this.setState({ready: true});
			}
		});
	}

	componentDidMount() {
		Materialize.updateTextFields();
	}

	componentDidUpdate() {
		Materialize.updateTextFields();
	}

	onFormSubmit() {
		let data = {
			email: this.refs.email.value(),
			password: this.refs.userPass.value()
		}

		this.refs.messageModal.show('sending');
		AccountActions.login(data, (err, res)=>{
			if(err){
				this.refs.messageModal.show({
					type: 'error', title: 'Error', message: 'ERROR ' + err.status + ' - ' + err.response.message
				});
			}else if(res && res.token){
				this.refs.messageModal.close();

				localStorage.setItem('authorization', res.token);
				this.props.history.push('/');
			}
		});
	}

	render() {
		return this.state.ready ? (
		<div>
			<header>
			</header>
			<main>
				<StepBrand/>
				<StepPanel>
					<div className="row center-align">
						<h5>Iniciar sesión</h5>
					</div>
					<Form rules={this._formValidationRules} onSubmit={this.onFormSubmit.bind(this)}>
						<div className="row">
							<Input ref="email" name="email" className="col s12" type="email"
								label="Email" placeholder="Ingresa tu email" iconName="email" required={true}/>
						</div>
						<div className="row">
							<Input ref="userPass" name="userPass" className="col s12" type="password"
								label="Ingresa tu contraseña" placeholder="Ingresa tu contraseña" iconName="lock" required={true}/>
						</div>
						<div className="row center-align" style={{margin: '0rem', paddingTop: '1rem'}}>
							<StepButton>
								Iniciar sesión
							</StepButton>
						</div>
					</Form>
				</StepPanel>
				<MessageModal ref="messageModal"/>
			</main>
		</div>) : null;
	}
}

export {Login}