import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import SelectedReferenceSearch from './SelectedReferenceSearch';
import ItemTypesReferenceSearch from './ItemTypesReferenceSearch';
import ReactSelect from 'react-select';

class ReferenceSearch extends Component {
  constructor(props){
    super(props);

    this.state = {
      items: [],
      fields: [],
      isLoading: true,
      selectedFilter: null,
      itemTypeSearch: this.props.itemTypeSearch,
      selectedItem: []
    };

    this.selectFilter = this._selectFilter.bind(this);
    this.updateSelectedItem = this._updateSelectedItem.bind(this);
  }

  componentDidMount(){
    let config = {
      retry: 1,
      retryDelay: 1000
    };

    axios.get(`/api/v2/${this.props.catalog}/${this.props.locale}/${this.props.itemType}`, config)
    .then(res => {
      this.setState({ items: res.data.items });
      this.setState({ fields: res.data.fields });
      this.setState({ isLoading: false });
    });

    // Retry failed requests
    axios.interceptors.response.use(undefined, (err) => {
      let config = err.config;

      if(!config || !config.retry) return Promise.reject(err);

      config.__retryCount = config.__retryCount || 0;

      if(config.__retryCount >= config.retry) {
        return Promise.reject(err);
      }

      config.__retryCount += 1;

      let backoff = new Promise(function(resolve) {
        setTimeout(function() {
          resolve();
        }, config.retryDelay || 1);
      });

      return backoff.then(function() {
        return axios(config);
      });
    });
  }

  _updateSelectedItem(newVal) {
    this.setState({ selectedItem: newVal });
  }

  _selectFilter(value){
    this.setState({ selectedFilter: value });

    if(typeof this.state.selectedFilter !== 'undefined' && this.state.selectedFilter === null) {
      this.setState({ itemTypeSearch: true });
    } else {
      this.setState({ itemTypeSearch: false });
    }
  }

  _getFilterOptions(){
    var optionsList = [];
    optionsList = this.state.fields.filter(field => (field.primary !== true && field.human_readable));

    optionsList = optionsList.map(field =>
      this._getJSONFilter(field)
    );

    return optionsList;
  }

  _isFilterDisabled() {
    if(typeof this.state.selectedItem !== 'undefined' && this.state.selectedItem.length > 0) {
       return true;
    }
    else {
      return false;
    }
  }

  _getJSONFilter(field) {
    if(!field.primary) return {value: field.slug, label: field.name};
  }

  renderSearch(){
    if (this.state.isLoading) return null;
    if (this.state.itemTypeSearch)
      return <ItemTypesReferenceSearch
                items={this.state.items}
                fields={this.state.fields}
                srcRef={this.props.srcRef}
                srcId={this.props.srcId}
                req={this.props.req} />
    else
      return <SelectedReferenceSearch
                updateSelectedItem={this.updateSelectedItem}
                isDisabled={this.state.selectedFilter}
                items={this.state.items}
                fields={this.state.fields}
                srcRef={this.props.srcRef}
                srcId={this.props.srcId}
                req={this.props.req} />
  }

  renderFilter(){
    return <ReactSelect className="single-reference-filter" isSearchable={false} isClearable={true} isDisabled={this._isFilterDisabled()} value={this.state.selectedFilter} onChange={this.selectFilter} options={this._getFilterOptions()} placeholder={this.props.filterPlaceholder}/>
  }

  render() {
    return (
      <div id={this.editorId} className="referenceSearch row">
        { this.state.isLoading && <div className="loader"></div> }
        <div className="col-md-8">{ this.renderSearch() }</div>
        <div className="col-md-4">{ this.renderFilter() }</div>
    </div>
    );
  }
}

export default ReferenceSearch;
