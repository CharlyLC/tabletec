
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import Reflux from 'reflux';

import api from '../cloudtrade-api';

/****************************************************************************************/

var AccountActions = Reflux.createActions([
	'login', 'logout', 'authenticate'
]);

class AccountStore extends Reflux.Store {
	constructor() {
		super();
		this.state = {
			user: null,
			company: 'tabletec'
		}
		this.listenables = AccountActions;
	}

	onLogin(data, callback) {
		data.company = this.state.company;
		api.account.loginWithCompany(data, callback);
	}

	onLogout(callback) {
		localStorage.removeItem('authorization');
		this.setState({ user: null });
		callback();
	}

	onAuthenticate(callback) {
		let auth = localStorage.getItem('authorization');
		if(auth){
			api.company.authenticate({company: this.state.company}, auth, (err, res)=>{
				if(err){
					this.setState({ user: null });
					callback(err);
				}else{
					this.setState({ user: res.user });
					callback(null, res);
				}
			});
		}else{
			callback({status: 401, response:{message: 'Acceso no autorizado'}});
		}
	}
}

export { AccountActions, AccountStore }
