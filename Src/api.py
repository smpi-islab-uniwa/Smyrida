import flask
import os
import os.path
from flask import jsonify
from flask import request 
import sys
import pm4py
from os import path  
import pandas as pd
import json  
from flask_cors import CORS 
import matplotlib.pylab as plt 
from matplotlib.pyplot import figure, scatter 
app = flask.Flask(__name__)
app.config["DEBUG"] = True
from pm4py import discovery as discover_algo  
from pm4py import vis as savesvgfromalgo   
from pm4py.objects.conversion.log.variants import df_to_event_log_1v as df_to_event_log_1vf
from pm4py.objects.log.util import dataframe_utils
from pm4py.objects.conversion.log import converter
from pm4py.objects.petri.align_utils import pretty_print_alignments 
from pm4py.objects.petri.exporter import exporter as pnml_exporter
from pm4py.evaluation import evaluator as evaluation_factory 
from csv import writer
import plotly.express as px 
from plotly.subplots import make_subplots
import plotly.graph_objects as go
from pm4py.objects.log.util import interval_lifecycle
from pm4py.statistics.start_activities.log.get import get_start_activities
from pm4py.statistics.end_activities.log.get import get_end_activities
from pm4py.statistics.traces.generic.log.case_statistics import get_variant_statistics
from pm4py.statistics.attributes.log.get import get_all_event_attributes_from_log, get_attribute_values
import sys
import sqlite3
import numpy as np
import textwrap

os.environ['IP'] = '127.0.0.1:5000'
cors = CORS(app, resources={r"/foo": {"origins": "http://localhost:5000"}})

app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0 



if os.path.exists('static') == False:
    os.makedirs('static')


def first_last(df):
        
        if(len(df) > 0):
                df_grouped = df.iloc[-1]
                
                if ("start_timestamp" in df.columns.values):
                    df_grouped["trace_duration"] = (df.iloc[-1]["time:timestamp"] - df.iloc[0]["start_timestamp"]).total_seconds() / 3600
                else:
                    df_grouped["trace_duration"] = (df.iloc[-1]["time:timestamp"] - df.iloc[0]["time:timestamp"]).total_seconds()
        return df_grouped

def filetype_isvalid(filetype):
    if any(ext in filetype for ext in  ['csv','xes','txt']):
        return True
    else:
        return False

def filetype_xes_isvalid(filetype):
    if any(ext in filetype for ext in  ['xes']):
        #print('isTrue')
        return True
    else:
        return False

def filetype_csv_isvalid(filetype):
    if any(ext in filetype for ext in  ['csv','txt']):
        #print('isTrue')
        return True
    else:
        return False


def read_request_file_to_dataframe():
    
         try:
             
             dataframe = pd.DataFrame()

             if request.method == 'POST':
                 filename = str(request.form.get('filename'))
                 filefolder = str(request.form.get('folder')) 
             if request.method == 'GET':
                 filename = str(request.args.get('filename')) 
                 filefolder = str(request.args.get('folder'))                
             
             #if filename is None: 
             #    return 'Missing parameter filename', dataframe  
             if filefolder is None: 
                 filefolder = 'filesfolder'

             if not path.exists(filefolder + '/' + filename):
                 return 'File not found', dataframe  
                             
             splitfile = filename.split('.', 1)
             if filetype_csv_isvalid(splitfile[-1]):    #It is csv file
                 if request.method == 'POST':
                     
                     case_concept_name = str(request.form.get('caseconcept'))   

                     time_timestamp = str(request.form.get('timestamp'))  

                     concept_name = str(request.form.get('conceptname'))
 
                     start_timestamp = str(request.form.get('startevent'))
 
                     seperator = str(request.form.get('seperator'))

                 if request.method == 'GET':
                        case_concept_name = str(request.args.get('caseconcept')) 
    
                        time_timestamp = str(request.args.get('timestamp'))   
    
                        concept_name = str(request.args.get('conceptname')) 
    
                        start_timestamp = str(request.args.get('startevent'))      
    
                        seperator = str(request.args.get('seperator'))                 
                     
                 if (seperator is None) or (case_concept_name is None) or (time_timestamp is None) or (concept_name is None): # or (start_timestamp is None): 
                     return 'Missing parameter(s)', dataframe     
    
                 dataframe = pd.read_csv(filefolder +'/' + filename, sep=seperator) 
    
                 dataframe.rename(columns={case_concept_name: 'case:concept:name'}, inplace=True)
    
                 dataframe.rename(columns={time_timestamp: 'time:timestamp'}, inplace=True)
    
                 dataframe.rename(columns={concept_name: 'concept:name'}, inplace=True)    
    
                 dataframe.rename(columns={start_timestamp: 'start_timestamp'}, inplace=True)  

                    
                
             if filetype_xes_isvalid(splitfile[-1]):    #It is xes file
                 
                 log = pm4py.read_xes(filefolder +'/'+ filename) 
                 if 'lifecycle:transition' in list(log[0][0].keys()):
                     log = interval_lifecycle.to_interval(log)

                 dataframe=pm4py.convert_to_dataframe(log)
                 
             else:
                 
                 return 'Unkown file format', dataframe  #perhaps errormessage                  
             
             return '', dataframe
         
             
         except Exception as e: 

             return str(e), dataframe
             

