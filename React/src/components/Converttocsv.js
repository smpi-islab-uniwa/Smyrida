import React, { Component } from 'react'; 
import ReactJsAlert from "reactjs-alert";
class Converttocsv extends Component { 

state={ //if user has not already press yes
    converttostate:false,
    error:''
}

converttostate = () => {  
      const data = new FormData();
      data.append('filename',this.props.data);  //send filename to api to convert it
      data.append('folder',this.props.folder);
      fetch((window.globalConfig['serverURL'] || { siteName: process.env.REACT_APP_SERVER_URL})+'/convertocsv', {
                                        method: 'POST',
                                        body: data,
      }).then(response => (response.json()))
        .then(data => {  
            if (data[0].api_error===undefined){   
            this.props.parentCallback(data[0].csvname);
            var url =  window.location.href;
            url = url.replace("tocsv", "mainmenu");
            window.location.href = url;//redirect to mainmenu after the file convertion
        }
        else{
            this.setState({converttostate:true,error:data[0].api_error}); 
        }
      });  
    }
    dontconvert = event =>{   
        var url =  window.location.href;
        url = url.replace("tocsv", "mainmenu");
        window.location.href = url;
    } 
   render() {    
            if(this.props.data.includes(".xes")){       
                if (this.state.converttostate===false){//question if the user wants to convert
                    return(<div>
                        <p className="areusure"><span>Are you sure you want to convert your file</span></p> 
                        <button type="submit"  onClick={this.converttostate} className="btn  btn-primary pull-right">YES</button>
                        <button type="submit"  onClick={this.dontconvert} className="btn marginleft10 btn-primary pull-right">NO</button>
                        </div>)
                }
                else{
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

            }
            
            else{   //in case the file isn't xes or the user has not selected a file
                return( <p><span>Please select a xes file</span></p> )
            }
          
    }
}
   export default Converttocsv;