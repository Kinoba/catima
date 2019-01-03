import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactSelect from 'react-select';
import striptags from 'striptags';
import LinkedCategoryInput from './LinkedCategoryInput';

class ChoiceSetSearch extends Component {
  constructor(props){
    super(props);

    this.state = {
      selectedCondition: '',
      selectedFieldCondition: '',
      selectedCategory: '',
      selectedItem: [],
      disabled: false,
      hiddenInputValue: []
    };

    this.choiceSetId = `${this.props.srcId}-datetime`;
    this.choiceSetRef = `${this.props.srcRef}-datetime`;
    this.selectItem = this._selectItem.bind(this);
    this.selectCondition = this._selectCondition.bind(this);
    this.selectFieldCondition = this._selectFieldCondition.bind(this);
    this.selectCategory = this._selectCategory.bind(this);
    this.addComponent = this._addComponent.bind(this);
    this.deleteComponent = this._deleteComponent.bind(this);
    this.updateSelectCondition = this._updateSelectCondition.bind(this);
  }

  componentDidMount(){
    if(typeof this.props.selectCondition !== 'undefined' && this.props.selectCondition.length !== 0) {
        this.setState({selectedCondition: this.props.selectCondition[0].key});
    }
  }

  _save(){
    if(this.state.selectedItem !== null) {
      this.setState({ hiddenInputValue: this.state.selectedItem });
      document.getElementsByName(this.props.inputName)[0].value = this.state.hiddenInputValue;
    }
  }

  _selectItem(item, event){
    if(typeof event === 'undefined' || event.action !== "pop-value" || !this.props.req) {
      if(typeof item !== 'undefined') {
        if(item.data.length === 0) {
          this.setState({ selectedCategory: '' });
        }
        this.setState({ selectedItem: item }, () => this._save());
      } else {
        this.setState({ selectedItem: [] }, () => this._save());
      }
    }
  }

  _selectCondition(event){
    if(typeof event === 'undefined' || event.action !== "pop-value" || !this.props.req) {
      if(typeof event !== 'undefined') {
        this.setState({ selectedCondition: event.target.value });
      } else {
        this.setState({ selectedCondition: '' });
      }
    }
  }

  _selectCategory(item, event){
    if(item !== null) {
      if(typeof event === 'undefined' || event.action !== "pop-value" || !this.props.req) {
        if(typeof event !== 'undefined') {
          this.setState({ selectedCategory: item.value });
        } else {
          this.setState({ selectedCategory: '' });
        }
      }
    } else {
      this.setState({ selectedCategory: '' });
    }
  }

  _selectFieldCondition(event){
    if(typeof event === 'undefined' || event.action !== "pop-value" || !this.props.req) {
      if(typeof event !== 'undefined') {
        this.setState({ selectedFieldCondition: event.target.value });
      } else {
        this.setState({ selectedFieldCondition: '' });
      }
    }
  }

  _getCategoryOptions(){
    var optionsList = [];
    optionsList = this.state.selectedItem.data.map(item =>
      this._getJSONCategory(item)
    );

    return optionsList;
  }

  _getJSONCategory(item) {
    return {value: item.slug, label: item.name_translations['name_' + this.props.locale], key: item.id};
  }

  _getItemOptions(){
    var optionsList = [];
    optionsList = this.props.items.map(item =>
      this._getJSONItem(item)
    );

    return optionsList;
  }

  _getJSONItem(item) {
    if(typeof item.category_data === 'undefined') {
      item.category_data = [];
    }
    return {value: item.key, label: item.value, data: item.category_data};
  }

  _addComponent() {
    this.props.addComponent(this.props.itemId);
  }

  _deleteComponent() {
    this.props.deleteComponent(this.props.itemId);
  }

  _updateSelectCondition(newVal) {
    if(this.state.selectedCondition === '' && newVal.length !== this.state.selectCondition.length) {
      this.setState({selectedCondition: newVal[0].key});
    }

    this.setState({ selectCondition: newVal });
  }