@app.route('/hello')
def hello_world():   
    return "hello world"  


@app.route('/conceptname', methods=['POST', 'GET'])
def conceptname():
    
    msg, dataframe = read_request_file_to_dataframe()
    #print('result\n',msg)
    #print('dataframe\n',dataframe)
    
    if dataframe.empty == False:
        fig = px.scatter(dataframe, x="time:timestamp", y="concept:name",  color="case:concept:name", title="Activities and Trace Ids Through Time", labels={
                "concept:name": "Activity",
                "case:concept:name" : "Trace ID",
                "time:timestamp": "Date"})
        fig.write_html('static/conceptname.html')  
        results = [{ 'image':'http://' + os.environ['IP'] + '/static/conceptname.html'}]

        response = jsonify(results)

        response.headers.set('Access-Control-Allow-Origin', '*')    

        response.headers.set('cache-control', 'public,max-age=0') 

        return response; 

    else:
        return errormessage(msg)


@app.route('/activities_traces', methods=['POST', 'GET'])
def activities_traces():
    
    msg, dataframe = read_request_file_to_dataframe()
    if dataframe.empty == False:
        fig = px.scatter(dataframe, x="concept:name", y="case:concept:name",  color="concept:name", title="Activities of Traces", labels={
                "concept:name": "Activity",
                "case:concept:name" : "Trace ID",
                })
        fig.write_html('static/activities_traces.html')  
        results = [{ 'image':'http://' + os.environ['IP'] + '/static/activities_traces.html'}]

        response = jsonify(results)

        response.headers.set('Access-Control-Allow-Origin', '*')    

        response.headers.set('cache-control', 'public,max-age=0') 

        return response; 

    else:
        return errormessage(msg)







@app.route('/activity_duration', methods=['POST', 'GET'])

def activity_duration():
    
    msg, dataframe = read_request_file_to_dataframe()
    #print('result\n',msg)
    #print('dataframe\n',dataframe)
    
    if dataframe.empty == False:             
                     
             if ("start_timestamp" in dataframe.columns.values):
                 
                 dataframe["duration"] = pd.to_datetime(dataframe['time:timestamp'],utc=True).astype('int64') - pd.to_datetime(dataframe["start_timestamp"],utc=True).astype('int64')  
        
                 # Durations of each Activity
                 fig = px.scatter(dataframe, y="duration", x = "time:timestamp", color="concept:name", size="duration", title="Activity Durations Through Time", labels={
                     "duration": "Activity Duration (s)",
                     "time:timestamp": "Date"
                     })
                              
                 fig.write_html('static/activity_durations.html')
        
                 apiresults = [{ 'image':'http://' + os.environ['IP'] + '/static/activity_durations.html'}]
        
                 response = jsonify(apiresults)
        
                 response.headers.set('Access-Control-Allow-Origin', '*')    
        
                 response.headers.set('cache-control', 'public,max-age=0') 
                     
                 return response; 
             else:
                 return errormessage('Cannot calculatate duration');
    
    else:
        return errormessage(msg)   



@app.route('/trace_duration', methods=['POST', 'GET'])

def trace_duration():
    
    msg, dataframe = read_request_file_to_dataframe()
    
    if dataframe.empty == False:   
                
                 df_grouped_trace = dataframe.groupby("case:concept:name", as_index=False).apply(first_last)
                 
                 fig = px.scatter(df_grouped_trace, y="trace_duration", x = "time:timestamp", color = "case:concept:name", size="trace_duration",
                                  title="Trace Durations Through Time", labels={
                                      "trace_duration": "Trace Duration (hours)",
                                      "case:concept:name": "Trace",
                                      "time:timestamp": "Date"
                                      }) 
    
                 
                 fig.write_html('static/trace_duration.html') 
    
                 apiresults = [{ 'image':'http://' + os.environ['IP'] + '/static/trace_duration.html'}]
    
                 response = jsonify(apiresults)
    
                 response.headers.set('Access-Control-Allow-Origin', '*')    
    
                 response.headers.set('cache-control', 'public,max-age=0') 
    
                 return response; 

    else:
        return errormessage(msg)   

                

@app.route('/mean_durations', methods=['POST', 'GET'])

