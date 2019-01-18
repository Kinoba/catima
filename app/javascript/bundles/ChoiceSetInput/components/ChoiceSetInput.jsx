import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Nestable from 'react-nestable';
import striptags from 'striptags';

class ChoiceSetInput extends Component {
  constructor(props){
    super(props);

    this.state = {
      componentsList: [],
      nextUniqueId: 0
    };

    this.renderItem = this.renderItem.bind(this);
    this.addComponent = this._addComponent.bind(this);
    this.updateComponentTree = this._updateComponentTree.bind(this);
  }

  componentDidMount(){
      this._initComponentList();
  }

  _initComponentList() {
      var componentsList = [];

      if(this.props.data.length === 0) {
          var itemId = 0;

          var component = {
              id: itemId,
              shortInput: {
                  shortInputName: this._buildShortInputName({}, this.state.componentsList.length, false),
                  srcShortId: this._buildShortSrcId({}, this.state.componentsList.length, false),
                  value: ''
              },
              longInput: {
                  longInputName: this._buildLongInputName({}, this.state.componentsList.length, false),
                  srcLongId: this._buildLongSrcId({}, this.state.componentsList.length, false),
                  value: ''
              },
              categoryInput: {
                  categoryInputName: this._buildCategoryInputName({}, this.state.componentsList.length, false),
                  srcCategoryId: this._buildCategorySrcId({}, this.state.componentsList.length, false),
                  value: '',
                  optionsData: []
              },
              children: []
          };


          componentsList.push(component);

          this.setState({nextUniqueId: component.id + 1});

      } else {
          var counter = 0;
          for(var i=0; i<this.props.data.length; i++) {
              var currentData = this.props.data[i];
              var newComponent = {
                  id: counter,
                  shortInput: {
                      shortInputName: this._buildShortInputName({}, i, false),
                      srcShortId: this._buildShortSrcId({}, i, false),
                      value: currentData.shortInput.value
                  },
                  longInput: {
                      longInputName: this._buildLongInputName({}, i, false),
                      srcLongId: this._buildLongSrcId({}, i, false),
                      value: currentData.longInput.value
                  },
                  categoryInput: {
                      categoryInputName: this._buildCategoryInputName({}, i, false),
                      srcCategoryId: this._buildCategorySrcId({}, i, false),
                      value: currentData.categoryInput.value,
                      optionsData: currentData.categoryInput.optionsData
                  },
                  children: []
              };

              counter++;

              if(currentData.children.length > 0) {
                  var returnEl = this._initChildren(newComponent, currentData.children, counter);
                  newComponent.children = returnEl.list;
                  counter = returnEl.counter;
              }


              componentsList.push(newComponent);
          }
      }

      this.setState({nextUniqueId: counter});
      this.setState({componentsList: componentsList});
  }

  _initChildren(parentComponent, childrenData, counter) {
      var childrenList = [];
      for(var i=0; i<childrenData.length; i++) {
          var currentData = childrenData[i];
          var newComponent = {
              id: counter,
              shortInput: {
                  shortInputName: this._buildShortInputName(parentComponent, i, true),
                  srcShortId: this._buildShortSrcId(parentComponent, i, true),
                  value: currentData.shortInput.value
              },
              longInput: {
                  longInputName: this._buildLongInputName(parentComponent, i, true),
                  srcLongId: this._buildLongSrcId(parentComponent, i, true),
                  value: currentData.longInput.value
              },
              categoryInput: {
                  categoryInputName: this._buildCategoryInputName(parentComponent, i, true),
                  srcCategoryId: this._buildCategorySrcId(parentComponent, i, true),
                  value: currentData.categoryInput.value,
                  optionsData: currentData.categoryInput.optionsData
              },
              children: []
          };

          counter++;

          if(currentData.children.length > 0) {
              var returnEl = this._initChildren(newComponent, currentData.children, counter);
              newComponent.children = returnEl.list;
              counter = returnEl.counter;
          }

          childrenList.push(newComponent);
      }

      return {list: childrenList, counter: counter};
  }

