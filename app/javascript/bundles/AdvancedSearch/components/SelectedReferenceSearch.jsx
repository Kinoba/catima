import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactSelect from 'react-select';
import striptags from 'striptags';

class SelectedReferenceSearch extends Component {
  constructor(props){
    super(props);

<<<<<<< HEAD
<<<<<<< HEAD
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
=======
    // const v = document.getElementById(this.props.srcRef).value;
    // const selItem = this._load(v);

=======
>>>>>>> Add conditional rendering for reference advanced search component
    this.state = {
      selectedItem: []
    };

    this.referenceSearchId = `${this.props.srcRef}-editor`;
    this.filterId = `${this.props.srcRef}-filters`;
<<<<<<< HEAD
>>>>>>> Add React components for Reference advanced search
=======
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
>>>>>>> Add conditional rendering for reference advanced search component
  }

  _getItemOptions(){
    var optionsList = [];
    optionsList = this.props.items.map(item =>
      this._getJSONItem(item)
    );

    return optionsList;
  }

  _itemName(item){
<<<<<<< HEAD
<<<<<<< HEAD
    return striptags(item.default_display_name);
  }

=======
    //if(typeof this.state === 'undefined') return striptags(item.default_display_name);
    //if(typeof this.state !== 'undefined' && (this.state.selectedFilter === null || item[this.state.selectedFilter.value] === null || item[this.state.selectedFilter.value].length === 0)) return striptags(item.default_display_name);
    return striptags(item.default_display_name);
  }
  
>>>>>>> Add React components for Reference advanced search
=======
    return striptags(item.default_display_name);
  }

>>>>>>> Add conditional rendering for reference advanced search component
  _getJSONItem(item) {
    return {value: item.id, label: this._itemName(item)};
  }

  render() {
    return (
<<<<<<< HEAD
<<<<<<< HEAD
      <div>
        <ReactSelect id={this.referenceSearchId} isMulti name="colors" options={this._getItemOptions()} className="basic-multi-select" onChange={this.selectItem} classNamePrefix="select"/>
      </div>
=======
      <ReactSelect isMulti name="colors" options={this._getItemOptions()} className="basic-multi-select" classNamePrefix="select"/>
>>>>>>> Add React components for Reference advanced search
=======
      <div>
        <ReactSelect id={this.referenceSearchId} isMulti options={this._getItemOptions()} className="basic-multi-select" onChange={this.selectItem} classNamePrefix="select"/>
      </div>
>>>>>>> Add conditional rendering for reference advanced search component
    );
  }
}

export default SelectedReferenceSearch;