def mean_durations():
    
    msg, dataframe = read_request_file_to_dataframe()
    
    if dataframe.empty == False:  
                 
                 if ("start_timestamp" in dataframe.columns.values):

                     dataframe["duration"] = pd.to_datetime(dataframe['time:timestamp'],utc=True).astype('int64') - pd.to_datetime(dataframe["start_timestamp"],utc=True).astype('int64')  

                     try:
                         dataframe["duration"] = dataframe["duration"] / 10**9
                     except Exception as e: 
                         errormessage(e)   

                     df_reduced = dataframe.groupby("concept:name", as_index=False)["duration"].mean()
                     #df_reduced = dataframe.groupby("concept:name", as_index=False)["@@duration"].mean()
                     #df_reduced["duration"] = df_reduced["duration"] / 10**9
    
    
                     fig = px.bar(df_reduced, y="duration", x ="concept:name", title="Mean Activity Duration", labels={
    
                         "duration": "Duration (s)",
    
                         "concept:name": "Activity"
    
                     })
                     fig.update_traces(marker_color='red')
    
                     fig.write_html('static/activity_mean_durations.html') 
    
                     apiresults = [{ 'image':'http://' + os.environ['IP'] + '/static/activity_mean_durations.html'}]
    
                     response = jsonify(apiresults)
    
                     response.headers.set('Access-Control-Allow-Origin', '*')    
    
                     response.headers.set('cache-control', 'public,max-age=0') 
    
                     return response; 
                 else:
                     return errormessage("Cannot calculate mean duration")

    else:
        return errormessage(msg)



@app.route('/activity_frequency_duration', methods=['POST', 'GET'])

def activity_frequency_duration():
    
    msg, dataframe = read_request_file_to_dataframe()

    if dataframe.empty == False:  
        df = dataframe
        df = df.groupby('concept:name').count()
                 
        if ("start_timestamp" in dataframe.columns.values):

            dataframe["duration"] = pd.to_datetime(dataframe['time:timestamp'],utc=True).astype('int64') - pd.to_datetime(dataframe["start_timestamp"],utc=True).astype('int64')  

            try:
                dataframe["duration"] = dataframe["duration"] / 10**9
            except Exception as e: 
                errormessage(e)

            df_reduced = dataframe.groupby("concept:name", as_index=False)["duration"].mean()
                    
        fig = go.Figure(data=
            [
                go.Bar(name = 'Frequency', x=df.index, y=df["case:concept:name"]),
                go.Bar(name = 'Mean Duration', y=df_reduced.duration, x =df_reduced["concept:name"])
            ]
        )


        # Change the bar mode
        fig.update_layout(barmode='group')
        fig.write_html('static/activity_frequency_duration.html') 
    
        apiresults = [{ 'image':'http://' + os.environ['IP'] + '/static/activity_frequency_duration.html'}]

        response = jsonify(apiresults)

        response.headers.set('Access-Control-Allow-Origin', '*')    

        response.headers.set('cache-control', 'public,max-age=0') 

        return response; 


    else:
        return errormessage(msg)





@app.route('/variants_count', methods=['POST', 'GET'])

def variants_count():
    

        #check this log converted to dataframe and again to log
        msg, dataframe = read_request_file_to_dataframe() 
        if dataframe.empty == False: 
            #notraces,noevents,tracelist,start_activities,end_activities,dictionary = firstassignment(log)  
            log = pm4py.convert_to_event_log(dataframe)
            #print('dataframe\n',dataframe)
            variants = get_variant_statistics(log) 
            #print('variants\n',type(variants))
            #print(len(variants))
            df = pd.DataFrame(variants)
            #print('df\n',df)
            fig = px.bar(df, y="variant", x ="count", title="Variants Frequency", labels = {'variant':'Variants','count':'Frequency'})
    
            fig.write_html('static/variants_count.html') 
    
            apiresults = [{ 'image':'http://' + os.environ['IP'] + '/static/variants_count.html'}]
    
            response = jsonify(apiresults)
    
            response.headers.set('Access-Control-Allow-Origin', '*')    
    
            response.headers.set('cache-control', 'public,max-age=0') 
    
            return response; 
        else:
            return errormessage("No data in the file")

@app.route('/variants', methods=['POST', 'GET'])

