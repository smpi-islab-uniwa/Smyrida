 
import React, { Component } from 'react';  
import CsvElements from "./CsvElements.js"
import ReactJsAlert from "reactjs-alert";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner"; 

class Variantscount extends Component { 
    image ={
        image: null, 
        imageHash: Date.now()
    }
    state ={
        isok : false,
        image:false,
        error:''
    }
    csvheaders= {
        csvheaders:null,
        csvlist:null
    } 
    StateImage = () => {
        const data = new FormData();  
        data.append('filename',this.props.data);   
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
        fetch((window.globalConfig['serverURL'] || { siteName: process.env.REACT_APP_SERVER_URL})+'/variants_count', {
                                                        method: 'POST',
                                                        body: data,
                  }).then(response => (response.json()))
                  .then(data => { 
                    if (data[0].api_error===undefined){
                                 this.image.image=data[0].image;  
                                 this.image.imageHash= Date.now();
                                 this.setState({ image: true});
                    }else{
                        this.setState({error:data[0].api_error}); 
                    }
                  }); 
        
       }
    //    StateImageCsv = () => {
    //     const data = new FormData(); 
    //     data.append('filename',this.props.data);    
    //     data.append('sitealgo', '1'); 
    //     data.append('folder',this.props.folder);
    //     var caseconcept = document.getElementById('caseconcept').value; 
    //    var start_timestamp = document.getElementById('start_timestamp').value;  
    //    var timestamp = document.getElementById('timestamp').value; 
    //    var conceptname = document.getElementById('conceptname').value;   
    //    data.append('caseconcept',caseconcept);  
    //    data.append('startevent',start_timestamp);  
    //    data.append('timestamp',timestamp);  
    //    data.append('conceptname',conceptname);   
    //    data.append('seperator',this.props.value.seperator);
    //     fetch((window.globalConfig['serverURL'] || { siteName: process.env.REACT_APP_SERVER_URL})+'/trace_durationcsv', {
    //                                                     method: 'POST',
    //                                                     body: data,
    //               }).then(response => (response.json()))
    //               .then(data => {
    //                 if (data[0].error===undefined){
    //                              this.image.image=data[0].image; 
    //                              this.image.imageHash= Date.now();
    //                              this.setState({ image: true});
    //                 }
    //               }); 
        
    //    }

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
                                         
                               </div>)
                            }
                            
                        } 
                        else{
                            const myhtml=`${this.image.image}?${this.image.imageHash}`;
                            return(<div>  
                                <iframe className="borderless" title="variantscountxes" src={myhtml} width="1280" height="720"></iframe>
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
                        if(this.image.image==null){
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
                                         
                               </div>)
                            }
                            
                        }
                        else{
                            const myhtml=`${this.image.image}?${this.image.imageHash}`;
                            return(<div>  
                                <iframe className="borderless" title="variantscountcsv" src={myhtml} width="1280" height="720"></iframe>
                            </div>)
                        }
                       
                       
                    }
                }
                else{
                    return(<div>Please select a file from list</div>)
                } 
           }
            
} 
    
    
export default Variantscount;
