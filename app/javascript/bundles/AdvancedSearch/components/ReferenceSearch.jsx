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
<<<<<<< HEAD
<<<<<<< HEAD
      selectedFilter: null,
      itemTypeSearch: this.props.itemTypeSearch,
      selectCondition: this.props.selectCondition,
      selectedItem: []
    };

    this.selectFilter = this._selectFilter.bind(this);
    this.updateSelectedItem = this._updateSelectedItem.bind(this);
=======
      searchPlaceholder: '',
      filterPlaceholder: '',
      selectedFilter: null
    };

    this.selectFilter = this._selectFilter.bind(this);
>>>>>>> Add React components for Reference advanced search
=======
      selectedFilter: null,
      itemTypeSearch: this.props.itemTypeSearch,
      selectedItem: []
    };

    this.selectFilter = this._selectFilter.bind(this);
    this.updateSelectedItem = this._updateSelectedItem.bind(this);
>>>>>>> Add conditional rendering for reference advanced search component
  }

  componentDidMount(){
    let config = {
      retry: 1,
      retryDelay: 1000
    };

    axios.get(`/api/v2/${this.props.catalog}/${this.props.locale}/${this.props.itemType}`, config)
    .then(res => {
<<<<<<< HEAD
<<<<<<< HEAD
=======
      this.setState({ searchPlaceholder: res.data.search_placeholder });
      this.setState({ filterPlaceholder: res.data.filter_placeholder });
>>>>>>> Add React components for Reference advanced search
=======
>>>>>>> Add conditional rendering for reference advanced search component
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

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> Add conditional rendering for reference advanced search component
  _updateSelectedItem(newVal) {
    this.setState({ selectedItem: newVal });
  }

  _updateSelectCondition(newVal) {
    this.setState({ selectCondition: newVal });
  }

  _selectFilter(value){
    this.setState({ selectedFilter: value });

<<<<<<< HEAD
<<<<<<< HEAD
    if(typeof value !== 'undefined' && value === null) {
      this.setState({ itemTypeSearch: false });
    } else {
      this.setState({ itemTypeSearch: true });
    }
=======
  _selectFilter(filter){
    this.setState({ selectedFilter: filter });
>>>>>>> Add React components for Reference advanced search
=======
    if(typeof this.state.selectedFilter !== 'undefined' && this.state.selectedFilter === null) {
      this.setState({ itemTypeSearch: true });
    } else {
=======
    if(typeof value !== 'undefined' && value === null) {
>>>>>>> Improve reference advanced search component
      this.setState({ itemTypeSearch: false });
    } else {
      this.setState({ itemTypeSearch: true });
    }
>>>>>>> Add conditional rendering for reference advanced search component
  }

  _getFilterOptions(){
    var optionsList = [];
    optionsList = this.state.fields.filter(field => (field.primary !== true && field.human_readable));

    optionsList = optionsList.map(field =>
      this._getJSONFilter(field)
    );

    return optionsList;
  }

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> Add conditional rendering for reference advanced search component
  _isFilterDisabled() {
    if(typeof this.state.selectedItem !== 'undefined' && this.state.selectedItem.length > 0) {
       return true;
    }
    else {
      return false;
    }
  }

<<<<<<< HEAD
=======
>>>>>>> Add React components for Reference advanced search
=======
>>>>>>> Add conditional rendering for reference advanced search component
  _getJSONFilter(field) {
    if(!field.primary) return {value: field.slug, label: field.name};
  }

  _getConditionOptions(){
    var optionsList = [];
    optionsList = this.state.selectCondition.map(item =>
      this._getJSONItem(item)
    );

    return optionsList;
  }

  renderSearch(){
    if (this.state.isLoading) return null;
<<<<<<< HEAD
<<<<<<< HEAD
    if (this.state.itemTypeSearch)
      return <ItemTypesReferenceSearch
                updateSelectCondition={this.updateSelectCondition}
                items={this.state.items}
                fields={this.state.fields}
                selectedFilter={this.state.selectedFilter}
                itemType={this.props.itemType}
=======
    if (this.props.itemTypeSearch)
      return <ItemTypesReferenceSearch
                items={this.state.items}
                fields={this.state.fields}
                searchPlaceholder={this.state.searchPlaceholder}
                filterPlaceholder={this.state.filterPlaceholder}
>>>>>>> Add React components for Reference advanced search
=======
    if (this.state.itemTypeSearch)
      return <ItemTypesReferenceSearch
                items={this.state.items}
                fields={this.state.fields}
<<<<<<< HEAD
>>>>>>> Add conditional rendering for reference advanced search component
=======
                selectedFilter={this.state.selectedFilter}
                itemType={this.props.itemType}
>>>>>>> Improve reference advanced search component
                srcRef={this.props.srcRef}
                srcId={this.props.srcId}
                req={this.props.req} />
    else
      return <SelectedReferenceSearch
<<<<<<< HEAD
<<<<<<< HEAD
                updateSelectedItem={this.updateSelectedItem}
                items={this.state.items}
                fields={this.state.fields}
=======
                items={this.state.items}
                fields={this.state.fields}
                searchPlaceholder={this.state.searchPlaceholder}
                filterPlaceholder={this.state.filterPlaceholder}
>>>>>>> Add React components for Reference advanced search
=======
                updateSelectedItem={this.updateSelectedItem}
                items={this.state.items}
                fields={this.state.fields}
>>>>>>> Add conditional rendering for reference advanced search component
                srcRef={this.props.srcRef}
                srcId={this.props.srcId}
                req={this.props.req} />
  }

  renderFilter(){
<<<<<<< HEAD
<<<<<<< HEAD
    return <ReactSelect className="single-reference-filter" isSearchable={false} isClearable={true} isDisabled={this._isFilterDisabled()} value={this.state.selectedFilter} onChange={this.selectFilter} options={this._getFilterOptions()} placeholder={this.props.filterPlaceholder}/>
=======
    return <ReactSelect className="single-reference-filter" isSearchable={false} isClearable={true} value={this.state.selectedFilter} onChange={this.selectFilter} options={this._getFilterOptions()} placeholder={this.props.filterPlaceholder}/>
>>>>>>> Add React components for Reference advanced search
=======
    return <ReactSelect className="single-reference-filter" isSearchable={false} isClearable={true} isDisabled={this._isFilterDisabled()} value={this.state.selectedFilter} onChange={this.selectFilter} options={this._getFilterOptions()} placeholder={this.props.filterPlaceholder}/>
>>>>>>> Add conditional rendering for reference advanced search component
  }

  renderSelectConditionElement(){
    return (
      <select className="form-control filter-condition" disabled={this._isFilterDisabled()}>
          { this.state.selectCondition.map((item) => {
              return <option key={item.key} value={item.key}>{item.value}</option>
            })
          }
        </select>
    );
  }

  render() {
    return (
      <div id={this.editorId} className="referenceSearch row">
<<<<<<< HEAD
<<<<<<< HEAD
        { this.state.isLoading && <div className="loader"></div> }
        <div className="col-md-8">{ this.renderSearch() }</div>
        <div className="col-md-4">{ this.renderFilter() }</div>
=======
      { this.state.isLoading && <div className="loader"></div> }
      <div className="col-md-8">{ this.renderSearch() }</div>
      <div className="col-md-4">{ this.renderFilter() }</div>
>>>>>>> Add React components for Reference advanced search
=======
        { this.state.isLoading && <div className="loader"></div> }
        <div className="col-md-8">{ this.renderSearch() }</div>
        <div className="col-md-4">{ this.renderFilter() }</div>
>>>>>>> Add conditional rendering for reference advanced search component
    </div>
    );
  }
}

export default ReferenceSearch;