  _addComponent() {
      const itemId = this.state.nextUniqueId;

      var component = {
          id: itemId,
          shortInput: {
              shortInputName: this._buildShortInputName({}, this.state.componentsList.length, false),
              srcShortId: this._buildShortSrcId({}, this.state.componentsList.length, false),
              value: ''
          },
          longInput: {
              longInputName: this._buildLongInputName({}, this.state.componentsList.length, false),
              srcLongId: this._buildLongSrcId({}, this.state.componentsList.length, false),
              value: ''
          },
          categoryInput: {
              categoryInputName: this._buildCategoryInputName({}, this.state.componentsList.length, false),
              srcCategoryId: this._buildCategorySrcId({}, this.state.componentsList.length, false),
              value: '',
              optionsData: []
          },
          children: []
      };

      var componentsList = this.state.componentsList;
      componentsList.push(component);

      this.setState({nextUniqueId: component.id + 1});
      this.setState({componentsList: componentsList});
  }

  _addChildComponent(parentComponent) {
      const itemId = this.state.nextUniqueId;

      var childComponent = {
          id: itemId,
          shortInput: {
              shortInputName: this._buildShortInputName(parentComponent, parentComponent.children.length, true),
              srcShortId: this._buildShortSrcId(parentComponent, parentComponent.children.length, true),
              value: ''
          },
          longInput: {
              longInputName: this._buildLongInputName(parentComponent, parentComponent.children.length, true),
              srcLongId: this._buildLongSrcId(parentComponent, parentComponent.children.length, true),
              value: ''
          },
          categoryInput: {
              categoryInputName: this._buildCategoryInputName(parentComponent, parentComponent.children.length, true),
              srcCategoryId: this._buildCategorySrcId(parentComponent, parentComponent.children.length, true),
              value: '',
              optionsData: []
          },
          children: []
      };

      var componentsList = this.state.componentsList;

      var resultList = this._insertItemInTree(componentsList, parentComponent, childComponent);
      if(resultList !== null) {
          this.setState({nextUniqueId: childComponent.id + 1});
          this.setState({componentsList: resultList});
      }
  }

  _insertItemInTree(list, searchItem, itemToInsert) {
      for(var i = 0; i < list.length; i++) {
          var result = this._findById(list[i], searchItem.id);
          if(result){
              //Found the parent item
              if(typeof result.children !== 'undefined') {
                  result.children.push(itemToInsert);
              }
              return list;
          } else {
              //Search in the childrens
              var childrenResult = this._findById(list[i].children, searchItem.id);
              if(childrenResult){
                  //Found the parent item
                  if(typeof childrenResult.children !== 'undefined') {
                      childrenResult.children.push(itemToInsert);
                  }
                  return list;
              }
          }
      }

      return null;
  }

  _deleteComponent(parentComponent) {
     var componentsList = this.state.componentsList;

    var resultList = this._deleteItemFromTree(componentsList, parentComponent);
    if(resultList !== null) {
        this.setState({componentsList: resultList});
    }

      this.setState({componentsList: componentsList});
  }

  _deleteItemFromTree(list, searchItem) {
      for(var i = 0; i < list.length; i++) {
          var result = this._findById(list[i], searchItem.id);
          if(result) { //The item was found
              var index = list.indexOf(result);
              if(index > -1) {
                  list.splice(index, 1);
                  return list;
              } else {
                  //Search in childrens
                  return this._deleteItemFromTree(list[i].children, searchItem);
              }
          } else {
              //Search in the childrens
              var childrenResult = this._findById(list[i].children, searchItem.id);
              if(childrenResult) { //The item was found
                  var index = list[i].children.indexOf(childrenResult);
                  if(index > -1) {
                      list[i].children.splice(index, 1);
                      return list;
                  }
              }
          }
      }

      return null;
  }

  _findById(o, id) {
        //Early return
        if( o.id === id ){
          return o;
        }
        var result, p;
        for (p in o) {
            if( o.hasOwnProperty(p) && typeof o[p] === 'object' ) {
                result = this._findById(o[p], id);
                if(result){
                    //Found !
                    return result;
                }
            }
        }
        return result;
    }

