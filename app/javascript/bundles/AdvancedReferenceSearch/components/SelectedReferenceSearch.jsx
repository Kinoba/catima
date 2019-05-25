import AsyncPaginate from 'react-select-async-paginate';
import axios from 'axios';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import striptags from 'striptags';

class SelectedReferenceSearch extends Component {
  constructor(props){
    super(props);

    this.state = {
      items: [],
      options: [],
      selectedItem: [],
      hiddenInputValue: []
    };

    this.referenceSearchId = `${this.props.srcRef}-editor`;
    this.filterId = `${this.props.srcRef}-filters`;
    this.selectItem = this._selectItem.bind(this);
    this.loadOptions = this._loadOptions.bind(this);
    this.getItemOptions = this._getItemOptions.bind(this);
    this.state.items = this.props.items;
  }

  _save(){
    if(this.props.multi) {
      //this.state.selectedItem is an array
      if(this.state.selectedItem !== null && this.state.selectedItem.length !== 0) {

        var idArray = [];
        this.state.selectedItem.forEach((item) => {
          idArray.push(item.value);
        });

        this.setState({ hiddenInputValue: idArray });

        document.getElementsByName(this.props.inputName)[0].value = this.state.hiddenInputValue;
      }
    } else {
      //this.state.selectedItem is a JSON
      if(this.state.selectedItem !== null && Object.keys(this.state.selectedItem).length !== 0) {

        this.setState({ hiddenInputValue: this.state.selectedItem.value });

        document.getElementsByName(this.props.inputName)[0].value = this.state.hiddenInputValue;
      }
    }


  }

  _selectItem(item, event){
    if(typeof event === 'undefined' || event.action !== "pop-value" || !this.props.req) {
      if(typeof item !== 'undefined') {
        this.setState({ selectedItem: item }, () => this._save());
      } else {
        this.setState({ selectedItem: [] }, () => this._save());
      }

      this.props.updateSelectedItem(item);
    }
  }

  _getItemOptions(items){
    var optionsList = [];

    if (typeof items !== 'undefined') {
      optionsList = items.map(item =>
        this._getJSONItem(item)
      );
    }

    return optionsList;
  }

  _itemName(item){
    return striptags(item.default_display_name);
  }

  _getJSONItem(item) {
    return {value: item.id, label: this._itemName(item)};
  }

  async _loadOptions(search, loadedOptions, { page }) {
    const response = await fetch(`${this.props.itemsUrl}&search=${search}&page=${page}`);
    const responseJSON = await response.json();

    return {
      options: this.getItemOptions(responseJSON.items),
      hasMore: responseJSON.hasMore,
      additional: {
        page: page + 1,
      },
    };
  }

  render() {
    return (
      <div>
        <AsyncPaginate
          id={this.referenceSearchId}
          name={this.props.inputName}
          delimiter=","
          isMulti={this.props.multiple}
          options={this.state.options}
          className="basic-multi-select"
          classNamePrefix="select"
          debounceTimeout={800}
          placeholder={this.props.searchPlaceholder}
          noOptionsMessage={this.props.noOptionsMessage}
          value={this.state.selectedItem}
          options={this.getItemOptions()}
          loadOptions={this.loadOptions}
          onChange={this.selectItem}
          additional={{
            page: 1,
          }}
        />
      </div>
    );
  }
}

export default SelectedReferenceSearch;
