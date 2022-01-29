import React, { Component } from 'react';   
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"; 
import ChosenAlgorithm from './ChosenAlgorithm.js';
class InductiveMiner extends Component { 
      
     render(){
      return(<ChosenAlgorithm folder={this.props.folder}  value={this.props.value}   data={this.props.data} Algorithm="2"></ChosenAlgorithm>)   
     }
} 
 
     
export default InductiveMiner;