  _buildShortInputName(parentComponent, position, children) {
      var shortInputName = '';

      if(children && (Object.keys(parentComponent).length !== 0)) {
          //Building a child-level name
          var nameArray = parentComponent.shortInput.shortInputName.split('[short_name');
          if(nameArray.length === 2) {
            shortInputName = nameArray[0] + '[' + position + '][short_name' + nameArray[1];
          } else {
            shortInputName = parentComponent.shortInput.shortInputName + '['+ position +']';
          }
      } else {
          //Building a top-level name
          var nameArray = this.props.shortInputName.split('[0]');
          if(nameArray.length === 2) {
            shortInputName = nameArray[0] + '[' + position + ']' + nameArray[1];
          } else {
            shortInputName = this.props.shortInputName;
          }
      }

      return shortInputName;
  }

  _buildShortSrcId(parentComponent, position, children) {
      var srcShortId = '';

      if(children && (Object.keys(parentComponent).length !== 0)) {
          //Building a child-level name
          var nameArray = parentComponent.shortInput.srcShortId.split('_short_name');
          if(nameArray.length === 2) {
            srcShortId = nameArray[0] + '_' + position + '_short_name' + nameArray[1];
          } else {
            srcShortId = parentComponent.shortInput.srcShortId + '_'+ position +'_';
          }
      } else {
          //Building a top-level name
          var nameArray = this.props.srcShortId.split('_0_');
          if(nameArray.length === 2) {
            srcShortId = nameArray[0] + '_' + position + '_' + nameArray[1];
          } else {
            srcShortId = this.props.srcShortId;
          }
      }

      return srcShortId;
  }

  _buildLongInputName(parentComponent, position, children) {
      var longInputName = '';

      if(children && (Object.keys(parentComponent).length !== 0)) {
          //Building a child-level name
          var nameArray = parentComponent.longInput.longInputName.split('[long_name');
          if(nameArray.length === 2) {
            longInputName = nameArray[0] + '[' + position + '][long_name' + nameArray[1];
          } else {
            longInputName = parentComponent.longInput.longInputName + '['+ position +']';
          }
      } else {
          //Building a top-level name
          var nameArray = this.props.longInputName.split('[0]');
          if(nameArray.length === 2) {
            longInputName = nameArray[0] + '[' + position + ']' + nameArray[1];
          } else {
            longInputName = this.props.longInputName;
          }
      }

      return longInputName;
  }

  _buildLongSrcId(parentComponent, position, children) {
      var srcLongId = '';

      if(children && (Object.keys(parentComponent).length !== 0)) {
          //Building a child-level name
          var nameArray = parentComponent.longInput.srcLongId.split('_long_name');
          if(nameArray.length === 2) {
            srcLongId = nameArray[0] + '_' + position + '_long_name' + nameArray[1];
          } else {
            srcLongId = parentComponent.longInput.srcLongId + '_'+ position +'_';
          }
      } else {
          //Building a top-level name
          var nameArray = this.props.srcLongId.split('_0_');
          if(nameArray.length === 2) {
            srcLongId = nameArray[0] + '_' + position + '_' + nameArray[1];
          } else {
            srcLongId = this.props.srcLongId;
          }
      }

      return srcLongId;
  }

  _buildCategoryInputName(parentComponent, position, children) {
      var categoryInputName = '';

      if(children && (Object.keys(parentComponent).length !== 0)) {
          //Building a child-level name
          var nameArray = parentComponent.categoryInput.categoryInputName.split('[category_name');
          if(nameArray.length === 2) {
            categoryInputName = nameArray[0] + '[' + position + '][category_name' + nameArray[1];
          } else {
            categoryInputName = parentComponent.categoryInput.categoryInputName + '['+ position +']';
          }
      } else {
          //Building a top-level name
          var nameArray = this.props.categoryInputName.split('[0]');
          if(nameArray.length === 2) {
            categoryInputName = nameArray[0] + '[' + position + ']' + nameArray[1];
          } else {
            categoryInputName = this.props.categoryInputName;
          }
      }

      return categoryInputName;
  }