def variants():
    

        #check this log converted to dataframe and again to log
        msg, dataframe = read_request_file_to_dataframe() 
        if dataframe.empty == False: 
            #notraces,noevents,tracelist,start_activities,end_activities,dictionary = firstassignment(log)  
            log = pm4py.convert_to_event_log(dataframe)
            variants = get_variant_statistics(log) 
            #print(type(variants))
            #df = pd.DataFrame(variants)
            
            var_dict = []
            variant_list = []
            var_count = []
            for var in variants:
                #var_dict.append({'variant': var['variant'].split(','), 'count': var['count']})
                variant_list.append(var['variant'].split(','))
                var_count.append(var['count'])
            #print(variant_list)    
            #print(var_count)
            #print(len(variant_list))    
            #print(len(var_count))
            var_count = np.divide(var_count, sum(var_count))
            var_count = ['{:.3f}%'.format(el) for el in var_count]
            
            #print(var_count)
            
            import plotly.graph_objects as go
            #x-axis number of activities for each trace
            vlengths = [len(v) for v in variant_list]

            #produce colormap with as many colors as there are unique values in df
            import matplotlib._color_data as mcd
            colors = [name for name in mcd.CSS4_COLORS if "xkcd:" + name in mcd.XKCD_COLORS][0:max(vlengths)]
            
            events = get_attribute_values(log,'concept:name')            
             
            map(str, np.arange(0, len(var_count))) 
            labels = list(map(' - '.join, zip(map(str, np.arange(0, len(var_count))) , var_count)))
            #print('labels ',labels)
            events = pd.DataFrame.from_dict(events.keys())
            events.columns=['event']
            #print('Y-AXIS ', np.arange(0.0, len(var_count)*0.2, 0.2).tolist())
            fig = go.Figure(layout_yaxis_range=[0, len(var_count)], layout_xaxis_range=[0, max(vlengths)*0.4])
            
            fig.update_layout(height=3000)
            #fig.update_layout(showlegend=True)

            #fig.update_xaxes(range=[0, max(vlengths)])
            fig.update_layout(  
                yaxis = dict(
                    tickmode = 'array',
                    tickvals = np.arange(0, len(var_count)),
                    ticktext = labels
                )
            )
            fig.update_layout(
                xaxis = dict(
                    tickmode = 'array',
                    tickvals = np.arange(0, max(vlengths)*0.4, 0.4),
                    ticktext = ['' for i in np.arange(0, max(vlengths)*0.4, 0.4)]
                )
            )            
            
            i=0
            for variant in variant_list:
                v = ', '.join(variant)
                fig.add_trace(go.Scatter(
                    x=[0],
                    y=[i],
                    mode="text",
                    name= str(i) +': ' + '<br>'.join(v[i:i+180] for i in range(0, len(v), 180)),
                    #showlegend=False,
                    #text=str(i) +': ' + '<br>'.join(v[i:i+180] for i in range(0, len(v), 180)), #variant,
                    #textposition="top center"
                    
                ))                    

                #print(variant, i)
                j=0
                for act in variant:
                    #print(act, j)
                    x = int(events[events['event'] == act].index.to_list()[0])
                    fig.add_shape(type="rect",
                        #xref = 'x',
                        #yref = 'y',
                        #layer='above',
                        x0=j, y0=i,
                        x1=j+0.4, y1=i+0.2,
                        fillcolor=colors[x],
                    )
                    j=j+0.4
                i=i+1    
            #print('i ',i)
            #print('j ',j)
            #fig.update_layout()
            fig.update_layout(legend=dict(
                orientation="h",
                #yanchor="bottom"#,
                #y=1.02,
                #xanchor="right",
                #x=1
                #loc="lower center"
            ))

            fig.write_html('static/variants.html')

            apiresults = [{ 'image':'http://' + os.environ['IP'] + '/static/variants.html'}]
    
            response = jsonify(apiresults)
    
            response.headers.set('Access-Control-Allow-Origin', '*')    
    
            response.headers.set('cache-control', 'public,max-age=0') 
    
            return response; 
        else:
            return errormessage("No data in the file")

 
@app.route('/savefile', methods=['POST']) 
def savefile(): 
    file = request.files['file']    #the file react sends
    #print('file ',file)
    filename = file.filename #name of react sends
    #print('filename ',filename)

    filefolder = str(request.form.get('folder'))
    if filefolder is None:
        filefolder = 'filesfolder'
    #print('filefolder ',filefolder)
     
    splitedfile = filename.split('.', 1)
    if filetype_isvalid(splitedfile[-1]):   #we only save on server side xes csv files
        if not os.path.exists(filefolder):  #create folder if doesn't exist
            os.makedirs(filefolder) 
        if path.exists(filefolder+'/'+filename):                #overwrite file if exists
            os.remove(filefolder+'/'+filename) 
        file.save(filefolder+'/'+filename)  #save file
    apiresults = [{'filename':str(filename)}]
    response = jsonify(apiresults) 
    response.headers.set('Access-Control-Allow-Origin', '*')   
    return response  
    
 
@app.route('/authenticate', methods=['POST','GET']) 
def authenticate(): 
 
    usermail = str(request.form.get('usermail'))
    password = str(request.form.get('password'))   
    found=False 
    if path.exists('smyrida.db'):
        con = sqlite3.connect('smyrida.db')
        cur = con.cursor() 

        for row in cur.execute("SELECT username FROM users where username = ? AND password = ?" ,(usermail,password,)):
            found=True
        
        con.close()  
        if found == True: 
            filefound = False
            for  root, directories,files in os.walk(usermail):
                for filename in files: 
                    splitedfile = filename.split('.', 1)
                    if filetype_isvalid(splitedfile[-1]):
                        filefound = True
                            
            apiresults = [{'success':usermail,'hasfiles':filefound}]  
            response = jsonify(apiresults)
            response.headers.set('Access-Control-Allow-Origin', '*')    
            response.headers.set('cache-control', 'public,max-age=0')  
            return response                   
        else: 
            return errormessage('Please provide a valid e-mail or password')
    else:
        errormessage('Database does not exist')    #geo change
        con = sqlite3.connect('smyrida.db')
        cur = con.cursor() 

        cur.execute('''
                CREATE TABLE IF NOT EXISTS users
                ([username] TEXT PRIMARY KEY, [password] TEXT)
                ''')    
         
        con.commit()        
        con.close()
     

