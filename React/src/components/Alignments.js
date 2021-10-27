import React, { Component } from 'react';   
import CsvElements from "./CsvElements.js"
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import ReactJsAlert from "reactjs-alert";

class Alignments extends Component { 
       
    state ={ 
      image:false, //until the API returns response
      dictionary:null,//repsonse from API
      selectedalgo:'',  //selected algorithm 
      done:false, //in case of csv file
      error:''
  } 
    csvheaders= {
        csvheaders:null,
        csvlist:null
    } 
    converttostate = event => {   
      this.setState({ done: true});
      };
    Getalgo =()=>{
      var value=document.getElementById('selectedalgoid').value; 
      this.setState({ selectedalgo:value}); 
    }
    StateImage = () => {
        const data = new FormData(); 
        data.append('filename',this.props.data);  
        data.append('sitealgo', this.state.selectedalgo); 
        data.append('folder',this.props.folder);
        if(this.props.data.includes('.csv')){  
                if(this.props.value.seperator.length>0){
                  data.append('seperator',this.props.value.seperator);
                }
                if (document.getElementById('caseconcept')!==null){
                  data.append('caseconcept',document.getElementById('caseconcept').value);  
                }
                if (document.getElementById('startevent')!==null){
                  data.append('startevent',document.getElementById('startevent').value);  
                }
                if (document.getElementById('timestamp')!==null){
                  data.append('timestamp',document.getElementById('timestamp').value);  
                }
                if (document.getElementById('conceptname')!==null){
                  data.append('conceptname',document.getElementById('conceptname').value);  
                }
      }
        fetch((window.globalConfig['serverURL'] || { siteName: process.env.REACT_APP_SERVER_URL})+'/getalignments', {
                                                        method: 'POST',
                                                        body: data,
                  }).then(response => (response.json()))
                  .then(data => { 
                                if (data[0].api_error===undefined){   
                                                                this.setState({ error:'',image: true,dictionary:data[0].dictionary}); 
                                }
                                else{
                                    this.setState({error:data[0].api_error}); 
                                }
                  }); 
        
       } 
      //  StateImageCSV = () => {
      //   const data = new FormData(); 
      //   data.append('filename',this.props.data);  
      //   data.append('sitealgo',document.getElementById('selectedalgoid').value); 
      //   var caseconcept = document.getElementById('caseconcept').value; 
      //   var start_timestamp = document.getElementById('start_timestamp').value;  
      //   var timestamp = document.getElementById('timestamp').value; 
      //   var conceptname = document.getElementById('conceptname').value;   
      //   data.append('seperator',this.props.value.seperator);
      //   data.append('caseconcept',caseconcept);  
      //   data.append('startevent',start_timestamp);  
      //   data.append('timestamp',timestamp);  
      //   data.append('conceptname',conceptname);
      //   data.append('folder',this.props.folder);
      //   fetch((window.globalConfig['serverURL'] || { siteName: process.env.REACT_APP_SERVER_URL})+'/getalignmentscsv', {
      //                                                   method: 'POST',
      //                                                   body: data,
      //             }).then(response => (response.json()))
      //             .then(data => { 
      //                           if (data[0].error===undefined){   
      //                                                           this.setState({ image: true,dictionary:data[0].dictionary}); 
      //                           }
      //             }); 
        
      //  }  
       