  _buildCategorySrcId(parentComponent, position, children) {
      var srcCategoryId = '';

      if(children && (Object.keys(parentComponent).length !== 0)) {
          //Building a child-level name
          var nameArray = parentComponent.categoryInput.srcCategoryId.split('_category_name');
          if(nameArray.length === 2) {
            srcCategoryId = nameArray[0] + '_' + position + '_category_name' + nameArray[1];
          } else {
            srcCategoryId = parentComponent.categoryInput.srcCategoryId + '_'+ position +'_';
          }
      } else {
          //Building a top-level name
          var nameArray = this.props.srcCategoryId.split('_0_');
          if(nameArray.length === 2) {
            srcCategoryId = nameArray[0] + '_' + position + '_' + nameArray[1];
          } else {
            srcCategoryId = this.props.srcCategoryId;
          }
      }

      return srcCategoryId;
  }

  _getItemPositionInTree(list, searchItem) {
      var position = [];

      for(var i = 0; i < list.length; i++) {
          var result = this._findById(list[i], searchItem.id);
          if(result) { //The item was found
              var index = list.indexOf(result);
              if(index > -1) {
                  position.push(index);
                  return position;
              } else {
                  //Search in childrens
                  return this._deleteItemFromTree(list[i].children, searchItem);
              }
          } else {
              //Search in the childrens
              var childrenResult = this._findById(list[i].children, searchItem.id);
              if(childrenResult) { //The item was found
                  var index = list[i].children.indexOf(childrenResult);
                  if(index > -1) {
                      position.push(index);
                      return position;
                  }
              }
          }
      }

      return null;
  }

  _renameTreeComponents(list, parentComponent) {
      for(var i = 0; i < list.length; i++) {

          var component = list[i];
          if(parentComponent && Object.keys(parentComponent).length > 0) {
              var newComponent = {
                  id: component.id,
                  shortInput: {
                      shortInputName: this._buildShortInputName(parentComponent, i, true),
                      srcShortId: this._buildShortSrcId(parentComponent, i, true),
                      value: component.shortInput.value
                  },
                  longInput: {
                      longInputName: this._buildLongInputName(parentComponent, i, true),
                      srcLongId: this._buildLongSrcId(parentComponent, i, true),
                      value: component.longInput.value
                  },
                  categoryInput: {
                      categoryInputName: this._buildCategoryInputName(parentComponent, i, true),
                      srcCategoryId: this._buildCategorySrcId(parentComponent, i, true),
                      value: component.categoryInput.value,
                      optionsData: component.categoryInput.optionsData
                  },
                  children: component.children
              };
          } else {
              var newComponent = {
                  id: component.id,
                  shortInput: {
                      shortInputName: this._buildShortInputName({}, i, false),
                      srcShortId: this._buildShortSrcId({}, i, false),
                      value: component.shortInput.value
                  },
                  longInput: {
                      longInputName: this._buildLongInputName({}, i, false),
                      srcLongId: this._buildLongSrcId({}, i, false),
                      value: component.longInput.value
                  },
                  categoryInput: {
                      categoryInputName: this._buildCategoryInputName({}, i, false),
                      srcCategoryId: this._buildCategorySrcId({}, i, false),
                      value: component.categoryInput.value,
                      optionsData: component.categoryInput.optionsData
                  },
                  children: component.children
              };
          }

          if(newComponent.children.length > 0) {
            var newChildrenList = this._renameTreeComponents(newComponent.children, component);
            newComponent.children = newChildrenList;
          }

          list[i] = newComponent;
      }

      return list;
  }

  _updateComponentTree(list, component) {
     this.setState({componentsList: this._renameTreeComponents(list)});
  }

