import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactSelect from 'react-select';
import striptags from 'striptags';

class ChoiceSetSearch extends Component {
  constructor(props){
    super(props);

    this.state = {
      selectedCondition: '',
      selectedItem: [],
      disabled: false,
      hiddenInputValue: []
    };

    this.choiceSetId = `${this.props.srcId}-datetime`;
    this.choiceSetRef = `${this.props.srcRef}-datetime`;
    this.selectItem = this._selectItem.bind(this);
    this.selectCondition = this._selectCondition.bind(this);
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

  _getItemOptions(){
    var optionsList = [];
    optionsList = this.props.items.map(item =>
      this._getJSONItem(item)
    );

    return optionsList;
  }

  _itemName(item){
    //TODO - check this for all props
    return item.short_name_translations.short_name_en;
  }

  _getJSONItem(item) {
    return {value: item.id, label: this._itemName(item)};
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

  renderChoiceSetElement(){
    return (
      <div>
        <ReactSelect id={this.choiceSetId} name={this.props.inputName} options={this._getItemOptions()} className="basic-multi-select" onChange={this.selectItem} classNamePrefix="select" placeholder={this.props.searchPlaceholder}/>
      </div>
    );
  }


  render() {
    return (
      <div className="choiceset-search-container row">
        <div className="col-md-7">
            { this.renderChoiceSetElement() }
        </div>
        <div className="col-md-5">
          { this.renderSelectConditionElement() }
        </div>
      </div>
    );
  }

}

export default ChoiceSetSearch;
