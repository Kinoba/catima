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
    this.dateTimeCollapseId = `${this.props.srcId}-collapse`;
  }

  componentDidMount(){
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
    <div>
      <div>
          <div className="row">
            <div className="col-md-12"><label>Start date:</label></div>
          </div>

        <div className="row">
            <div className="col-md-8 d-inline-block">
              <DateTimeInput input="test" inputRef={this.dateTimeSearchRef} datepicker={true} locale={this.props.locale}/>
              <a href={'#' + this.dateTimeCollapseId} data-toggle="collapse" aria-expanded="false" aria-controls={this.dateTimeCollapseId}><i className="fa fa-chevron-down"></i></a>
            </div>
            <div className="col-md-4">
              { this.props.selectCondition.length > 0 && this.renderSelectConditionElement() }
            </div>
        </div>
      </div>

        <div className="collapse" id={this.dateTimeCollapseId}>
          <div className="row">
            <div className="col-md-12"><label>End date:</label></div>
          </div>
          <div className="row">
            <div className="col-md-8"><DateTimeInput input="test2" inputRef={this.dateTimeSearchRef2} datepicker={true} locale={this.props.locale}/></div>
            <div className="col-md-4">{ this.props.selectCondition.length > 0 && this.renderSelectConditionElement() }</div>
          </div>
        </div>
    </div>
  );
}
}

export default DateTimeSearch;
