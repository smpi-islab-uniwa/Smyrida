import React, { Component } from 'react';  
import CsvElements from "./CsvElements.js"
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import ReactJsAlert from "reactjs-alert";

class Replayresults extends Component { 
   
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
        fetch((window.globalConfig['serverURL'] || { siteName: process.env.REACT_APP_SERVER_URL})+'/getreplayresults', {
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
       converttostate = event => {   
        this.setState({ done: true});
        };
        
           render(){
            var htmltable=[];
               if (this.props.data.includes(".xes")){ 
                 
                        if(this.state.image===false){  //until the API sends a success response
                            if(this.state.selectedalgo===''){
                                return(<div> <select id="selectedalgoid"   onChange={() => this.Getalgo()}><option value=""></option><option value="1">Alphaminer</option><option value="2">Inductive Miner</option><option value="3">Heuristics Miner</option></select></div>)
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
                                  width={100} 
                                  />)
                              }
                               
                              }
                         
                        }
                        else{
                            htmltable=buildevent(this.state.dictionary); 
                        } 

               return(<div> 
                           {htmltable}
               </div>)} 
               if (this.props.data.includes(".csv")){ 
                 
                if (this.state.done===false){   //until the user selects csv headers to rename
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
    

function buildevent(dictionary){  ///converts API response into table 
      
      var obj = dictionary;
      const  eventhtml=[];
      const  htmlhead=[]; 
      const  htmlbody=[];
      const  thead = 'stat'; 
      htmlhead.push(<thead key={thead}><tr key={0}><td>Trace is fit</td><td>  Trace fitness </td><td> Activated Transitions </td><td> Reached Marking </td>
      <td>Enabled transitions in marking</td><td>Transitions with problems</td><td>Missing Tokens</td><td>Consumed Tokens</td><td>Remaining Tokens</td><td>Produced Tokens</td></tr></thead>)
   
     for ( var i=0;i<obj.length;i++) {   
                  const trkey='tr_'+i;
                  const trkey2 = trkey+'_2';
                  const trkey3 = trkey+'_3';
                  const trkey4 = trkey+'_4';
                  const trkey5 = trkey+'_5'; 
                  const trkey7 = trkey+'_7';
                  const trkey8 = trkey+'_8';
                  const trkey9 = trkey+'_9';
                  const trkey10 = trkey+'_10';
                  const trkey11 = trkey+'_11'; 
                  htmlbody.push(<tr key={i}><td key={trkey}>{obj[i].trace_is_fit.toString()}</td><td key={trkey2}>   {obj[i].trace_fitness} </td><td key={trkey3} >  {obj[i].activated_transitions}  </td>
                  <td key={trkey4}>{obj[i].reached_marking}</td><td key={trkey5}>{obj[i].enabled_transitions_in_marking}</td><td key={trkey7}>{obj[i].transitions_with_problems}</td>
                  <td key={trkey8}>{obj[i].missing_tokens}</td><td key={trkey9}>{obj[i].consumed_tokens}</td><td key={trkey10}>{obj[i].remaining_tokens}</td><td key={trkey11}>{obj[i].produced_tokens}</td></tr>)
               } 
     const tablekey='table';
     eventhtml.push(<table key={tablekey} className='resultstable'>{htmlhead}<tbody>{htmlbody}</tbody></table>)
    return eventhtml; 
     
  }
    
export default Replayresults;
