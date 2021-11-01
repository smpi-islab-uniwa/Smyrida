import React, { Component } from 'react';  

class FirsTime extends Component { 
       
      state = {
        fileforupload:true          
      } 

      userfiles = {   //all files dictionary
        allfiles:[]
      }

      file = {      //selected file
        selectedfile:null,
        filename:null
      } 
      onFileChange = event => {  
        if((event.target.files[0].name.includes('.xes'))||(event.target.files[0].name.includes('.csv'))){ //save only xes or csv files on state
              document.getElementById('selectedfilename').innerText=(event.target.files[0].name);
              this.file.selectedfile = event.target.files[0] ;
              this.file.filename=event.target.files[0].name; 
        }
     };  
     StatechangenotFile = event => {    
      this.setState({ fileforupload: false});   
     }
     StatechangeFileDone = event => {   
        if(this.file.filename!==null){
           //       this.sendData();
                  
                  if (this.file.filename.includes('xes')){    //value of xes files in dictionary is true else false
                  this.userfiles.allfiles[this.file.filename]=true
                  }else{
                  this.userfiles.allfiles[this.file.filename]=false
                  }
 
                //  this.setState({ fileforupload: false});  //change state when file is uploaded
                  const data = new FormData(); 
                  data.append('file', this.file.selectedfile); 
                  data.append('filename',this.file.filename);   
                  data.append('folder',this.props.folder);
                  fetch((window.globalConfig['serverURL'] || { siteName: process.env.REACT_APP_SERVER_URL})+'/savefile', {
                  method: 'POST',
                  body: data,
                  }).then(response => (response.json()))
                  .then(data => { 
                    if (data[0].error===undefined){ 
                      this.setState({ fileforupload: false}); 
                    }
                    else{
                      this.file.filename=null;
                      this.file.selectedfile=null;
                      document.getElementById('selectedfilename').innerText=("500 Internal Server Error");
                    }
                  }).catch((error) => {
                    this.file.filename=null;
                    this.file.selectedfile=null;
                    document.getElementById('selectedfilename').innerText=("500 Internal Server Error");
                  });
                 
                  // this.file.filename=null;
                  // this.file.selectedfile=null;
                }
     }

     
     sendData = () => {
        this.props.parentCallback(this.file.filename);
     }
      render() {        
        if (this.state.fileforupload === true){         // shows the file upload box
          var filename='Choose a xes or csv file or drag it here.';  
          return (
            <div> 
                    <div className="container">
                    <div className="row">
                      <div className="col-md-12">
                      <div className="form-group">
                        <label className="control-label">Upload File</label>
                        <div className="preview-zone hidden">
                        <div className="box box-solid">
                          
                          <div className="box-body"></div>
                        </div>
                        </div>
                        <div className="dropzone-wrapper">
                        <div className="dropzone-desc">
                          <i className="glyphicon glyphicon-download-alt"></i> 
                          <p id='selectedfilename'>{filename}</p>
                        </div> 
                        <input className="uploadinput dropzone"    type="file" name="file"  onChange={this.onFileChange}/> 
                        </div>
                      </div>
                      </div>
                    </div>

                    {/* <div className="row">
                      <div className="col-md-12">
                      <button type="submit" className="btn btn-primary pull-right">Upload</button>
                      </div>
                    </div> */}
                    <button type="submit"  onClick={this.StatechangeFileDone} className="btn firstimebtn btn-primary pull-right">Complete</button>
                    </div>    
                  
            </div>
          );
        }
        else{   
          this.sendData();
          this.file.filename=null;
          this.file.selectedfile=null;
        return(<div > </div>)
        }
    }
            
            
  }//CLASS END  
 
   
  
    
export default FirsTime;
