import React, { Component } from 'react';  
import CsvElements from "./CsvElements.js"
import ReactFlow from 'react-flow-renderer';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner"; 
import ReactJsAlert from "reactjs-alert";

class AlphaMiner extends Component { 
    
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
        data.append('sitealgo', '1'); //the same endpoint different algorithm 
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

       
    //    StateImageCsv = () => {
    //     const data = new FormData(); 
    //     data.append('filename',this.props.data);    
    //     data.append('sitealgo', '1');  
    //     var caseconcept = document.getElementById('caseconcept').value; 
    //    var start_timestamp = document.getElementById('start_timestamp').value;  
    //    var timestamp = document.getElementById('timestamp').value; 
    //    var conceptname = document.getElementById('conceptname').value;   
    //    data.append('caseconcept',caseconcept);  
    //    data.append('startevent',start_timestamp);  
    //    data.append('timestamp',timestamp);  
    //    data.append('conceptname',conceptname);   
    //    data.append('seperator',this.props.value.seperator);
    //    data.append('folder',this.props.folder);
    //     fetch((window.globalConfig['serverURL'] || { siteName: process.env.REACT_APP_SERVER_URL})+'/getimagecsv', {
    //                                                     method: 'POST',
    //                                                     body: data,
    //               }).then(response => (response.json()))
    //               .then(data => { 
    //                              if (data[0].error===undefined){
    //                                 this.image.nettransitions=data[0].nettransitions;   
    //                                 this.image.netplaces=data[0].netplaces;  
    //                                 this.image.netarcs=data[0].netarcs; 
    //                                 this.image.image=data[0].image; 
    //                                 this.image.imageHash= Date.now();
    //                                 this.setState({ image: true,fitness:data[0].log_fitness,precision:data[0].evaluation_result,generalization:data[0].generalization,simplicity:data[0].simplicity}); 
    //                             }  
    //               }); 
        
    //    }

       converttostate = event => {   
        this.setState({ isok: true});
        };
       
           render(){
               var minerhtml;
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
                                            <ReactFlow  elements={minerhtml}  />
                                </div>)
                            }
                            
                        }  
                        else{
                            minerhtml=buildminer(this.image.nettransitions,this.image.netplaces,this.image.netarcs);//builds petrinet
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
                                <ReactFlow  elements={minerhtml}  />
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
                                            <ReactFlow  elements={minerhtml}  />
                                </div>)
                            }
                            
                        }  
                        else{
                            minerhtml=buildminer(this.image.nettransitions,this.image.netplaces,this.image.netarcs);
                         
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
                                <ReactFlow  elements={minerhtml}  />
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
function buildminer(trans,places,arcs){    
    var allfound=false;
    var  elements=[]; 
    /*initialize*/
    var allelements={};
    var y={};
    var max=0;
    for (var x in trans)
    {   
        allelements[hmapping(trans[x])]="transition";
    }  
    for ( x in places)
    {  
        if(hmapping(places[x])==='start'){ 
            allelements[hmapping(places[x])]="0~places";
        }else{
            allelements[hmapping(places[x])]="places";
        } 
    }
    /*find levels*/
      while(allfound===false)
      {
        for ( x in arcs){ 
            var left=arcs[x].split('->')[0];
            var right=arcs[x].split('->')[1]; 
            left=hmapping(left);
            right=hmapping(right);
            left=removet(left);
            right=removet(right);  
             if((allelements[left].includes('~')) && (allelements[right].includes('~')===false )) { 
                 
                 allelements[right]=(parseInt(allelements[left].split('~')[0])+1).toString()+'~'+allelements[right];
             }
        }

        allfound=true;
        /*check if a lvl is missing*/
        for(x in allelements){
            
            if(!allelements[x].includes('~')){
                allfound=false;
            }
        }
      }
      
      /* find max lvl*/
      for(x in allelements){
        if (allelements[x].split('~')[0] > max ){
            max=parseInt(allelements[x].split('~')[0]);
        }
      } 
      
      for (var i=0;i<=max;i++){
          y[i]=0;
      }
      var name={};
      var j=0;
      
      for(x in allelements){
        name[x]=j;
        j++;
      }

       for(x in allelements){
        
                            if(allelements[x].split('~')[1]==="places"){ 
                                if (x==='end'){
                                    elements.push({id: name[x],type: 'input',data: { label: '' },position: { x: (max)*180, y: 0 },sourcePosition:'left',draggable: true,style:{width: '50px',height: '50px',borderRadius: '50%', paddingTop: '17px',borderColor:'black',backgroundColor: 'orange'} });
                                }
                                else if (x==='start'){
                                    elements.push({id:  name[x],type: 'input',data: { label: '' },position: { x: 1, y: 0 },sourcePosition:'right',draggable: true,style:{width: '50px',height: '50px',borderRadius: '50%', paddingTop: '17px',borderColor:'black',backgroundColor: 'green'} });
                               
                                }
                                else{  
                                    elements.push({id:  name[x],data: { label: ''  },sourcePosition:'right',targetPosition:'left',position: { x: parseInt(allelements[x].split('~')[0])*150, y: y[allelements[x].split('~')[0]] },style:{width: '50px',height: '50px',borderRadius: '50%', paddingTop: '17px',borderColor:'black',backgroundColor: 'white'} });
                                    y[allelements[x].split('~')[0]]+=100;
                                }                            
                            }
                            else{
                                if (x.includes('hid')){
                                    
                                    elements.push({ id:name[x],    data: { label:''  },sourcePosition:'right',targetPosition:'left', position: { x: parseInt(allelements[x].split('~')[0])*150, y:  y[allelements[x].split('~')[0]]  },style:{width: '108px',backgroundColor: 'black'}});
                              
                                }
                                else{
                                   
                                    elements.push({ id: name[x],    data: { label:x.toString()  },sourcePosition:'right',targetPosition:'left',position: { x: parseInt(allelements[x].split('~')[0])*150, y:  y[allelements[x].split('~')[0]]  },style:{width: '108px'}});
                              
                                }
                                 y[allelements[x].split('~')[0]]+=100;
                            }
      }
      var counter=0;
      /* draw lines */ 
      for ( x in arcs){ 
       
        left=arcs[x].split('->')[0];
        right=arcs[x].split('->')[1]; 
        
        left=hmapping(left);
        right=hmapping(right);
        left=removet(left);
        right=removet(right);    
        
        elements.push({ id:counter, source:name[left] , target: name[right],arrowHeadType:'arrowclosed' });  
        counter+=1;
    }

    return elements;
} 

  function hmapping(string){
      if (string.includes('source0'))
      {
          return 'start';
      } 
      if (string.includes('sink0'))
      {
          return 'end';
      } 
      return string;
  }

  function removet(string){
    string=string.replace('(p)','');
    string=string.replace('(t)','');  
    return string.trim();
}
 
     
export default AlphaMiner;
