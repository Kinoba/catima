import React, { Component } from 'react';
import ReferenceSearch from './ReferenceSearch';

class ReferenceSearchContainer extends Component {
  constructor(props){
    super(props);

    this.state = {
      referencesList: [],
      inputName: this.props.inputName.split("[0]"),
      referenceFilterName: this.props.referenceFilterName.split("[0]"),
      srcRef: this.props.srcRef.split("_0_"),
      selectConditionName: this.props.selectConditionName.split("[0]"),
      fieldConditionName: this.props.fieldConditionName.split("[0]")
    };

    this.addReferenceSearchComponent = this._addReferenceSearchComponent.bind(this);
    this.deleteReferenceSearchComponent = this._deleteReferenceSearchComponent.bind(this);
  }

  componentDidMount(){
      const referencesList = this.state.referencesList;
      var id = 0;
      var item = {
        referenceSearchItemId: id,
        catalog: this.props.catalog,
        parentItemType: this.props.parentItemType,
        itemType: this.props.itemType,
        field: this.props.field,
        locale: this.props.locale,
        inputName: this._buildInputName(id),
        referenceFilterName: this._buildReferenceFilterName(id),
        srcRef: this._buildSrcRef(id),
        itemTypeSearch: this.props.itemTypeSearch,
        selectConditionName: this._buildSelectConditionName(id),
        selectCondition: this.props.selectCondition,
        fieldConditionName: this._buildFieldConditionName(id),
        fieldConditionData: this.props.fieldConditionData,
        addReferenceSearchComponent: this.addReferenceSearchComponent,
        deleteReferenceSearchComponent: this.deleteReferenceSearchComponent,
      };

    referencesList.push(item);

    this.setState({referencesList: referencesList});
  }

  _addReferenceSearchComponent(itemId) {
    const referencesList = this.state.referencesList;

      /*referencesList.push(<div key={id} className="row reference-search-row"><ReferenceSearch
        referenceSearchItemId={id}
        catalog={this.props.catalog}
        parentItemType={this.props.parentItemType}
        itemType={this.props.itemType}
        field={this.props.field}
        locale={this.props.locale}
        inputName={this._buildInputName(id)}
        referenceFilterName={this._buildReferenceFilterName(id)}
        srcRef={this._buildSrcRef(id)}
        itemTypeSearch={this.props.itemTypeSearch}
        selectConditionName={this._buildSelectConditionName(id)}
        selectCondition={this.props.selectCondition}
        fieldConditionName={this._buildFieldConditionName(id)}
        fieldConditionData={this.props.fieldConditionData}
        addReferenceSearchComponent={this.addReferenceSearchComponent}
        deleteReferenceSearchComponent={this.deleteReferenceSearchComponent}
      /></div>);*/

      var id = itemId + 1;
      var item = {
        referenceSearchItemId: id,
        catalog: this.props.catalog,
        parentItemType: this.props.parentItemType,
        itemType: this.props.itemType,
        field: this.props.field,
        locale: this.props.locale,
        inputName: this._buildInputName(id),
        referenceFilterName: this._buildReferenceFilterName(id),
        srcRef: this._buildSrcRef(id),
        itemTypeSearch: this.props.itemTypeSearch,
        selectConditionName: this._buildSelectConditionName(id),
        selectCondition: this.props.selectCondition,
        fieldConditionName: this._buildFieldConditionName(id),
        fieldConditionData: this.props.fieldConditionData,
        addReferenceSearchComponent: this.addReferenceSearchComponent,
        deleteReferenceSearchComponent: this.deleteReferenceSearchComponent,
      };

    referencesList.push(item);

    this.setState({referencesList: referencesList});
  }

  _deleteReferenceSearchComponent(itemId) {
    var referencesList = this.state.referencesList;

    referencesList.forEach((ref, index) => {
      if(Object.keys(ref).length !== 0 && ref.referenceSearchItemId === itemId) {
        referencesList[index] = {};
      }
    });

    this.setState({referencesList: referencesList});
  }

  _buildInputName(id) {
    if(this.state.inputName.length === 2) {
      return this.state.inputName[0] + '[' + id + ']' + this.state.inputName[1];
    } else {
      return this.props.inputName;
    }
  }

  _buildReferenceFilterName(id) {
    if(this.state.referenceFilterName.length === 2) {
      return this.state.referenceFilterName[0] + '[' + id + ']' + this.state.referenceFilterName[1];
    } else {
      return this.props.referenceFilterName;
    }
  }

  _buildSrcRef(id) {
    if(this.state.srcRef.length === 2) {
      return this.state.srcRef[0] + '_' + id + '_' + this.state.srcRef[1];
    } else {
      return this.props.srcRef;
    }
  }

  _buildSelectConditionName(id) {
    if(this.state.selectConditionName.length === 2) {
      return this.state.selectConditionName[0] + '[' + id + ']' + this.state.selectConditionName[1];
    } else {
      return this.props.selectConditionName;
    }
  }

  _buildFieldConditionName(id) {
    if(this.state.fieldConditionName.length === 2) {
      return this.state.fieldConditionName[0] + '[' + id + ']' + this.state.fieldConditionName[1];
    } else {
      return this.props.fieldConditionName;
    }
  }

  renderReferenceElement(item, index, length) {
    if(Object.keys(item).length > 0) {
      return (<div className="reference-search-row row"><ReferenceSearch
        key={item.referenceSearchItemId}
        referenceSearchItemId={item.referenceSearchItemId}
        referenceListLength={length}
        catalog={item.catalog}
        parentItemType={item.parentItemType}
        itemType={item.itemType}
        field={item.field}
        locale={item.locale}
        inputName={item.inputName}
        referenceFilterName={item.referenceFilterName}
        srcRef={item.srcRef}
        itemTypeSearch={item.itemTypeSearch}
        selectConditionName={item.selectConditionName}
        selectCondition={item.selectCondition}
        fieldConditionName={item.fieldConditionName}
        fieldConditionData={item.fieldConditionData}
        addReferenceSearchComponent={item.addReferenceSearchComponent}
        deleteReferenceSearchComponent={item.deleteReferenceSearchComponent}
      /></div>);
    }
  }

  renderReferencesList() {
    const listLength = this.state.referencesList.length;
    return this.state.referencesList.map((item, index, length) => this.renderReferenceElement(item, index, listLength));
  }

  render() {
    return (
      <div id="referenceSearchContainer">
        {this.renderReferencesList()}
      </div>
    );
  }
}

export default ReferenceSearchContainer;