@app.route('/createuser', methods=['POST']) 
def createuser():  
    found=False
    usermail = request.form.get('usermail')     
    password = request.form.get('password')  
    if not os.path.exists(usermail+'/'): 
                os.makedirs(usermail+'/')    
    if path.exists('smyrida.db'):
        con = sqlite3.connect('smyrida.db')
        cur = con.cursor() 
        for row in cur.execute("SELECT username FROM users where username = '%s'" % usermail):
            con.close()  
            return errormessage('This user already exists!') 
        cur.execute("INSERT INTO users VALUES ('"+usermail+"','"+password+"')") 
        con.commit() 
        con.close()           
        apiresults = [{'success':usermail}] 
        response = jsonify(apiresults)
        response.headers.set('Access-Control-Allow-Origin', '*')    
        response.headers.set('cache-control', 'public,max-age=0')  
        return response       
    else:
         con = sqlite3.connect('smyrida.db')
         cur = con.cursor() 
         cur.execute('''CREATE TABLE users
                       (username text, password text)''') 
         cur.execute("INSERT INTO users VALUES ('"+usermail+"','"+password+"')") 
         con.commit() 
         con.close()  
         apiresults = [{'success':usermail}] 
         response = jsonify(apiresults)
         response.headers.set('Access-Control-Allow-Origin', '*')    
         response.headers.set('cache-control', 'public,max-age=0')  
         return response 

 
@app.route('/getfilenames', methods=['POST']) 
def getfilenames():  
    filefolder = str(request.form.get('folder'))
    if filefolder is None:
        filefolder='filesfolder'

    filenames=[]
    if  os.path.exists(filefolder): 
        for  root, directories,files in os.walk(filefolder):
            for filename in files: 
                splitedfile = filename.split('.', 1)
                if filetype_isvalid(splitedfile[-1]):
                    filenames.append(filename)
    else:
         os.makedirs(filefolder+'/') 
    apiresults = [
                    { 
                    'filenames':filenames   #list(log_csv.columns.values)
                    }
                 ]
    response = jsonify(apiresults)
    response.headers.set('Access-Control-Allow-Origin', '*')    
    response.headers.set('cache-control', 'public,max-age=0')  
    return response       
    
@app.route('/headers', methods=['POST']) 
def headers(): 
    csvinput = request.form.get('filename')      #returns a list of headers of a csv file
    filefolder = str(request.form.get('folder'))
    separator = str(request.form.get('seperator'))
    print('headers ',csvinput, filefolder, separator)
    dataframe = pd.DataFrame({})
    if filefolder is None:
        filefolder='filesfolder'
    if separator is None or separator == '':
        separator == ' '
    #print('separator ', separator)
    #if separator == '':
        print('empty separator', separator)
    print(filefolder+'/'+csvinput)    
    try:
        dataframe = pd.read_csv(filefolder+'/'+csvinput, sep = separator)   #if seperator is wrong error will be returned
    except Exception as e: 
         print(e)
         
    print(dataframe)
    apiresults = [
                    { 
                    'dataheaderslist':list(dataframe.columns.values)
                    }
                 ]
    response = jsonify(apiresults)
    response.headers.set('Access-Control-Allow-Origin', '*')    
    response.headers.set('cache-control', 'public,max-age=0')  
    return response             
    
@app.route('/convertocsv', methods=['POST', 'GET'])
def convertocsv(): 
    try:
        if request.method == 'POST':
            xes = str(request.form.get('filename'))
            filefolder = str(request.form.get('folder'))
        if request.method == 'GET': 
            xes = str(request.args.get('filename'))
            filefolder = str(request.args.get('folder'))
        if xes is None:
            return errormessage('Missing parameter filename')
        if filefolder is None:
            filefolder = 'filesfolder'
        
        splitfile = xes.split('.', 1) 
        if not filetype_xes_isvalid(splitfile[-1]):   #file is not xes 
            return errormessage('Not valid xes file')
         
      
        #start = xes.replace('.xes', '')  
        if path.exists(filefolder + '/' + xes): #if it exists on server 
                log = pm4py.read_xes(filefolder + '/' + xes)    #get log
                #convert to log taking into account lifecycle transition
                if 'lifecycle:transition' in list(log[0][0].keys()):
                    log = interval_lifecycle.to_interval(log)
                #convert to dataframe
                dataframe=pm4py.convert_to_dataframe(log)

                if path.exists(filefolder + '/' + splitfile[0] + '.csv'):  #overwrite if exists
                    os.remove(filefolder + '/' + splitfile[0] + '.csv')  
                dataframe.to_csv(filefolder + '/' + splitfile[0] + '.csv', index=False, na_rep='false')  #convert to csv
                apiresults = [{'csvname':str(splitfile[0] + '.csv')}]
                response = jsonify(apiresults) 
                response.headers.set('Access-Control-Allow-Origin', '*')   
                return response    
        else:
                return errormessage('File not found')
    except Exception as e:
        errormessage(e) 
    
