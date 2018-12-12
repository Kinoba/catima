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
      items: [],
      fields: [],
      isLoading: true,
      inputType: 'Field::Text',
    };

    this.referenceSearchId = `${this.props.srcRef}-search`;
  }

  componentDidMount(){
    let config = {
      retry: 1,
      retryDelay: 1000
    };

    _updateSelectCondition(array) {
      this.props.updateSelectCondition(array);
    }

    // TODO - uncomment when API call has been developed
    /*axios.get(`/api/v2/${this.props.catalog}/${this.props.locale}/${this.props.itemType}/${this.props.selectFilter.value}`, config)
    .then(res => {
      this._updateSelectCondition(res.data.selectCondition);
      this.setState({ items: res.data.items });
      this.setState({ fields: res.data.fields });
      this.setState({ inputType: res.data.inputType });
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
    });*/
  }

  // TODO - adapt this portion of code when API call has been created
  renderInput(){
    if (this.state.inputType === 'Field::DateTime') {
      return <input id={this.referenceSearchId} type="text" className="form-control"/>
    } else if (this.state.inputType === 'Field::Email') {
      return <input id={this.referenceSearchId} type="email" className="form-control"/>
    } else if (this.state.inputType === 'Field::Int' || this.state.inputType === 'Field::Decimal') {
      return <input id={this.referenceSearchId} type="number" className="form-control"/>
    } else if (this.state.inputType === 'Field::URL') {
      return <input id={this.referenceSearchId} type="url" className="form-control"/>
    } else if (this.state.inputType === 'Field::ChoiceSet') {
      return (
        <select id={this.referenceSearchId} type="text" className="form-control">
          <option value="choice1" selected>Choice 1</option>
          <option value="choice2">Choice 2</option>
          <option value="choice3">Choice 3</option>
        </select>
      );
    } else if (this.state.inputType === 'Field::Boolean') {
      return (
        <select id={this.referenceSearchId} type="text" className="form-control">
          <option value="Oui" selected>Oui</option>
          <option value="Non">Non</option>
        </select>
      );
    } else {
      return <input id={this.referenceSearchId} type="text" className="form-control"/>
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
