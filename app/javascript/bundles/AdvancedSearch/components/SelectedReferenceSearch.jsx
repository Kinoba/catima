import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactSelect from 'react-select';
import striptags from 'striptags';

class SelectedReferenceSearch extends Component {
  constructor(props){
    super(props);

    // const v = document.getElementById(this.props.srcRef).value;
    // const selItem = this._load(v);

    this.state = {
      // selectedItem: selItem,
      // selectedFilter: null
    };

    this.editorId = `${this.props.srcRef}-editor`;
    this.filterId = `${this.props.srcRef}-filters`;
  }

  _getItemOptions(){
    var optionsList = [];
    optionsList = this.props.items.map(item =>
      this._getJSONItem(item)
    );

    return optionsList;
  }

  _itemName(item){
    //if(typeof this.state === 'undefined') return striptags(item.default_display_name);
    //if(typeof this.state !== 'undefined' && (this.state.selectedFilter === null || item[this.state.selectedFilter.value] === null || item[this.state.selectedFilter.value].length === 0)) return striptags(item.default_display_name);
    return striptags(item.default_display_name);
  }
  
  _getJSONItem(item) {
    return {value: item.id, label: this._itemName(item)};
  }

  render() {
    return (
      <ReactSelect isMulti name="colors" options={this._getItemOptions()} className="basic-multi-select" classNamePrefix="select"/>
    );
  }
}

export default SelectedReferenceSearch;
