import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import 'moment';
import 'eonasdan-bootstrap-datetimepicker';

class DateTimeSearch extends Component {
  constructor(props){
    super(props);

    this.state = {};

    this.dateTimeSearchId = `${this.props.srcId}-datetime`;
    this.dateTimeSearchRef = `${this.props.srcRef}-datetime`;
  }

  componentDidMount(){
    $(this.refs[this.dateTimeSearchRef]).datetimepicker();
  }

  renderDateTimeSearch(){
    return <input id={this.dateTimeSearchId} ref={this.dateTimeSearchRef} name={this.props.inputName} type="text" className="form-control"/>
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
            { this.renderDateTimeSearch() }
        </div>
        <div className="col-md-4">
          { this.renderSelectConditionElement() }
        </div>
      </div>
    );
  }
}

export default DateTimeSearch;
