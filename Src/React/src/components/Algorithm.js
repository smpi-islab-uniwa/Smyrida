import React, { Component } from 'react';   
import ReactFlow from 'react-flow-renderer';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"; 
class Algorithm extends Component { 
    render(){ 
        var trans=this.props.trans;
        var elements=[]; 
        if(trans.length>0){ 
        var places=this.props.places;
        var  arcs=this.props.arcs; 
        var allfound=false; 
        /*initialize*/
        var allelements={}; 
        var y={};
        var max=0;  
        var inity=100;        
        for (var x in trans)
        {   
           
            var inittrafound=false; 
            var hasleft = false; 
             
            for (let z in arcs){    
                if (arcs[z].includes(trans[x])){   
                        allelements[hmapping(trans[x])]="transition";
                        inittrafound=true;
                        break; 
                }  
            } 
            for (let  z in arcs){   
                var right=arcs[z].split('->')[1];  
                var left=arcs[z].split('->')[0];
                if(right.includes(trans[x])&&right.includes('(t)')){
                    hasleft=true;
                    break;
                }  
            }   
           
            if (inittrafound===false){  
                elements.push({ id: trans[x].toString(),    data: { label:trans[x].toString()  },sourcePosition:'right',targetPosition:'left',position: { x: 0, y: inity },style:{'width': '100px'}});
                inity+=100; 
            }else{
            if(hasleft===false){
                    
                    allelements[hmapping(trans[x])]="0~transition"; 
                }
            }
            
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
            for (let x in arcs){  
                left=arcs[x].split('->')[0];
                right=arcs[x].split('->')[1]; 
                left=hmapping(left);
                right=hmapping(right);
                left=removet(left);
                right=removet(right);     
                    if((allelements[left].includes('~')) && (allelements[right].includes('~')===false )) {  
                        allelements[right]=(parseInt(allelements[left].split('~')[0])+1).toString()+'~'+allelements[right];
                        break;
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
        allelements=sortObjectByKeys(allelements); 
        for(x in allelements){   
                                if(allelements[x].split('~')[1]==="places"){ 
                                    if (x==='end'){
                                        elements.push({id: name[x],type: 'input',data: { label: '' },sourcePosition:'left',position: { x: (max)*100+130, y: 8 },draggable: true,style:{width: '35px',height: '35px','borderRadius': '50%', 'paddingTop': '17px','borderColor':'black','backgroundColor': 'orange'} });
                                    }
                                    else if (x==='start'){
                                        elements.push({id:  name[x],type: 'input',data: { label: '' },sourcePosition:'right',position: { x: 0, y: 8 },draggable: true,style:{width: '35px',height: '35px','borderRadius': '50%', 'paddingTop': '17px','borderColor':'black','backgroundColor': 'green'} });
                                        }
                                    else{ 
                                        elements.push({id:  name[x],data: { label: ''  },sourcePosition:'right',targetPosition:'left',position: { x: parseInt(allelements[x].split('~')[0])*100+30, y: parseInt(y[allelements[x].split('~')[0]])+8 },draggable: true,style:{width: '35px',height: '35px','borderRadius': '50%','borderColor':'black','backgroundColor': 'white'} });
                                        y[allelements[x].split('~')[0]]+=110;
                                    }                            
                                }
                                else{ 
                                    //alert(x);
                                    if (x.includes('hid')||x.includes('skip')||x.includes('tauSplit')||x.includes('tauJoin')||x.includes('init_loop')||x.includes('loop_')){ 
                                        elements.push({ id:name[x],    data: { label:''  },sourcePosition:'right',targetPosition:'left', position: { x: parseInt(allelements[x].split('~')[0])*100, y:  y[allelements[x].split('~')[0]]  },style:{'width': '108px','backgroundColor': 'black','min-height':'50px'}});
                                    }
                                    else{ 
                                        elements.push({ id: name[x],    data: { label:x.toString()  },sourcePosition:'right',targetPosition:'left',position: { x: parseInt(allelements[x].split('~')[0])*100, y:  y[allelements[x].split('~')[0]]  },style:{'width': '100px','min-height':'50px'}});
                                        }
                                    y[allelements[x].split('~')[0]]+=110;
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
            elements.push({ id:counter, source:name[left] , type: 'straight', target: name[right],arrowHeadType:'arrowclosed' });  
            counter+=1;
        }
    }
        return(
            <ReactFlow  elements={elements}  />
            );
    } 
}

function hmapping(string){
    if (string.includes('source'))
    {
        return 'start';
    } 
    if (string.includes('sink'))
    {
        return 'end';
    } 
    return string;
}

function removet(string){
  string=string.replace('(p)','');
  string=string.replace('(t)','');  
  return string;
}

function sortObjectByKeys(obj) {
    return Object.keys(obj).sort().reduce((res, key) => (res[key] = obj[key], res), {});
}
export default Algorithm;