           render(){
          var htmltable=[];
        
          if (this.props.data.includes(".xes")){ 
                 
                        if(this.state.image===false){ //until the API sends a success response
                          if(this.state.selectedalgo===''){
                            return(<div> <select id="selectedalgoid" onChange={() => this.Getalgo()}><option value=""></option><option value="1">Alphaminer</option><option value="2">Inductive Miner</option><option value="3">Heuristics Miner</option></select></div>)
                          } 
                          else{
                            if(this.state.error.length>0){
                              var errorstring=this.state.error.toString();
                              return(<div> 
                            
                                      <ReactJsAlert
                                          type="warning"   // success, warning, error, info
                                          title={errorstring}   // title you want to display
                                          status={true}   // true or false 
                                          color="#FF0000"  
                                          button="Try Again"
                                          Close={() => this.setState({ status: false })}   // callback method for hide
                                      />
                              </div>);
                          }
                          else{
                              this.StateImage(); 
                              return(<Loader
                                type="ThreeDots"
                                color="#dc905e"
                                height={100}
                                width={100} ></Loader>)
                          }
                           
                          } 
                        }
                        else{
                             htmltable=buildevent(this.state.dictionary); 
                        } 

               return(<div> 
                           {htmltable}
               </div>)}
          else if (this.props.data.includes(".csv")){ 
                if (this.state.done===false){    //until the user selects csv headers to rename
                  return(  
                      <div>  <CsvElements data={this.props.value}></CsvElements> 
                      <div><span>Please Select algorithm</span> <div><select id="selectedalgoid" onChange={() => this.Getalgo()}> <option value="1">Alphaminer</option><option value="2">Inductive Miner</option><option value="3">Heuristics Miner</option></select></div></div>
                      <button type="submit"  onClick={this.converttostate} className="btn btn-primary pull-right">Continue</button> </div>
                      ) 
                 }
                 else{
                  if(this.state.image===false){ 
                                      if(this.state.error.length>0){
                                        errorstring=this.state.error.toString();
                                        return(<div> 
                                      
                                                <ReactJsAlert
                                                    type="warning"   // success, warning, error, info
                                                    title={errorstring}   // title you want to display
                                                    status={true}   // true or false 
                                                    color="#FF0000"
                                                      button="Try Again"
                                                    Close={() => this.setState({ status: false })}   // callback method for hide
                                                />
                                        </div>);
                                    }
                                    else{
                                      this.StateImage();  
                                        return(<Loader
                                          type="ThreeDots"
                                          color="#dc905e"
                                          height={100}
                                          width={100} 
                                          />)
                                    }
                      
                  }
                  else{
                       htmltable=buildevent(this.state.dictionary); 
                  } 
             
         return(<div> 
                     {htmltable}
                    
         </div>)}
         }
        else{
            return(<div>Please select a file from list</div>)
            }  
        }
           
            
} 
var key=0;

function buildevent(dictionary){  
      
      var obj = dictionary; //gets reponse from APi
      var returnhtml = [];
      for ( var i=0;i<obj.length;i++) {      
        key++; 
        returnhtml.push(<div key={key} className="pdropwdown">{buildsinglealignemnt(obj[i].alignment,i)}</div>); //creates a single table for every object of dictionary
      }

 
    return returnhtml;
     
  }
    

function buildsinglealignemnt(step_list,number){
  var trace_steps=[];
  var model_steps=[];
  var max_label_length = 0; 
  var rethtml=[];
  var rethtml2=[];
  var dividerhtml=[];
  var step=[];
  var splitstep = step_list.toString().split(','); 
  var i,j; 
  for (i=0;i<splitstep.length;i+=2){
    step.push(splitstep[i]+','+splitstep[i+1]);
  } 
  for (i=0;i<step.length;i++)
  {  
    var insidesplitstep=step[i].toString().split(',');
    trace_steps.push(" " + insidesplitstep[0].toString() + " ")
    model_steps.push(" " +  insidesplitstep[1].toString()  + " ")
    if ((insidesplitstep[0].length) > max_label_length){
         max_label_length = insidesplitstep[0].toString().length;
    }
    if ( insidesplitstep[1].toString().length > max_label_length){
         max_label_length =  insidesplitstep[1].toString().length;
    }
    
  }
  for (i=0;i<trace_steps.length;i++){
    if  (trace_steps[i].toString().length - 2 < max_label_length){
            var step_length =  trace_steps[i].toString().length - 2;
            var spaces_to_add = max_label_length - step_length;
            for (j=0;j<spaces_to_add;j++){  
                if (j % 2 === 0){
                    trace_steps[i] = trace_steps[i] + " ";
                  }
                else{
                    trace_steps[i] = " " + trace_steps[i];
                  }
            }
      }  
      
      key++;
      rethtml.push(<td key={key}>{trace_steps[i]}</td>);
  }
  var devkey='div1'+number;
  dividerhtml.push(<tr key={devkey}>{rethtml}</tr>); 
  for (i=0;i<model_steps.length;i++)
  {
    if ((model_steps[i].length - 2) < max_label_length){
            var step_lengthmodel = model_steps[i].length - 2;
            var spaces_to_addmodel = max_label_length - step_lengthmodel;
            for (j=0;j<spaces_to_addmodel;j++){
                if (j % 2 === 0){
                    model_steps[i] = model_steps[i] + " ";
                  }
                else{
                    model_steps[i] = " " + model_steps[i];
                  }
            }
            
    } 
    key++;
    rethtml2.push(<td  key={key} >{model_steps[i]}</td>);
  }  
  var devkey2='div2'+number;
  dividerhtml.push(<tr key={devkey2}>{rethtml2}</tr>)
  var finalhtml=[];
  key++;
  finalhtml.push(<table key={key}><tbody>{dividerhtml}</tbody></table>);
  return finalhtml; 
}


export default Alignments;