@app.route('/convertoxes',  methods=['POST', 'GET'])      
def convertoxes(): 
    try:   
        if request.method == 'POST': 
            csvinput = request.form.get('filename')  
            case_concept_name = str(request.form.get('caseconcept'))   
          
            time_timestamp = str(request.form.get('timestamp'))  
            concept_name = str(request.form.get('conceptname'))
            start_timestamp = str(request.form.get('startevent'))
            seperator = str(request.form.get('seperator'))
            filefolder = str(request.form.get('folder'))

        if request.method == 'GET': 
            csvinput = str(request.args.get('filename'))
            case_concept_name = str(request.args.get('caseconcept')) 
            time_timestamp = str(request.args.get('timestamp'))   
            concept_name = str(request.args.get('conceptname')) 
            start_timestamp = str(request.args.get('startevent'))      
            seperator = str(request.args.get('seperator'))
            filefolder = str(request.args.get('folder'))
      
        if request.form.get('folder') is None:
            filefolder='filesfolder'
       
        if (seperator is None) or (case_concept_name is None) or (time_timestamp is None) or (concept_name is None): # or (start_timestamp is None): 
            return errormessage('Missing parameter(s)')
        splitfile = csvinput.split('.',1)
        if not filetype_csv_isvalid(splitfile[-1]): 
            return errormessage('Not valid csv file')
        log = ""
        dataframe = None 
        start = csvinput.replace('.csv', '')  
        if path.exists(filefolder + '/' + csvinput):  
         
            dataframe = pd.read_csv(filefolder + '/' + csvinput, sep=seperator) 
            dataframe.rename(columns={case_concept_name: 'case:concept:name'}, inplace=True)
            dataframe.rename(columns={time_timestamp: 'time:timestamp'}, inplace=True)
            dataframe.rename(columns={concept_name: 'concept:name'}, inplace=True)    
            if start_timestamp is not None:
                dataframe.rename(columns={start_timestamp: 'start_timestamp'}, inplace=True)    
            log=pm4py.convert_to_event_log(dataframe)  
            
            if path.exists(filefolder + '/' + splitfile[0] + '.xes'):
                os.remove(filefolder + '/' + splitfile[0] + '.xes')                 
            pm4py.write_xes(log,filefolder + '/' + splitfile[0] + ".xes") 
            
            apiresults = [{'xesname':str(splitfile[0] + '.xes')}]
            response = jsonify(apiresults) 
            response.headers.set('Access-Control-Allow-Origin', '*')   
            return response; 
        else:
             return errormessage('File not found');
    except Exception as e:
        return errormessage(e)     

@app.route('/view', methods=['POST', 'GET'])
def view(): 
    try:
        if request.method == 'POST':
            filename = str(request.form.get('filename'))  
            filefolder = str(request.form.get('folder'))
            seperator=str(request.form.get('seperator')) 
        if request.method == 'GET':
            filename = str(request.args.get('filename'))   
            filefolder = str(request.args.get('folder'))
            seperator=str(request.args.get('seperator')) 
        if filename is None:
            return errormessage('Missing parameter filename')
        if filefolder is None:    
            filefolder='filesfolder'
        splitfile = filename.split('.', 1)

        if filetype_isvalid(splitfile[-1]) == False: #if file is not xes or csv
            return errormessage('Not valid file type')
        if not path.exists(filefolder + '/' + filename):#if file does not exist on server
            return errormessage('File does not exist');
        if filetype_xes_isvalid(splitfile[-1]): #xes file
            log = pm4py.read_xes(filefolder + '/' + filename)  #get log from file
            dataframe = pm4py.convert_to_dataframe(log)  #convert to dataframe

        if filetype_csv_isvalid(splitfile[-1]): #csv file
            if seperator is None:
                return errormessage('Missing separator')
            dataframe = pd.read_csv(filefolder + '/' + filename, sep=seperator)   #get log from file

        dataframedict = dataframe.to_json(orient="index",date_format='iso') 
        parsed = json.loads(dataframedict) 
       
        apiresults = [
            { 
            # 'view':json.dumps(parsed, indent=4)  #serialize dataframe
                'view':parsed 
            }   
            ]   
        
        response = jsonify(apiresults)
        response.headers.set('Access-Control-Allow-Origin', '*')    
        response.headers.set('cache-control', 'public,max-age=0') 
        return response         
    except Exception as e:
        return errormessage(e) 
            

 
@app.route('/', methods=['POST', 'GET'])
def api_all():
    return ''
                
