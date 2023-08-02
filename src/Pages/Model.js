import ReactFlow, {
    Controls,
    useNodesState,
    useEdgesState,
  } from 'react-flow-renderer';
import { SmartBezierEdge } from '@tisoap/react-flow-smart-edge';
import React, {useState, useEffect}from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios'
import TOC from '../Components/TOC'
import jsonData from '../model_names.json'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Result from '../Components/Result'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../App.css'
import download from 'downloadjs';

const Model = () =>{
    const [files, setFiles] = useState("");
    const [prediction, setPrediction] = useState([]); 
    const [model, setModel] = useState([]);
    const [currModel, setCurrModel] = useState([]);
    const [fileindex,setfileindex]= useState(0);
    const [current,setCurrent]= useState(0);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [colormap, setcolormap] = useState(new Map())
    const [colors2, setcolors] = useState([[],[],[]])
    const [cm, setcm] = useState(new Map())
    const [filename, setfilename] = useState("")
    const [modelFile, setmodelFile] = useState(null)
    let temp=[]
    const models = jsonData.models
    const edgeTypes = {
        smart: SmartBezierEdge
    }
    const colors = ['limegreen','antiquewhite','indianred','darksalmon','red','darkred','pink','hotpink','deeppink','mediumvioletred','tomato','orangered','darkorange','orange','aqua','aquamarine','blue','chocolate','blueviolet','cadetblue','burlywood','chartreuse','cyan','darkcyan','darkblue','darkgoldenrod','darkgrey','darkkhaki','darkslategrey','forestgreen','ivory','lemonchiffon','lime','mediumslateblue','mistyrose','peru','rebeccapurple','rosybrown','seashell','steelblue','tan','teal','thistle','wheat','yellow','silver','blanchedalmond','cornsilk','grey','indigo'];
 
    const fileRead = e => {
        e.preventDefault();
        var filereader=new FileReader();
        filereader.readAsText(e.target.files[0], "UTF-8");
        filereader.onload = e => {
            setFiles(JSON.parse(e.target.result));
        }; 
    }
    const modelRead = e => {
        e.preventDefault();
        console.log(e.target.files[0]);
        setmodelFile(e.target.files[0]);
    }
    useEffect(()=> {
        const current = files[fileindex]
        if(current)
        {
            let map1 = new Map()
            let tempcolor= new Map()
            const tempnodes=[];
            let y=4;
            let i=0
            let store =current.entity_ref_dict
            for (const access in store) {
                map1.set(access.toLowerCase(),store[access])
            }
            for (let [key, value] of map1) {
                //do arrays instead of lists
                var node = [{id: value, data: {label: value},position:{x:(-400+200*(i%4)),y:200*y}, style:{color: colors[tempnodes.length]}}]
                if(i%4===3)
                    y-=1;
                tempnodes.push(node[0])
                tempcolor.set(value.toLowerCase(),colors[tempnodes.length-1])
                setcm(cm.set(colors[tempnodes.length-1],value))
                i=i+1
            }
            const tempedges=[];
            for (const access in current.keep_triples)
            {
                let index=-1
                if(tempedges.length!=0)
                    index = tempedges.findIndex(x=>(x.source.toLowerCase()===current.keep_triples[access][0].toLowerCase() && x.target.toLowerCase()===current.keep_triples[access][2].toLowerCase()))
                if(index===-1)
                {
                    
                    tempedges.push({id: (access).toString(), type: 'smart', source:current.keep_triples[access][0], 
                    target:current.keep_triples[access][2], label:current.keep_triples[access][1], markerEnd: {
                    type: "arrowclosed", color: 'black'
                  },style: { stroke: 'black' }})   
                }
                else
                {
                    if(tempedges.length!=0)
                    {
                        tempedges[index].label+=", "+current.keep_triples[access][1]
                    }
                }
            }
            setNodes(tempnodes.sort((a, b) => {
                return a.id.length - b.id.length;
            }))
            setEdges(tempedges)
            setcolormap(tempcolor)
        }
    },[files,fileindex]);
    useEffect(()=> {
        let colorstore=[]
        const nonAlphaNumeric = /\W/;
        
        for(const ele of prediction)
        {
            const xIndices = nodes.flatMap(x => {
            let indices = [];
            let index = ele.toLowerCase().indexOf(x.id.toLowerCase());
            while (index !== -1) {
                let id = x.id.toLowerCase()
                indices.push({ id, index });
                index = ele.toLowerCase().indexOf(x.id.toLowerCase(), index + 1);
            }
            return indices;
        });

            const filteredIndices = xIndices.filter(index1 => {
                for (const index2 of xIndices) {
                    if (index1.index == index2.index && index1.id !== index2.id && index2.id.toLowerCase().includes(index1.id.toLowerCase()))
                    {
                        return false;
                    }
                }
                
                  const startIndex = index1.index;
                  const endIndex = startIndex + index1.id.length;
                  const beforePhrase = ele[startIndex - 1];
                  const afterPhrase = ele[endIndex];
                  return (nonAlphaNumeric.test(beforePhrase) || startIndex == 0) && (nonAlphaNumeric.test(afterPhrase)  || endIndex == ele.length);
            });

            var temp2 = (ele).toLowerCase();
            var textcolors= Array(temp2.length).fill('black');

            for(const x of filteredIndices)
            {
                textcolors.splice(x.index, x.id.length,...Array(x.id.length).fill(colormap.get(x.id)));
            }

            colorstore.push(textcolors)
        }
            setcolors(colorstore)
    },[prediction]);
    
    const colorText = () =>{
        let colorstore=[]
        const nonAlphaNumeric = /\W/;
        for(const ele of temp)
        {
            const xIndices = nodes.flatMap(x => {
            let indices = [];
            let index = ele.toLowerCase().indexOf(x.id.toLowerCase());
            while (index !== -1) {
                let id = x.id.toLowerCase()
                indices.push({ id, index });
                index = ele.toLowerCase().indexOf(x.id.toLowerCase(), index + 1);
            }
            return indices;
        });

            const filteredIndices = xIndices.filter(index1 => {
                for (const index2 of xIndices) {
                    if (index1.index == index2.index && index1.id !== index2.id && index2.id.toLowerCase().includes(index1.id.toLowerCase()))
                    {
                        return false;
                    }
                }
                
            
                  const startIndex = index1.index;
                  const endIndex = startIndex + index1.id.length;
                  const beforePhrase = ele[startIndex - 1];
                  const afterPhrase = ele[endIndex];
                  return (nonAlphaNumeric.test(beforePhrase) || startIndex == 0) && (nonAlphaNumeric.test(afterPhrase)  || endIndex == ele.length);
            });

            var temp2 = (ele).toLowerCase();
            var textcolors= Array(temp2.length).fill('black');

            for(const x of filteredIndices)
            {
                textcolors.splice(x.index, x.id.length,...Array(x.id.length).fill(colormap.get(x.id)));
            }

            colorstore.push(textcolors)
        }
            setcolors(colorstore)
    }
    
    const modelSelect = e => {
        e.preventDefault();
        setModel([].slice.call(e.target.selectedOptions).map(item => item.value))
    }
    const getPred = async e => {
        e.preventDefault()
        console.log(modelFile)
        model.push(modelFile.name)
        setCurrent(fileindex)
        setCurrModel(model)
        console.log(model)
        axios.post("/predict",
        {
            data:JSON.stringify(files[fileindex]),
            model: model,
            userModel: modelFile
        })
        .then(function (response) {
            temp=response['data']
            setPrediction(temp);
            colorText()
          })
    }
    const handleChange = (e, index) => {
        const value = e.target.value;
        setPrediction((state) => [
            ...state.slice(0, index),
            value,
            ...state.slice(index + 1)
          ]);
      }
      const updateFile = (e) =>{
        e.preventDefault()        
        let newFile=files
        let store=prediction[e.target.value].split("")
        var entity=0
        var index=0
        var newText=""
        let tempcolors=colors2[e.target.value]
        const myMap = new Map()
        const mySet= new Set()
        let ref_dict={}
        while(index<tempcolors.length)
        {
            if(tempcolors[index]==='black')
            {
                
                newText+=store[index]
                ++index
            }
            else
            {
                const color = tempcolors[index]
                if(cm.get(color).indexOf('') >= 0)
                {
                    while(tempcolors[index]===color)
                    {
                        ++index
                    }
                }
                else
                {
                    ++index
                }
                if(myMap.has(color)&&store[0]!=='')
                {
                    newText+=myMap.get(color)
                }
                else
                {
                myMap.set(color,"<entity_"+entity.toString()+">")
                mySet.add(cm.get(color))
                ref_dict["<entity_"+entity.toString()+">"]= cm.get(color)
                newText+="<entity_"+entity.toString()+">"
                ++entity
                }
            }
        }
        let old_ref_dict=newFile[current].entity_ref_dict
        for(var key in old_ref_dict)
        {
            if(!mySet.has(old_ref_dict[key]))
                {
                    ref_dict["<entity_"+entity.toString()+">"]= old_ref_dict[key]
                    ++entity
                }
        }
        newFile[current].entity_ref_dict=ref_dict
        newFile[current].narration=newText
        setFiles(newFile)
        setfilename("data"+model[e.target.value]+".json")
       };
    const saveFile = (e) =>{
        e.preventDefault()
        let filestring=JSON.stringify(files)
        download(filestring,filename,"text/plain");
    }
    return(
        <div className='app' style={{marginBottom:"15px", marginTop:"20px", paddingLeft: '50px', paddingRight: '50px'}}>
            <div align='center'>
                <h1>Generate Text from Knowledge Graphs</h1>
                <p>Upload data and see what each model outputs</p> 
            </div>
            <div>
               <Form>
                    <Form.Group controlId="formFile" className="mb-3" onChange={fileRead}>
                    <Form.Label style={{paddingLeft: '10px'}}>Input a data file</Form.Label>
                    <Form.Control type="file" />
                    </Form.Group>
                </Form>
                {files&&<TOC elements = {nodes} files={files} setFiles={setFiles} fileindex={fileindex} setfileindex={setfileindex} cm={cm} setcm ={setcm} edges={edges} title={files[fileindex].Graph_Name} sentence={files[fileindex].narration}
                                colors={colors2}/>}
            <Form.Group as={Col} controlId="my_multiselect_field">
                <Form.Label style={{paddingLeft: '10px'}}>Select which models you want to use. Use <i>Ctrl (or CMD)+Click</i> to select multiple models.</Form.Label>
                <Form.Control as="select" multiple value={model} onChange={e => setModel([].slice.call(e.target.selectedOptions).map(item => item.value))}>
                    {models.map(model => (
                      <option key={model.value} value={model.value}>
                        {model.display}
                      </option>
                    ))}
            </Form.Control>
            </Form.Group>
            <Form>
                <Form.Group controlId="uploadFile" className="mb-3" onChange={fileRead}>
                <Form.Label style={{paddingLeft: '10px'}}>Upload a model file</Form.Label>
                <Form.Control type="file" />
                </Form.Group>
            </Form>
                <Form style={{padding: '5px'}}>
                    <Row>
                        <Col>
                        <Button variant="primary" type="submit" onClick={getPred}>
                        Predict
                        </Button>
                        </Col>
                        <Col xs={2}>
                        <Button variant="primary" type="submit" onClick={saveFile}>
                        Save
                        </Button>
                        </Col>
                        
                    </Row>
                </Form>
                <Container>
                    <Row style={{height:600}}>
                    <Col style={{border: '2px solid rgba(0, 0, 0, 0.05)'}}>
                    <ReactFlow
                        edgeTypes={edgeTypes}
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        fitView
                        >
                    <Controls />
                    </ReactFlow>
                    </Col>
                    {/*prediction&&<Col style={{border: '2px solid rgba(0, 0, 0, 0.05)', 
                                overflowY: 'auto',
                                maxHeight:600
                                }}>
                                    <ColorPara colors={colors2}>{prediction}</ColorPara>
                            </Col>*/}
                    {prediction&&<Col style={{border: '2px solid rgba(0, 0, 0, 0.05)', 
                                }} >
            
                    {prediction.map((ele, index) => {
        return (
            <div>
            <h4>
                <b>
                {currModel[index]}
            
                </b>
            </h4>
          <Result
            preds={ele}
            index={index}
            counts={Object.keys(model).length}
            colors={colors2[index]}
            onChange={e => handleChange(e, index)}
            updateFile={updateFile}
            setPreds={setPrediction}
          />
                
            </div>

        );
      })}
                    </Col>}
                    </Row>
                </Container>
            </div>
        </div>
    );
}
export default Model;
