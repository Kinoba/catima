import React, { Component } from 'react';
import ChoiceSetSearch from './ChoiceSetSearch';

class ChoiceSetSearchContainer extends Component {
  constructor(props){
    super(props);

    this.state = {
      componentsList: [],
      inputName: this.props.inputName.split("[default]"),
      srcId: this.props.srcId.split("_default_"),
      srcRef: this.props.srcRef.split("_default_"),
      selectConditionName: this.props.selectConditionName.split("[default]"),
      fieldConditionName: this.props.fieldConditionName.split("[default]")
    };

    this.addComponent = this._addComponent.bind(this);
    this.deleteComponent = this._deleteComponent.bind(this);
    this.updateComponentName = this._updateComponentName.bind(this);
  }

  componentDidMount(){
    const componentsList = this.state.componentsList;
    var id = 0;
    var item = {
      itemId: id,
      catalog: this.props.catalog,
      itemType: this.props.itemType,
      label: this.props.label,
      items: this.props.items,
      locale: this.props.locale,
      searchPlaceholder: this.props.searchPlaceholder,
      srcId: this._buildSrcId(),
      srcRef: this._buildSrcRef(),
      inputName: this._buildInputName(),
      selectConditionName: this._buildSelectConditionName(),
      selectCondition: this.props.selectCondition,
      multiple: this.props.multiple,
      fieldConditionName: this._buildFieldConditionName(),
      fieldConditionData: this.props.fieldConditionData,
      addComponent: this.addComponent,
      deleteComponent: this.deleteComponent,
      updateComponentName: this.updateComponentName
    };

    componentsList.push(item);

    this.setState({componentsList: componentsList});
  }

  _addComponent(itemId) {
    const componentsList = this.state.componentsList;

    var id = itemId + 1;
    var item = {
      itemId: id,
      catalog: this.props.catalog,
      itemType: this.props.itemType,
      label: this.props.label,
      items: this.props.items,
      locale: this.props.locale,
      searchPlaceholder: this.props.searchPlaceholder,
      srcId: this._buildSrcId(),
      srcRef: this._buildSrcRef(),
      inputName: this._buildInputName(),
      selectConditionName: this._buildSelectConditionName(),
      selectCondition: this.props.selectCondition,
      multiple: this.props.multiple,
      fieldConditionName: this._buildFieldConditionName(),
      fieldConditionData: this.props.fieldConditionData,
      addComponent: this.addComponent,
      deleteComponent: this.deleteComponent,
      updateComponentName: this.updateComponentName
    };

    componentsList.push(item);

    this.setState({componentsList: componentsList});
  }

  _deleteComponent(itemId) {
    var componentsList = this.state.componentsList;

    componentsList.forEach((ref, index) => {
      if(Object.keys(ref).length !== 0 && ref.itemId === itemId) {
        componentsList.splice(componentsList[index], 1);
      }
    });

    this.setState({componentsList: componentsList});
  }


  _updateComponentName(id, itemId) {
    const componentsList = this.state.componentsList;

    if(typeof id !== 'undefined' && id !== null) {
      componentsList.forEach((item) => {
        if(item.itemId === itemId) {
          item.srcId = this._buildSrcId(id);
          item.srcRef = this._buildSrcRef(id);
          item.selectConditionName = this._buildSelectConditionName(id);
          item.inputName = this._buildInputName(id);
          item.fieldConditionName = this._buildFieldConditionName(id);
        }
      });
    } else {
      componentsList.forEach((item) => {
        if(item.itemId === itemId) {
          item.srcId = this._buildSrcId();
          item.srcRef = this._buildSrcRef();
          item.selectConditionName = this._buildSelectConditionName();
          item.inputName = this._buildInputName();
          item.fieldConditionName = this._buildFieldConditionName();
        }
      });
    }

    this.setState({componentsList: componentsList});
  }

  _buildInputName(id) {
    if(typeof id !== 'undefined') {
      if(this.state.inputName.length === 2) {
        return this.state.inputName[0] + '[' + id + ']' + this.state.inputName[1];
      } else {
        return this.props.inputName;
      }
    } else {
      return this.state.inputName[0] + '[default]' + this.state.srcRef[1];
    }
  }

  _buildSrcRef(id) {
    if(typeof id !== 'undefined') {
      if(this.state.srcRef.length === 2) {
        return this.state.srcRef[0] + '_' + id + '_' + this.state.srcRef[1];
      } else {
        return this.props.srcRef;
      }
    } else {
      return this.state.srcRef[0] + '_default_' + this.state.srcRef[1];
    }
  }

  _buildSrcId(id) {
    if(typeof id !== 'undefined') {
      if(this.state.srcRef.length === 2) {
        return this.state.srcId[0] + '_' + id + '_' + this.state.srcId[1];
      } else {
        return this.props.srcId;
      }
    } else {
      return this.state.srcId[0] + '_default_' + this.state.srcRef[1];
    }
  }

  _buildSelectConditionName(id) {

    if(typeof id !== 'undefined') {
      if(this.state.selectConditionName.length === 2) {
        return this.state.selectConditionName[0] + '[' + id + ']' + this.state.selectConditionName[1];
      } else {
        return this.props.selectConditionName;
      }
    } else {
      return this.state.selectConditionName[0] + '[default]' + this.state.srcRef[1];
    }
  }

  _buildFieldConditionName(id) {
    if(typeof id !== 'undefined') {
      if(this.state.fieldConditionName.length === 2) {
        return this.state.fieldConditionName[0] + '[' + id + ']' + this.state.fieldConditionName[1];
      } else {
        return this.props.fieldConditionName;
      }
    } else {
      return this.state.fieldConditionName[0] + '[default]' + this.state.srcRef[1];
    }
  }

  renderComponent(item, index, list) {
    if(Object.keys(item).length > 0) {
      return (<div key={item.itemId} className="component-search-row row"><ChoiceSetSearch
      itemId={item.itemId}
      componentList={list}
      catalog={item.catalog}
      itemType={item.itemType}
      label={item.label}
      items={item.items}
      locale={item.locale}
      inputName={item.inputName}
      searchPlaceholder={item.searchPlaceholder}
      srcId={item.srcId}
      srcRef={item.srcRef}
      selectConditionName={item.selectConditionName}
      selectCondition={item.selectCondition}
      fieldConditionName={item.fieldConditionName}
      fieldConditionData={item.fieldConditionData}
      multiple={item.multiple}
      addComponent={item.addComponent}
      deleteComponent={item.deleteComponent}
      updateComponentName={item.updateComponentName}
      /></div>);
    }
  }

  renderComponentList() {
    const list = this.state.componentsList;
    return this.state.componentsList.map((item, index, list) => this.renderComponent(item, index, list));
  }

  render() {
    return (
      <div>
      {this.renderComponentList()}
      </div>
    );
  }
}

export default ChoiceSetSearchContainer;
