import React, { Component } from 'react';  
import CsvElements from "./CsvElements.js" 
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner"; 
import Algorithm from './Algorithm.js';
import ReactJsAlert from "reactjs-alert"; 
class ChosenAlgorithm extends Component {  
        image ={
            image: null,//pm4py image
            imageHash: Date.now(),//time send
            nettransitions: [], //petrinet transitions
            netplaces:[],   //petrinet places
            netarcs:[]  //petrinet arcs
        }
        state ={
            isok : false, //in case of csv file until the user selects headers and presses yes
            image:false,//if API returns pm4py static image
            fitness: null, //fitness
            precision: null,//precision
            generalization:null,//generalization
            simplicity:null,//simplity
            error:''
        }
        csvheaders= {
            csvheaders:null,
            csvlist:null
        } 
        StateImage = () => {
            const data = new FormData(); 
            data.append('filename',this.props.data);  
            data.append('sitealgo', this.props.Algorithm); //the same endpoint different algorithm 
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
            fetch((window.globalConfig['serverURL'] || { siteName: process.env.REACT_APP_SERVER_URL})+'/getimage', {
                                                            method: 'POST',
                                                            body: data,
                      }).then(response => (response.json()))
                      .then(data => {
                                    if (data[0].api_error===undefined){   
                                     this.image.nettransitions=data[0].nettransitions;   
                                     this.image.netplaces=data[0].netplaces;  
                                     this.image.netarcs=data[0].netarcs; 
                                     this.image.image=data[0].image; 
                                     this.image.imageHash= Date.now();
                                     this.setState({ error:'',image: true,fitness:data[0].log_fitness,precision:data[0].evaluation_result,generalization:data[0].generalization,simplicity:data[0].simplicity}); 
                                    }
                                    else{
                                        this.setState({error:data[0].api_error}); 
                                    }
                      }); 
            
           }
    
            
           converttostate = event => {   
            this.setState({ isok: true});
            };
           
               render(){ 
                   if (this.props.data.includes(".xes")){ 
                     
                            if(this.state.image===false){
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
                            
                                    return(<div> 
                                         <Loader
                                        type="ThreeDots"
                                        color="#dc905e"
                                        height={100}
                                        width={100} 
                                        />
                                                {/* <Algorithm  trans={this.image.nettransitions}  places={this.image.netplaces}  arcs={this.image.netarcs} ></Algorithm> */}
                                    </div>)
                                }
                                
                            }  
                            else{
                                 
                      //          buildminer(this.image.nettransitions,this.image.netplaces,this.image.netarcs);//builds petrinet
                             //evaluation table and petrinet
                                return(<div>
                                    {/* <img alt="alphaminer" className='imageclass' src={`${this.image.image}?${this.image.imageHash}`} />  */}
                                    <table>
                                       <tbody><tr>
                                            <td>
                                            Log Fitness
                                            </td>
                                            <td>
                                            {this.state.fitness}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                            Log Precision
                                            </td>
                                            <td>
                                            {this.state.precision}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                            Generalization
                                            </td>
                                            <td>
                                            {this.state.generalization}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                            Simplicity
                                            </td>
                                            <td>
                                            {this.state.simplicity}
                                            </td>
                                        </tr></tbody></table> 
                                    <div   className="move50"style={{ height: 1001 }}>
                                    <Algorithm  trans={this.image.nettransitions}  places={this.image.netplaces}  arcs={this.image.netarcs} ></Algorithm>
                                    </div>
                                   
                        </div>)
                            }
                   }
                   else if (this.props.data.includes(".csv")){  
                        if (this.state.isok===false){  
                                return( 
                                   
                                    <div>  <CsvElements data={this.props.value}></CsvElements> 
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
                            
                                    return(<div> 
                                         <Loader
                                        type="ThreeDots"
                                        color="#dc905e"
                                        height={100}
                                        width={100} 
                                        />
                                               {/* <Algorithm  trans={this.image.nettransitions}  places={this.image.netplaces}  arcs={this.image.netarcs} ></Algorithm> */}
                                    </div>)
                                }
                                
                            }  
                            else{
                              //  minerhtml=buildminer(this.image.nettransitions,this.image.netplaces,this.image.netarcs);
                             
                                return(<div> 
                                   <table>
                                        <tr>
                                            <td>
                                            Log Fitness
                                            </td>
                                            <td>
                                            {this.state.fitness}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                            Log Precision
                                            </td>
                                            <td>
                                            {this.state.precision}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                            Generalization
                                            </td>
                                            <td>
                                            {this.state.generalization}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                            Simplicity
                                            </td>
                                            <td>
                                            {this.state.simplicity}
                                            </td>
                                        </tr>
                                    </table> 
                                    <div   className="move50"style={{ height: 1001 }}>
                                    <Algorithm  trans={this.image.nettransitions}  places={this.image.netplaces}  arcs={this.image.netarcs} ></Algorithm>
                                    </div>
                                   
                        </div>)
                            }
                           
                           
                        }
                    }
                    else{
                        return(<div>Please select a file from list</div>)
                    } 
               }
    } 

export default ChosenAlgorithm;
