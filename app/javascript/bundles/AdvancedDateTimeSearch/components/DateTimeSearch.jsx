import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import DateTimeInput from '../../DateTimeInput/components/DateTimeInput';
import $ from 'jquery';
import 'moment';
import 'eonasdan-bootstrap-datetimepicker';

class DateTimeSearch extends Component {
  constructor(props){
    super(props);

    this.state = {
      selectedCondition: '',
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
        this._linkRangeDatepickers(this.dateTimeSearchRef, this.dateTimeSearchRef2, true);
      } else {
        this.setState({ disabled: false });
        this._linkRangeDatepickers(this.dateTimeSearchRef, this.dateTimeSearchRef2, false);
      }
    }
  }

  _selectCondition(event){
    if(typeof event === 'undefined' || event.action !== "pop-value" || !this.props.req) {
      if(typeof event !== 'undefined') {
        this.setState({ selectedCondition: event.target.value });
        this._updateDisableState(event.target.value);
      } else {
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
          <DateTimeInput input="input1" inputName={this.props.startDateInputName} ref={this.dateTimeSearchRef} datepicker={true} locale={this.props.locale}/>
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
          <DateTimeInput input="input1" inputName={this.props.startDateInputName} ref={this.dateTimeSearchRef} inputRef={this.dateTimeSearchRef} datepicker={true} locale={this.props.locale}/>
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
              <div className="col-md-12"><DateTimeInput input="input2" inputName={this.props.endDateInputName} disabled={this.state.disabled} ref={this.dateTimeSearchRef2} datepicker={true} locale={this.props.locale}/></div>
            </div>
          </div>
      </div>
    );
  }

}

export default DateTimeSearch;
