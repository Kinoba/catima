import React, { Component } from 'react';
import ReactDOM from 'react-dom';
<<<<<<< HEAD
<<<<<<< HEAD
import axios from 'axios';
=======
>>>>>>> Add React components for Reference advanced search
=======
import axios from 'axios';
>>>>>>> Improve reference advanced search component

class ItemTypesReferenceSearch extends Component {
  constructor(props){
    super(props);
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> Improve reference advanced search component

    this.state = {
      isLoading: true,
      inputType: 'Field::Text',
      inputData: null,
      inputOptions: null,
      selectedFilter: {},
      selectedItem: [],
      selectCondition: [],
      hiddenInputValue: []
    };

    this.referenceSearchId = `${this.props.srcId}-search`;
    this.referenceSearchRef = `${this.props.srcRef}-search`;
    this.selectItem = this._selectItem.bind(this);
  }

  componentWillReceiveProps(nextProps) {
  if (nextProps.selectedFilter !== this.state.selectedFilter) {
    this._getDataFromServer();
    this.setState({ selectedFilter: nextProps.selectedFilter });
  }
}

  componentDidMount(){
    this._getDataFromServer();
  }

  _save(){
    if(this.state.selectedItem !== null && this.state.selectedItem.length !== 0) {

      var idArray = [];
      this.state.selectedItem.forEach((item) => {
        idArray.push(item.value);
      });

      this.setState({ hiddenInputValue: idArray });

      document.getElementsByName(this.props.inputName)[0].value = this.state.hiddenInputValue;
    }
  }

  _selectItem(event){
    if(typeof event === 'undefined' || event.action !== "pop-value" || !this.props.req) {
      if(typeof item !== 'undefined') {
        this.setState({ selectedItem: event.target.value }, () => this._save());
      } else {
        this.setState({ selectedItem: [] }, () => this._save());
      }
    }
  }

  _getDataFromServer() {
    let config = {
      retry: 1,
      retryDelay: 1000
    };

    if (typeof this.props.field !== 'undefined') {
      this.props.selectedFilter.value = this.props.field;
    }
    axios.get(`/api/v2/${this.props.catalog}/${this.props.locale}/${this.props.itemType}/${this.props.selectedFilter.value}`, config)
    .then(res => {
      this._updateSelectCondition(res.data.selectCondition);
      this.setState({ inputType: res.data.inputType });
      this.setState({ inputData: res.data.inputData });
      this.setState({ inputOptions: res.data.inputOptions });
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

  _updateSelectCondition(array) {
    this.props.updateSelectCondition(array);
    this.setState({ selectCondition: array });
  }

  _getDateTimeFormat() {
    //TODO - search in input options for key format instead of accessing by position
    return this.state.inputOptions[0].format;
  }

  // TODO - adapt this portion of code when API call has been created
  renderInput(){
    if (this.state.isLoading) return null;
    if (this.state.inputType === 'Field::DateTime') {
      return <DateTimeSearch
                id={this.referenceSearchId}
                selectCondition={[]}
                catalog={this.props.catalog}
                itemType={this.props.itemType}
                inputName={this.props.inputName}
                isRange={true}
                format={this._getDateTimeFormat()}
                locale={this.props.locale}
                onChange={this.selectItem}
              />
    } else if (this.state.inputType === 'Field::Email') {
      return <input id={this.referenceSearchId} ref={this.referenceSearchRef} name={this.props.inputName} onChange={this.selectItem} type="email" className="form-control"/>
    } else if (this.state.inputType === 'Field::Int' || this.state.inputType === 'Field::Decimal') {
      return <input id={this.referenceSearchId} ref={this.referenceSearchRef} name={this.props.inputName} onChange={this.selectItem} type="number" className="form-control"/>
    } else if (this.state.inputType === 'Field::URL') {
      return <input id={this.referenceSearchId} ref={this.referenceSearchRef} name={this.props.inputName} onChange={this.selectItem} type="url" className="form-control"/>
    } else if (this.state.inputType === 'Field::ChoiceSet' || this.state.inputType === 'Field::Boolean') {
      return (
        <select id={this.referenceSearchId} ref={this.referenceSearchRef} name={this.props.inputName} onChange={this.selectItem} className="form-control">
          { this.state.inputData.map((item) => {
            return <option key={item.key}>{item.value}</option>
            })
          }
        </select>
      );
    } else {
      return <input id={this.referenceSearchId} ref={this.referenceSearchRef} name={this.props.inputName} onChange={this.selectItem} type="text" className="form-control"/>
    }
<<<<<<< HEAD
=======
>>>>>>> Add React components for Reference advanced search
=======
>>>>>>> Improve reference advanced search component
  }

  render() {
    return (
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> Improve reference advanced search component
      <div className="single-reference-container">
        { this.state.isLoading && <div className="loader"></div> }
        { this.renderInput() }
      </div>
<<<<<<< HEAD
=======
        <div>ItemTypesReferenceSearch</div>
>>>>>>> Add React components for Reference advanced search
=======
>>>>>>> Improve reference advanced search component
    );
  }
}

export default ItemTypesReferenceSearch;