@app.route('/statistics', methods=['POST', 'GET'])
def statistics():   
    try:
        #check this log converted to dataframe and again to log
        msg, dataframe = read_request_file_to_dataframe() 
        if dataframe.empty == False: 
            #notraces,noevents,tracelist,start_activities,end_activities,dictionary = firstassignment(log)  
            log = pm4py.convert_to_event_log(dataframe)
            dataframe['time:timestamp'] = pd.to_datetime(dataframe['time:timestamp'],utc=True)
            dataframe = dataframe.sort_values('time:timestamp')
            #log = sort_log()
            
            notraces = len(dataframe['case:concept:name'].unique())
            events = get_attribute_values(log,'concept:name')
            noevents = len(events)
            
            start_activities = get_start_activities(log)
            end_activities = get_end_activities(log) 
            variants = get_variant_statistics(log) 
            start_period = dataframe['time:timestamp'][0]
            end_period = dataframe['time:timestamp'].iloc[-1] 
          #  print(end_period)
          
            
            apiresults = [
                        {
                        'notraces': notraces,
                        'noevents': noevents, 
                        #'start_period': start_period, 
                        #'end_period': end_period, 
                        #'tracelist': str(tracelist), 
                        'startactivities':start_activities,
                        'endactivities':end_activities,   
                        'events':events,
                        'variants': variants 
                        }   
                        ]   
            
            response = jsonify(apiresults) 
            response.headers.set('Access-Control-Allow-Origin', '*')    
            response.headers.set('cache-control', 'public,max-age=0') 
            return response 
    except Exception as e:
        return errormessage(e)         



@app.route('/graph', methods=['POST', 'GET'])
def graph(): 
    try:
        
        msg, dataframe = read_request_file_to_dataframe()
        if dataframe.empty == False:
            df = dataframe.groupby('concept:name').count()['case:concept:name']
            fig = px.bar(df, x=df.index, y="case:concept:name", title="Frequencies of Activities", labels={
                "concept:name": "Activity",
                "case:concept:name" : "Occurencies",
                })
            fig.write_html('static/graph.html') 

            results = [{ 'image':'http://' + os.environ['IP'] + '/static/graph.html'}]

            response = jsonify(results)

            response.headers.set('Access-Control-Allow-Origin', '*')    

            response.headers.set('cache-control', 'public,max-age=0') 

            return response 

        else:
            return errormessage(msg)

    except Exception as e:
        return errormessage(e)    


               
@app.route('/getimage', methods=['POST', 'GET'])
def getimage():
    try:
        msg, dataframe = read_request_file_to_dataframe()
        if request.method == 'POST':
            sitealgo = request.form.get('sitealgo') 
        if request.method == 'GET':
            sitealgo = request.args.get('algorithm')  
        if sitealgo is None:
            return errormessage('Mising parameter algorithm')
        
        if dataframe.empty == False:
            #check here log converted to dataframe and again dataframe to log - performance delay
            log = pm4py.convert_to_event_log(dataframe)  #get log of xes file

            if int(sitealgo) == 1: #pm4py discover_algo functions for the three algorithms
                net,initial_marking,final_marking = discover_algo.discover_petri_net_alpha(log) 
            elif int(sitealgo) == 2:
                net,initial_marking,final_marking = discover_algo.discover_petri_net_inductive(log) 
            elif int(sitealgo) == 3:
                net,initial_marking,final_marking  = discover_algo.discover_petri_net_heuristics(log) 
            #fitnesses= pm4py.evaluate_fitness_tbr(log, net, initial_marking, final_marking)
            #evaluationresult = pm4py.evaluate_precision_tbr(log, net, initial_marking, final_marking) 
            evaluation=evaluation_factory.apply(log, net, initial_marking, final_marking)  #evalution object 
            netplaces=list(net.places)  #petrinet places
            nettransitions=list(net.transitions) #petrinet transitions
            netarcs=list(net.arcs)  #petrinet arcs
            placeslist = []
            transitionlist =[]
            arcslist = []
            for eachplaces in netplaces:
                placeslist.append(str(eachplaces))
            
            for eachtransition in nettransitions:  
                transitionlist.append(str(eachtransition))
                
            for eacharc in netarcs:
                arcslist.append(str(eacharc))    
            file_path="static/temp.svg" 
            savesvgfromalgo.save_vis_petri_net(net, initial_marking, final_marking,file_path) 
        
            apiresults = [{ 'image':'http://' + os.environ['IP'] + '/static/temp.svg',
                            'log_fitness':evaluation['fitness']['log_fitness'],
                            'evaluation_result':evaluation['precision'],
                            'generalization':evaluation['generalization'],
                            'simplicity':evaluation['simplicity'],
                            'netplaces':placeslist,
                            'nettransitions':transitionlist,
                            'netarcs':arcslist
                            }]
            response = jsonify(apiresults)
            response.headers.set('Access-Control-Allow-Origin', '*')    
            response.headers.set('cache-control', 'public,max-age=0') 
            return response
        else:
            return errormessage(msg)

    except Exception as e:
        return errormessage(e)  
                
       
