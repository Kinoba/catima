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

    this._generateDatePicker(this.dateTimeSearchRef, this.props.format);
    this._generateDatePicker(this.dateTimeSearchRef2, this.props.format);
    this._linkRangeDatepickers(this.dateTimeSearchRef, this.dateTimeSearchRef2);
  }

  _generateDatePicker(ref, format) {
    $(this.refs[ref]).datetimepicker({
      useCurrent: false,
      format: this.props.format,
      locale: this.props.locale
    });
  }

  _linkRangeDatepickers(ref1, ref2) {
    //TODO - Fix linked datetime pickers
    $(this.refs[ref1]).datetimepicker().on("dp.change", (e) => {
      $(this.refs[ref2]).data("DateTimePicker").minDate(e.date);
    });
    $(this.refs[ref2]).datetimepicker().on("dp.change", (e) => {
      $(this.refs[ref1]).data("DateTimePicker").maxDate(e.date);
    });
  }

  _updateDisableState(value) {
    if(typeof value !== 'undefined') {
      if(value === 'exact' || value === 'after' || value === 'before') {
        this.setState({ disabled: true });
      } else {
        this.setState({ disabled: false });
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
      <select className="form-control filter-condition" value={this.state.selectedCondition} onChange={this.selectCondition}>
      { this.props.selectCondition.map((item) => {
        return <option key={item.key} value={item.key}>{item.value}</option>
      })}
      </select>
  );
}

render() {
  return (
    <div className="datetime-search-container">
      <div>
          <div className="row">
            <div className="col-md-12"><label>Start date:</label></div>
          </div>

        <div className="row">
            <div className="col-md-7 d-inline-block">
              <DateTimeInput input="input1" inputRef={this.dateTimeSearchRef} datepicker={true} locale={this.props.locale}/>
              <a href={'#' + this.dateTimeCollapseId} data-toggle="collapse" aria-expanded="false" aria-controls={this.dateTimeCollapseId}><i className="fa fa-chevron-down"></i></a>
            </div>
            <div className="col-md-5 condition-input-container">
              <div className="col-md-12">{ this.props.selectCondition.length > 0 && this.renderSelectConditionElement() }</div>
            </div>
        </div>
      </div>

        <div className="collapse" id={this.dateTimeCollapseId}>
          <div className="row">
            <div className="col-md-12"><label>End date:</label></div>
          </div>
          <div className="row">
            <div className="col-md-12"><DateTimeInput input="input2" disabled={this.state.disabled} inputRef={this.dateTimeSearchRef2} datepicker={true} locale={this.props.locale}/></div>
          </div>
        </div>
    </div>
  );
}
}

export default DateTimeSearch;
