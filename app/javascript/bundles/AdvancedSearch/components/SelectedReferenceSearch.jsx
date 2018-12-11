import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactSelect from 'react-select';
import striptags from 'striptags';

class SelectedReferenceSearch extends Component {
  constructor(props){
    super(props);

    this.state = {
      selectedItem: []
    };

    this.referenceSearchId = `${this.props.srcRef}-editor`;
    this.filterId = `${this.props.srcRef}-filters`;
    this.selectItem = this._selectItem.bind(this);
  }

  _selectItem(item, event){
    if(typeof event === 'undefined' || event.action !== "pop-value" || !this.props.req) {
      if(typeof item !== 'undefined') {
        this.setState({ selectedItem: item });
      } else {
        this.setState({ selectedItem: [] });
      }

      this.props.updateSelectedItem(item);
    }
  }

  _getItemOptions(){
    var optionsList = [];
    optionsList = this.props.items.map(item =>
      this._getJSONItem(item)
    );

    return optionsList;
  }

  _itemName(item){
    return striptags(item.default_display_name);
  }

  _getJSONItem(item) {
    return {value: item.id, label: this._itemName(item)};
  }

  _isDisabled() {
    if(typeof this.props.isDisabled !== 'undefined' && this.props.isDisabled === null) return false;
    return true;
  }

  render() {
    return (
      <div>
        <ReactSelect id={this.referenceSearchId} isMulti name="colors" options={this._getItemOptions()} className="basic-multi-select" onChange={this.selectItem} classNamePrefix="select"/>
      </div>
    );
  }
}

export default SelectedReferenceSearch;
