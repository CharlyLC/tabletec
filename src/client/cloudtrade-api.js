
import request from 'superagent';
import config from './config';

var domainURL = config.apiDomainURL;

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
	findOne: function(data, authorization, callback) {
		request
			.get(domainURL + '/api/empresa/' + data.company + '/adm/inventarios/articulos/ver/' + data.article)
			.set('authorization', authorization)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	},
	insertOne: function(data, authorization, callback) {
		request
			.post(domainURL + '/api/empresa/' + data.company + '/adm/inventarios/articulos/insertar')
			.set('authorization', authorization)
			.send(data)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	},
	findAllBrands: function(data, authorization, callback) {
		request
			.get(domainURL + '/api/empresa/' + data.company + '/adm/inventarios/articulos/listar-marcas')
			.set('authorization', authorization)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	},
	findAllCategories: function(data, authorization, callback) {
		request
			.get(domainURL + '/api/empresa/' + data.company + '/adm/inventarios/articulos/listar-categorias')
			.set('authorization', authorization)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	}
}

var providers = {
	findAll: function(data, authorization, callback) {
		request
			.get(domainURL + '/api/empresa/' + data.company + '/adm/inventarios/proveedores/listar')
			.set('authorization', authorization)
			.end((err, res)=>{ stdResCallback(err, res, callback) });
	},
}

var inventory = {
	articles: articles,
	providers: providers,
}

module.exports = {
	account: account,
	company: company,

	inventory: inventory
}
