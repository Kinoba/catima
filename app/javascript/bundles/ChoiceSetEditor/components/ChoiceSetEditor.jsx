import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { TreeSelect } from 'antd';

const TreeNode = TreeSelect.TreeNode;

class ChoiceSetEditor extends Component {
  constructor(props){
    super(props);

    this.state = {
      selectedCategory: {},
      selectedItem: [],
      disabled: false,
      hiddenInputValue: [],
      defaultValues: [],
      inputName: this.props.inputName
    };

    this.selectItem = this._selectItem.bind(this);
  }

  componentDidMount(){
      this.setState({ defaultValues: this.state.inputDefaults });
  }

  _save(){
    if(this.state.selectedItem !== null) {
      this.setState({ hiddenInputValue: this.state.selectedItem });
    }
  }

  _selectItem(item){
      if(typeof item !== 'undefined') {
          var itemData = this._getItemData(this.props.items, item);
          if(typeof itemData !== 'undefined') {
              item.data = itemData;
          } else {
              item.data = [];
          }
      } else {
          item = [];
      }


      this.setState({ selectedItem: item });
  }

  _getItemData(list, searchItem) {
      for(var i = 0; i < list.length; i++) {
          var result = this._findByProps(list[i], searchItem.label, searchItem.value);
          if(result){
              //Found the parent item
              return result.category_data;
          } else {
              //Search in the childrens
              var childrenResult = this._findByProps(list[i].children, searchItem.label, searchItem.value);
              if(childrenResult){
                  //Found the parent item
                  return childrenResult.category_data;
              }
          }
      }

      return null;
  }

  _findByProps(o, label, value) {
        //Early return
        if(typeof o !== 'undefined') {
            if( o.value === label && o.key === value){
              return o;
            }
            var result, p;
            for (p in o) {
                if( o.hasOwnProperty(p) && typeof o[p] === 'object' ) {
                    result = this._findByProps(o[p], label, value);
                    if(result){
                        //Found !
                        return result;
                    }
                }
            }
        }
        return null;
    }

  _getTreeChildrens(item) {
      console.log(item);
    if(typeof item.children !== 'undefined' && item.children.length>0) {
        return (
            <TreeNode value={item.key} title={item.value} key={item.key}>
                { item.children.map((childItem) => {
                  return this._getTreeChildrens(childItem);
                })}
            </TreeNode>
        );
    } else {
        return <TreeNode value={item.key} title={item.value} key={item.key} />;
    }
  }

  renderChoiceSetElement(){
    return (
        <div>
            <input id={this.choiceSetId} type="hidden" readOnly value={this.state.selectedItem} name={this.props.inputName}/>
            <TreeSelect
              value={this.state.selectedItem}
              placeholder={this.props.searchPlaceholder}
              showSearch
              allowClear
              labelInValue
              treeDefaultExpandAll
              treeNodeFilterProp="title"
              multiple={this.props.multiple}
              defaultValue={this.state.defaultValues}
              onChange={this.selectItem}>
                { this.props.items.map((item) => {
                  return this._getTreeChildrens(item);
                })}
            </TreeSelect>
        </div>
    );
  }

  render() {
    return (
      <div className="choiceset-editor-container">
            { this.renderChoiceSetElement() }
      </div>
    );
  }

}

export default ChoiceSetEditor;
