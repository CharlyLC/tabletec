
/****************************************************************************************

	Copyright (c) 2016-2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import React from 'react';
import ReactDOM from'react-dom';

/****************************************************************************************/

class Select extends React.Component {
	constructor(props) {
		super(props);
	}
	
	componentDidMount() {
		$(this.refs.inputField).on('change', ()=>{
			this.onChange();
		}).material_select();

		this.onChange();
	}

	componentDidUpdate() {
		let open = $(this.refs.inputField).data('open');
		$(this.refs.inputField).material_select();

		$(this.refs.inputField).data('open', open);

		this.onChange();
	}

	onFocus() {
		if(this.props.onFocus){
			this.props.onFocus();
		}
	}

	onChange() {
		if(this.props.onChange){
			this.props.onChange( $(this.refs.inputField).val() );
		}
	}

	render() {
		let nameField = this.props.nameField
		return(
		<div className={'input-field ' + this.props.className} onFocus={this.onFocus.bind(this)}>
			<select ref="inputField">
				<option disabled>{this.props.placeholder}</option>
				{
					this.props.options.map((opt, i)=>{
						return opt ? (<option value={opt[this.props.valueField]} key={i}>{opt[this.props.nameField]}</option>) : null
					})
				}
			</select>
			<label>{this.props.label}</label>
		</div>)
	}
}

module.exports = class SelectWraper extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			value: ''
		}
	}

	componentDidMount() {
		ReactDOM.render(
			<Select placeholder={this.props.placeholder} label={this.props.label}
				options={this.props.options}
				nameField={this.props.nameField}
				valueField={this.props.valueField}
				onChange={this.onChange.bind(this)}/>,
			this.refs.wraper);
	}

	componentWillReceiveProps(nextProps) {
		if(this.props.options !== nextProps.options){
			ReactDOM.render(<span></span>, this.refs.wraper); // Force update select
			
			ReactDOM.render(
				<Select placeholder={nextProps.placeholder} label={this.props.label}
					options={nextProps.options}
					nameField={nextProps.nameField}
					valueField={nextProps.valueField}
					onChange={this.onChange.bind(this)}/>,
				this.refs.wraper);
		}
	}

	onChange(v) {
		this.setState({value: v});
		if(this.props.onChange){
			this.props.onChange(v);
		}
	}

	value(v) {
		return this.state.value;
	}

	render() {
		return(<div ref="wraper" className={this.props.className}></div>);
	}
}