@app.route('/getreplayresults', methods=['POST', 'GET'])
def getreplayresults():
    try: 
        msg, dataframe = read_request_file_to_dataframe()
        if request.method == 'POST':
            sitealgo = request.form.get('sitealgo') 
        if request.method == 'GET':
            sitealgo = request.args.get('algorithm')  
        if sitealgo is None:
            return errormessage('Mising parameter algorithm')

        if dataframe.empty == False:
            #check here log converted to dataframe and again dataframe to log - performance delay
            log = pm4py.convert_to_event_log(dataframe)  #get log of xes file
            if int(sitealgo) == 1: 
                net,initial_marking,final_marking = discover_algo.discover_petri_net_alpha(log)
            elif int(sitealgo) == 2:
                net,initial_marking,final_marking = discover_algo.discover_petri_net_inductive(log) 
            elif int(sitealgo) == 3:
                net,initial_marking,final_marking  = discover_algo.discover_petri_net_heuristics(log) 
            conftbr = pm4py.conformance_tbr(log,net,initial_marking,final_marking)  #Pm4py conformance
            returndict=[]
            for each in conftbr:
                tempactivate=str(each['activated_transitions']).replace('[', '')
                tempactivate=tempactivate.replace(']', '')
                tempreached_marking=str(each['reached_marking']).replace('[', '')
                tempreached_marking=tempreached_marking.replace(']', '')
                temptransitions_with_problems=str(each['transitions_with_problems']).replace('[', '')
                temptransitions_with_problems=temptransitions_with_problems.replace(']', '')
                #Jsons we need to show on site
                tempdict= {
                                'trace_is_fit': each['trace_is_fit'],
                                'trace_fitness': each['trace_fitness'],
                                'activated_transitions': tempactivate,
                                'reached_marking': tempreached_marking,
                                'enabled_transitions_in_marking': str(each['enabled_transitions_in_marking']),
                                'transitions_with_problems':temptransitions_with_problems,
                                'missing_tokens': each['missing_tokens'],
                                'consumed_tokens': each['consumed_tokens'],
                                'remaining_tokens': each['remaining_tokens'],
                                'produced_tokens':each['produced_tokens'] 
                            }    
                returndict.append(tempdict) 
            apiresults = [{ 'dictionary': returndict }]
            response = jsonify(apiresults)
            response.headers.set('Access-Control-Allow-Origin', '*')    
            response.headers.set('cache-control', 'public,max-age=0') 
            return response 
        else:
            return errormessage(msg)

    except Exception as e:
        return errormessage(e)  

@app.route('/getalignments', methods=['POST', 'GET'])
def getalignments():
    try:
        
        msg, dataframe = read_request_file_to_dataframe()
        if request.method == 'POST':
            sitealgo = request.form.get('sitealgo') 
        if request.method == 'GET':
            sitealgo = request.args.get('algorithm')  
        if sitealgo is None:
            return errormessage('Mising parameter algorithm')

        if dataframe.empty == False:
            #check here log converted to dataframe and again dataframe to log - performance delay
            log = pm4py.convert_to_event_log(dataframe)  #get log of xes file
            if int(sitealgo) == 1:  #get net from specific algorithm
                net,initial_marking,final_marking = discover_algo.discover_petri_net_alpha(log)
            elif int(sitealgo) == 2:
                net,initial_marking,final_marking = discover_algo.discover_petri_net_inductive(log) 
            elif int(sitealgo) == 3:
                net,initial_marking,final_marking  = discover_algo.discover_petri_net_heuristics(log) 
            alignments = pm4py.conformance_alignments(log,net,initial_marking,final_marking)   #get conformance aligments
            # pretty_print_alignments(alignments)
            returndict=[] 
            for each in alignments:
                tempdict= {
                            'alignment': each['alignment']
                }  
                returndict.append(tempdict)   
            apiresults = [{ 'dictionary': returndict }]  
            response = jsonify(apiresults)
            response.headers.set('Access-Control-Allow-Origin', '*')    
            response.headers.set('cache-control', 'public,max-age=0') 
            return response 
        else:
            return errormessage(msg)

    except Exception as e:
        return errormessage(e)       

 
def servererror():
            e = sys.exc_info()[0]
            apiresults = [{'error': '500 ' + str(e)}]
            response = jsonify(apiresults)
            response.headers.set('Access-Control-Allow-Origin', '*')    
            response.headers.set('cache-control', 'public,max-age=0')  
            return response     
def errormessage(message):
            apiresults = [{'api_error': message}]
            response = jsonify(apiresults)
            print('response\n', response)
            response.headers.set('Access-Control-Allow-Origin', '*')    
            response.headers.set('cache-control', 'public,max-age=0')  
            print('response\n', response)
            return response              
def badrequest():
            apiresults = [{'400':'Bad request'}]
            response = jsonify(apiresults)
            response.headers.set('Access-Control-Allow-Origin', '*')    
            response.headers.set('cache-control', 'public,max-age=0')  
            return response   

if __name__ == '__main__':
    app.run(host='0.0.0.0')
 
