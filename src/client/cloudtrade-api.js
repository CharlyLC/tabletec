
import request from 'superagent';

var domainURL = 'http://localhost:2000';

function stdResCallback(err, res, callback) {
	if(err){
		let status = err.status || 404,
			response = { message: 'Servicio o recurso no encontrado' };
		if(err.response){
			if(err.response.body){
				response = err.response.body
			}else if(err.response.text){
				response = { message: err.response.text }
			}
		}
		callback({status, response});
	}else{callback(null, res.body);}
}

var account = {
	loginWithCompany: function(data, callback){
		request
			.post(domainURL + '/api/cuenta/iniciar-con-empresa')
			.send(data)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	}
}

var company = {
	authenticate: function(data, authorization, callback){
		request
			.get(domainURL + '/api/empresa/' + data.company + '/autenticar')
			.set('authorization', authorization)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	},
}

var articles = {
	findAll: function(data, authorization, callback) {
		request
			.get(domainURL + '/api/empresa/' + data.company + '/adm/inventarios/articulos/listar')
			.set('authorization', authorization)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	},
}

var inventory = {
	articles: articles,
}

module.exports = {
	account: account,
	company: company,

	inventory: inventory
}
