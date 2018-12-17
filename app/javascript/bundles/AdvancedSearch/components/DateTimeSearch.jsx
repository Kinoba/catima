import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import DateTimeInput from '../../DateTimeInput/components/DateTimeInput';
import $ from 'jquery';
import 'moment';
import 'eonasdan-bootstrap-datetimepicker';

class DateTimeSearch extends Component {
  constructor(props){
    super(props);

    this.state = {};

    this.dateTimeSearchId = `${this.props.srcId}-datetime`;
    this.dateTimeSearchRef = `${this.props.srcRef}-datetime`;
    this.dateTimeSearchRef2 = `${this.props.srcRef}-datetime2`;
  }

  componentDidMount(){
    if(this.props.isRange) {
      this._generateDatePicker(this.dateTimeSearchRef, this.props.format);
      this._generateDatePicker(this.dateTimeSearchRef2, this.props.format);
      this._linkRangeDatepickers(this.dateTimeSearchRef, this.dateTimeSearchRef2);
    } else {
      this._generateDatePicker(this.dateTimeSearchRef, this.props.format);
    }
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

  renderDateTimeInputInterval(){
    return (
      <div ref={this.dateTimeSearchRef2} className="col-md-12">
        {this.props.isRange &&
          <label>End date:</label>
        }
        <DateTimeInput input="test2" inputRef={this.dateTimeSearchRef2} datepicker={true} locale={this.props.locale}/>
      </div>
      );
  }

  renderDateTimeInput(){
    // return <input id={this.dateTimeSearchId} ref={this.dateTimeSearchRef} data-language='fr-FR' name={this.props.inputName} type="text" className="form-control"/>
    return (
      <div ref={this.dateTimeSearchRef} className="col-md-12">
        {this.props.isRange &&
          <label>Start date:</label>
        }
        <DateTimeInput input="test" inputRef={this.dateTimeSearchRef} datepicker={true} locale={this.props.locale}/>
      </div>
      );
  }

  renderSelectConditionElement(){
    return (
      <select className="form-control filter-condition">
      { this.props.selectCondition.map((item) => {
        return <option key={item.key} value={item.key}>{item.value}</option>
      })
    }
    </select>
  );
}

render() {
  return (
    <div className="row">
    <div className="col-md-8">
      <div className="row">{ this.renderDateTimeInput() }</div>
      {this.props.isRange &&
        <div className="row">{ this.renderDateTimeInputInterval() }</div>
      }
    </div>
    <div className="col-md-4">
    { this.renderSelectConditionElement() }
    </div>
    </div>
  );
}
}

export default DateTimeSearch;
