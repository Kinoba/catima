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
      var itemId = 0;

      var component = {
          id: itemId,
          shortInputName: this._buildShortInputName({}, itemId, false),
          longInputName: this._buildLongInputName({}, itemId, false),
          categoryInputName: this._buildCategoryInputName({}, itemId, false),
          srcShortId: this._buildShortSrcId({}, itemId, false),
          srcLongId: this._buildLongSrcId({}, itemId, false),
          srcCategoryId: this._buildCategorySrcId({}, itemId, false),
          children: []
      };

      var componentsList = [];
      componentsList.push(component);

      this.setState({nextUniqueId: component.id + 1});
      this.setState({componentsList: componentsList});
  }

  _addComponent() {
      const itemId = this.state.nextUniqueId;
      var component = {
          id: itemId,
          shortInputName: this._buildShortInputName({}, itemId, false),
          longInputName: this._buildLongInputName({}, itemId, false),
          categoryInputName: this._buildCategoryInputName({}, itemId, false),
          srcShortId: this._buildShortSrcId({}, itemId, false),
          srcLongId: this._buildLongSrcId({}, itemId, false),
          srcCategoryId: this._buildCategorySrcId({}, itemId, false),
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
          shortInputName: this._buildShortInputName(parentComponent, itemId, true),
          longInputName: this._buildLongInputName(parentComponent, itemId, true),
          categoryInputName: this._buildCategoryInputName(parentComponent, itemId, true),
          srcShortId: this._buildShortSrcId(parentComponent, itemId, true),
          srcLongId: this._buildLongSrcId(parentComponent, itemId, true),
          srcCategoryId: this._buildCategorySrcId(parentComponent, itemId, true),
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

  _updateComponentTree(list) {
     this.setState({componentsList: list});
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

  _buildShortInputName(parentComponent, id, children) {
      var shortInputName = '';

      if(children && (Object.keys(parentComponent).length !== 0)) {
          //Building a child-level name
          var nameArray = parentComponent.shortInputName.split('[short_name');
          if(nameArray.length === 2) {
            shortInputName = nameArray[0] + '[' + parentComponent.children.length + '][short_name' + nameArray[1];
          } else {
            shortInputName = parentComponent.shortInputName + '['+ id +']';
          }
      } else {
          //Building a top-level name
          var nameArray = this.props.shortInputName.split('[0]');
          if(nameArray.length === 2) {
            shortInputName = nameArray[0] + '[' + id + ']' + nameArray[1];
          } else {
            shortInputName = this.props.shortInputName;
          }
      }

      return shortInputName;
  }

  _buildShortSrcId(parentComponent, id, children) {
      var srcShortId = '';

      if(children && (Object.keys(parentComponent).length !== 0)) {
          //Building a child-level name
          var nameArray = parentComponent.srcShortId.split('_short_name');
          if(nameArray.length === 2) {
            srcShortId = nameArray[0] + '_' + parentComponent.children.length + '_short_name' + nameArray[1];
          } else {
            srcShortId = parentComponent.srcShortId + '_'+ id +'_';
          }
      } else {
          //Building a top-level name
          var nameArray = this.props.srcShortId.split('_0_');
          if(nameArray.length === 2) {
            srcShortId = nameArray[0] + '_' + id + '_' + nameArray[1];
          } else {
            srcShortId = this.props.srcShortId;
          }
      }

      return srcShortId;
  }

  _buildLongInputName(parentComponent, id, children) {
      var longInputName = '';

      if(children && (Object.keys(parentComponent).length !== 0)) {
          //Building a child-level name
          var nameArray = parentComponent.longInputName.split('[long_name');
          if(nameArray.length === 2) {
            longInputName = nameArray[0] + '[' + parentComponent.children.length + '][long_name' + nameArray[1];
          } else {
            longInputName = parentComponent.longInputName + '['+ id +']';
          }
      } else {
          //Building a top-level name
          var nameArray = this.props.longInputName.split('[0]');
          if(nameArray.length === 2) {
            longInputName = nameArray[0] + '[' + id + ']' + nameArray[1];
          } else {
            longInputName = this.props.longInputName;
          }
      }

      return longInputName;
  }

  _buildLongSrcId(parentComponent, id, children) {
      var srcLongId = '';

      if(children && (Object.keys(parentComponent).length !== 0)) {
          //Building a child-level name
          var nameArray = parentComponent.srcLongId.split('_long_name');
          if(nameArray.length === 2) {
            srcLongId = nameArray[0] + '_' + parentComponent.children.length + '_long_name' + nameArray[1];
          } else {
            srcLongId = parentComponent.srcLongId + '_'+ id +'_';
          }
      } else {
          //Building a top-level name
          var nameArray = this.props.srcLongId.split('_0_');
          if(nameArray.length === 2) {
            srcLongId = nameArray[0] + '_' + id + '_' + nameArray[1];
          } else {
            srcLongId = this.props.srcLongId;
          }
      }

      return srcLongId;
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
        <div className="col-md-3"><input id={item.srcShortId} name={item.shortInputName} className="form-control" type="text"/></div>
        <div className="col-md-3"><input id={item.srcLongId} name={item.longInputName} className="form-control" type="text"/></div>
        <div className="col-md-3"><input id={item.srcCategoryId} name={item.categoryInputName} className="form-control" type="text"/></div>
        <div className="col-md-2">
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