  _buildCategoryInputName(parentComponent, id, children) {
      var categoryInputName = '';

      if(children && (Object.keys(parentComponent).length !== 0)) {
          //Building a child-level name
          var nameArray = parentComponent.categoryInputName.split('[category_name');
          if(nameArray.length === 2) {
            categoryInputName = nameArray[0] + '[' + parentComponent.children.length + '][category_name' + nameArray[1];
          } else {
            categoryInputName = parentComponent.categoryInputName + '['+ id +']';
          }
      } else {
          //Building a top-level name
          var nameArray = this.props.categoryInputName.split('[0]');
          if(nameArray.length === 2) {
            categoryInputName = nameArray[0] + '[' + id + ']' + nameArray[1];
          } else {
            categoryInputName = this.props.categoryInputName;
          }
      }

      return categoryInputName;
  }

  _buildCategorySrcId(parentComponent, id, children) {
      var srcCategoryId = '';

      if(children && (Object.keys(parentComponent).length !== 0)) {
          //Building a child-level name
          var nameArray = parentComponent.srcCategoryId.split('_category_name');
          if(nameArray.length === 2) {
            srcCategoryId = nameArray[0] + '_' + parentComponent.children.length + '_category_name' + nameArray[1];
          } else {
            srcCategoryId = parentComponent.srcCategoryId + '_'+ id +'_';
          }
      } else {
          //Building a top-level name
          var nameArray = this.props.srcCategoryId.split('_0_');
          if(nameArray.length === 2) {
            srcCategoryId = nameArray[0] + '_' + id + '_' + nameArray[1];
          } else {
            srcCategoryId = this.props.srcCategoryId;
          }
      }

      return srcCategoryId;
  }

  renderItem({item}) {
    return (
      <div className="row nested-fields">
        <div className="col-md-3"><input id={item.shortInput.srcShortId} name={item.shortInput.shortInputName} defaultValue={item.shortInput.value} className="form-control" type="text"/></div>
        <div className="col-md-3"><input id={item.longInput.srcLongId} name={item.longInput.longInputName} defaultValue={item.longInput.value} className="form-control" type="text"/></div>
        <div className="col-md-3">
            <select id={item.categoryInput.srcCategoryId} className="form-control" name={item.categoryInput.categoryInputName} defaultValue={item.categoryInput.value} disabled={item.categoryInput.optionsData.length === 0}>
            { item.categoryInput.optionsData.map((item) => {
              return <option key={item.key} value={item.key}>{item.value}</option>
            })}
            </select>
        </div>
        <div className="col-md-2 pull-right">
            <a type="button" title={this.props.addChildrenChoiceLabel} onClick={() => this._addChildComponent(item)} className="btn"><i className="fa fa-plus-square"></i></a>
            <a type="button" title={this.props.removeChoiceLabel} onClick={() => this._deleteComponent(item)} className="btn"><i className="fa fa-trash"></i></a>
        </div>
      </div>
    );
  }

  renderCollapseIcon({ isCollapsed }) {
    return (
      <div>
        <i class="nestable-icon nestable-item-icon icon-minus-gray"></i>
      </div>
    );
  }

  renderCollapseIcon({ isCollapsed }) {
    return true;
  }

  render() {
    return (
      <div className="choiceset-input-container">
        <div className="row"><div className="col-md-12"><label>{ this.props.choiceNameLabel }</label></div></div>
        <div className="row">
          <div className="col-md-3"><label>{ this.props.shortNameLabel }</label></div>
          <div className="col-md-3"><label>{ this.props.longNameLabel }</label></div>
          <div className="col-md-3"><label>{ this.props.categoryNameLabel }</label></div>
          <div className="col-md-3"></div>
        </div>
        <Nestable
          items={[...this.state.componentsList]}
          renderItem={this.renderItem}
          renderCollapseIcon={this.renderCollapseIcon}
          onChange={this.updateComponentTree}
        />
        <div className="row">
          <div className="col-md-12"><a type="button" onClick={this.addComponent} className="btn"><i className="fa fa-plus-square"></i> {this.props.addChoiceLabel}</a></div>
        </div>
      </div>
    );
  }

}

export default ChoiceSetInput;