  renderSelectConditionElement(){
    return (
      <select className="form-control filter-condition" name={this.props.selectConditionName} value={this.state.selectedCondition} onChange={this.selectCondition}>
      { this.props.selectCondition.map((item) => {
        return <option key={item.key} value={item.key}>{item.value}</option>
      })}
      </select>
    );
  }

  renderFieldConditionElement(){
    return (
      <select className="form-control filter-condition" name={this.props.fieldConditionName} value={this.state.selectedFieldCondition} onChange={this.selectFieldCondition}>
      { this.props.fieldConditionData.map((item) => {
        return <option key={item.key} value={item.key}>{item.value}</option>
      })}
      </select>
    );
  }

  renderChoiceSetElement(){
    return (
      <div>
        <ReactSelect id={this.choiceSetId} name={this.props.inputName} options={this._getItemOptions()} className="basic-multi-select" onChange={this.selectItem} classNamePrefix="select" placeholder={this.props.searchPlaceholder}/>
      </div>
    );
  }

  renderChoiceSetItemCategory(){
    return (
        <ReactSelect name={this.props.categoryInputName} options={this._getCategoryOptions()} className="basic-multi-select" onChange={this.selectCategory} classNamePrefix="select" placeholder={this.props.searchPlaceholder} isClearable={true}/>
    );
  }

  renderLinkedCategoryElement(){
    return (
      <div>
        <LinkedCategoryInput
          catalog={this.props.catalog}
          locale={this.props.locale}
          itemType={this.props.itemType}
          inputName={this.props.linkedCategoryInputName}
          selectedChoiceSet={this.state.selectedItem.value}
          selectedCategory={this.state.selectedCategory}
          updateSelectCondition={this.updateSelectCondition}
        />
      </div>
    );
  }

  render() {
    return (
      <div className="col-md-12 choiceset-search-container">
        <div className="row component-search-row">
          <div className="col-md-2">
              { this.renderFieldConditionElement() }
          </div>
          <div>
            <div className="col-md-3">
                { this.renderChoiceSetElement() }
            </div>
            { (this.state.selectedItem.length !== 0 && this.state.selectedItem.data.length !== 0) &&
              <div className="col-md-2">
                { this.renderChoiceSetItemCategory() }
              </div>
            }
            { (this.state.selectedItem.length === 0 || this.state.selectedItem.data.length === 0) &&
              <div className="col-md-2">
                <ReactSelect name={this.props.categoryInputName} options={[]} className="basic-multi-select" onChange={this.selectCategory} classNamePrefix="select" placeholder={this.props.searchPlaceholder} isClearable={true} isDisabled={true}/>
              </div>
            }
          </div>
          { (this.props.itemId === this.props.componentList[0].itemId && this.props.componentList.length === 1) &&
          <div className="col-md-1 icon-container">
            <a type="button" onClick={this.addComponent}><i className="fa fa-plus"></i></a>
          </div>
          }
          { (((this.props.itemId !== this.props.componentList[0].itemId) && (this.props.itemId !== this.props.componentList[this.props.componentList.length - 1].itemId)) || (this.props.itemId === this.props.componentList[0].itemId && this.props.componentList.length > 1)) &&
          <div className="col-md-1 icon-container">
            <a type="button" onClick={this.deleteComponent}><i className="fa fa-trash"></i></a>
          </div>
          }
          { ((this.props.itemId === this.props.componentList[this.props.componentList.length - 1].itemId) && (this.props.itemId !== this.props.componentList[0].itemId)) &&
          <div className="col-md-1">
            <div className="row">
              <div className="col-md-12"><a type="button" onClick={this.addComponent}><i className="fa fa-plus"></i></a></div>
              <div className="col-md-12"><a type="button" onClick={this.deleteComponent}><i className="fa fa-trash"></i></a></div>
            </div>
          </div>
          }
          <div className="col-md-4">
            { this.renderSelectConditionElement() }
          </div>
        </div>
        { (this.state.selectedCategory !== '' && this.state.selectedItem.data.length !== 0) &&
        <div className="row component-search-row">
          <div className="col-md-offset-2 col-md-6">{ this.renderLinkedCategoryElement() }</div>
        </div>
        }
      </div>
    );
  }

}

export default ChoiceSetSearch;
