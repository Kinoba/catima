import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import DateTimeInput from './DateTimeInput';
import $ from 'jquery';
import 'moment';
import 'eonasdan-bootstrap-datetimepicker';

class DateTimeSearch extends Component {
  constructor(props){
    super(props);

    this.state = {
      selectedCondition: '',
      startDateInputName: this.props.startDateInputName,
      endDateInputName: this.props.endDateInputName,
      startDateInputNameArray: this.props.startDateInputName.split("[exact]"),
      endDateInputNameArray: this.props.endDateInputName.split("[exact]"),
      disabled: false
    };

    this.dateTimeSearchId = `${this.props.srcId}-datetime`;
    this.dateTimeSearchRef = `${this.props.srcRef}-datetime`;
    this.dateTimeSearchRef2 = `${this.props.srcRef}-datetime2`;
    this.dateTimeCollapseId = `${this.props.srcId}-collapse`;

    this.selectCondition = this._selectCondition.bind(this);
  }

  componentDidMount(){
    if(typeof this.props.selectCondition !== 'undefined' && this.props.selectCondition.length !== 0) {
        this.setState({selectedCondition: this.props.selectCondition[0].key});
        this._updateDisableState(this.props.selectCondition[0].key);
    }
  }

  componentWillReceiveProps(nextProps) {
    if(typeof nextProps.disableInputByCondition !== 'undefined') {
        this._updateDisableState(nextProps.disableInputByCondition);
    }

    if (nextProps.startDateInputName !== this.state.startDateInputName) {
      this.setState({ startDateInputName: nextProps.startDateInputName });
    }

    if (nextProps.endDateInputName !== this.state.endDateInputName) {
      this.setState({ endDateInputName: nextProps.endDateInputName });
    }
  }

  _buildInputNameCondition(inputName, condition) {
      if(inputName.length === 2) {
        if (condition !== '') return inputName[0] + '[' + condition + ']' + inputName[1];
        else return inputName[0] + '[default]' + inputName[1];
      } else {
        return inputName;
      }
  }

  _linkRangeDatepickers(ref1, ref2, disabled) {
    if(!disabled) {
      $(this.refs[ref1].refs.hiddenInput).datetimepicker().on("dp.change", (e) => {
        $(this.refs[ref2].refs.hiddenInput).data("DateTimePicker").minDate(e.date);
      });
      $(this.refs[ref2].refs.hiddenInput).datetimepicker().on("dp.change", (e) => {
        $(this.refs[ref1].refs.hiddenInput).data("DateTimePicker").maxDate(e.date);
      });
    } else {
      $(this.refs[ref2].refs.hiddenInput).data("DateTimePicker").clear();
    }
  }

  _updateDisableState(value) {
    if(typeof value !== 'undefined') {
      if(value === 'exact' || value === 'after' || value === 'before') {
        this.setState({ disabled: true });
        $('#' + this.dateTimeCollapseId).slideUp();
        this._linkRangeDatepickers(this.dateTimeSearchRef, this.dateTimeSearchRef2, true);
      } else {
        this.setState({ disabled: false });
        $('#' + this.dateTimeCollapseId).slideDown();
        this._linkRangeDatepickers(this.dateTimeSearchRef, this.dateTimeSearchRef2, false);
      }
    }
  }

  _selectCondition(event){
    if(typeof event === 'undefined' || event.action !== "pop-value" || !this.props.req) {
      if(typeof event !== 'undefined') {
        this.setState({ startDateInputName: this._buildInputNameCondition(this.state.startDateInputNameArray, event.target.value)});
        this.setState({ endDateInputName: this._buildInputNameCondition(this.state.endDateInputNameArray, event.target.value)});
        this.setState({ selectedCondition: event.target.value });
        this._updateDisableState(event.target.value);
      } else {
        this.setState({ startDateInputName: this._buildInputNameCondition(this.state.startDateInputNameArray, 'exact')});
        this.setState({ endDateInputName: this._buildInputNameCondition(this.state.endDateInputNameArray, 'exact')});
        this.setState({ selectedCondition: '' });
        this._updateDisableState('');
      }
    }
  }

  renderSelectConditionElement(){
    return (
      <select className="form-control filter-condition" name={this.props.selectConditionName} value={this.state.selectedCondition} onChange={this.selectCondition}>
      { this.props.selectCondition.map((item) => {
        return <option key={item.key} value={item.key}>{item.value}</option>
      })}
      </select>
    );
  }

  renderDateTimeConditionElement(){
    return (
      <div className="row">
        <div className="col-md-7 d-inline-block">
          <DateTimeInput input={this.props.inputStart} inputName={this.state.startDateInputName} ref={this.dateTimeSearchRef} datepicker={true} locale={this.props.locale} format={this.props.format}/>
          <a href={'#' + this.dateTimeCollapseId} data-toggle="collapse" aria-expanded="false" aria-controls={this.dateTimeCollapseId}><i className="fa fa-chevron-down"></i></a>
        </div>
        <div className="col-md-5 condition-input-container">
          <div className="col-md-12">{ this.renderSelectConditionElement() }</div>
        </div>
      </div>
    );
  }

  renderDateTimeElement(){
    return (
      <div className="row">
        <div className="col-md-12 d-inline-block">
          <DateTimeInput input={this.props.inputStart} inputName={this.state.startDateInputName} ref={this.dateTimeSearchRef} datepicker={true} locale={this.props.locale} format={this.props.format}/>
          <a href={'#' + this.dateTimeCollapseId} data-toggle="collapse" aria-expanded="false" aria-controls={this.dateTimeCollapseId}><i className="fa fa-chevron-down"></i></a>
        </div>
      </div>
    );
  }


  render() {
    return (
      <div className="datetime-search-container">
        <div>
            <div className="row">
              <div className="col-md-12"><label>{ this.props.startLabel }</label></div>
            </div>

            { this.props.selectCondition.length > 0 && this.renderDateTimeConditionElement() }
            { !(this.props.selectCondition.length > 0) && this.renderDateTimeElement() }
        </div>

          <div className="collapse" id={this.dateTimeCollapseId}>
            <div className="row">
              <div className="col-md-12"><label>{ this.props.endLabel }</label></div>
            </div>
            <div className="row">
              <div className="col-md-12"><DateTimeInput input={this.props.inputEnd} inputName={this.state.endDateInputName} disabled={this.state.disabled} ref={this.dateTimeSearchRef2} datepicker={true} locale={this.props.locale} format={this.props.format}/></div>
            </div>
          </div>
      </div>
    );
  }

}

export default DateTimeSearch;
