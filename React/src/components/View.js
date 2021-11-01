import React, { Component } from 'react';   
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import ReactJsAlert from "reactjs-alert";
class View extends Component { 
       
    state ={
        isok : false,//changes when the API has returned data to be shown
        number:10,//the number of rows to be displayed
        error:''
    } 
    view={  //the result from API
        dict:[]
    } 
    changeresults= () =>{
        this.setState({number:parseInt(document.getElementById('selectedfromdrop').value)});
    }
    StateImage = () => { 
        
        const data = new FormData(); 
      //  data.append('filename',this.props.data);  
        data.append('filename',this.props.data); 
        if(this.props.data.includes('.csv')){    
                                                if(this.props.value.length>0){
                                                    data.append('seperator',this.props.value);     
                                                }
        }
        data.append('folder',this.props.folder);
        fetch((window.globalConfig['serverURL'] || { siteName: process.env.REACT_APP_SERVER_URL})+'/view', {
                                                        method: 'POST',
                                                        body: data,
                  }).then(response => (response.json()))
                  .then(data => {  
                    if (data[0].api_error===undefined){
                               this.view.dict= data[0].view;
                               this.setState({isok:true}); //when the API returns data with the content of file
                    }
                    else{
                        this.setState({error:data[0].api_error});
                        this.setState({isok:true}); 
                    }
                  }); 
        
       }
    //    StateImageCsv = () => {
    //     const data = new FormData(); 
    //     data.append('filename',this.props.data); 
    //     data.append('folder',this.props.folder);
    //     fetch((window.globalConfig['serverURL'] || { siteName: process.env.REACT_APP_SERVER_URL})+'/viewcsv', {
    //                                                     method: 'POST',
    //                                                     body: data,
    //               }).then(response => (response.json()))
    //               .then(data => {  
    //                 if (data[0].error===undefined){
    //                         this.view.dict= data[0].view;
    //                         this.setState({isok:true});//when the API returns data with the content of file
    //                 }
    //    }); 
        
    //    }

       converttostate = event => {   
        this.setState({ isok: true});
        };
       
           render(){
            var  dataframe;
               if (this.props.data.includes(".xes")){  
                
                if(this.state.isok===false){
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
                                                            dataframe=builddf(this.view.dict,this.state.number); //build the content of file
                                                            return(<div>
                                                                        <p>Number of resurts</p>
                                                                        <select onChange={() => this.changeresults()} id='selectedfromdrop'><option value='10' >10</option><option value='50'>50</option><option value='-1'>All</option></select>
                                                                        {dataframe} 
                                                                </div>)
                    }
                }
                }
               else if(this.props.data.includes(".csv")){
                if(this.state.isok===false){
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
                else{
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
                                dataframe=builddf(this.view.dict,this.state.number);
                                return(<div>
                                            <p>Number of resurts</p>
                                            <select onChange={() => this.changeresults()} id='selectedfromdrop'><option value='10' >10</option><option value='50'>50</option><option value='-1'>All</option></select>
                                        {dataframe} 
                                    </div>)
                    }
                }
               
                 
               }
               else{    //in case the user has not select a file
                return(<div>Please select a file from list</div>)
            } 
               }
  }
function builddf(dictionary,resultsno){  
    var header=[];
    var body=[];
    var tempinside=[];
    const  htmlhead=[]; 
    const  dataframe=[];
    const  thead = 'stat_'; 
    var key='';
    var headercounter=0;
    var headerkey=''
    var headersaresok=false;
    var counter=0;
    
    for (var i in dictionary){  
        if (resultsno!==-1){
            if(counter===resultsno){    //shows results until number of dropdown
                break;
            }
        }
        if(headersaresok===false){  //headers of file 
            for (const [key] of Object.entries(dictionary[i])) {
                headercounter+=1;
                headerkey='header'+headercounter;
                header.push(<td key={headerkey}>{key}</td>); 
             }
             headersaresok=true;
        }
        
        for (var j in dictionary[i]){   //content of file
            key='td'+i+'_'+j; 
            if (dictionary[i][j]!==null){
                tempinside.push(<td key={key}>{dictionary[i][j].toString()}</td>);
            }
            else{
                tempinside.push(<td key={key}></td>);
            }  
           
        } 
         counter++;
        key='tr'+i;
        body.push(<tr key={key}>{tempinside}</tr>)
        tempinside=[];
    }
    htmlhead.push(<thead key={thead}><tr key='headerkey'>{header}</tr></thead>)  
    dataframe.push(<table key='tablekey' className='resultstable'>{htmlhead}<tbody>{body}</tbody></table>)     
    return dataframe; 
}
export default View;
