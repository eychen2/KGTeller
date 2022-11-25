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
import 'bootstrap/dist/css/bootstrap.min.css'
const Model = () =>{
    const [files, setFiles] = useState("");
    const [prediction, setPrediction] = useState(null);
    const [model, setModel] = useState(null);
    const [fileindex,setfileindex]= useState(0);
    const [used,setUsed]= useState(false);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
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
        setUsed(false)
    }
    useEffect(()=> {
        const current = files[fileindex]
        if(current)
        {
            let map1 = new Map()
            const tempnodes=[];
            let tempcolor= new Map()
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
                tempcolor.set(value,colors[tempnodes.length-1])
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
        }
    },[files,fileindex]);
    const modelSelect = e => {
        e.preventDefault();
        console.log(e.target.value)
        setModel(e.target.value)
        setUsed(true)
    }
    const getPred = async e => {
        e.preventDefault()
        console.log("Reached")
        axios.post("/predict",
        {
            data:JSON.stringify(files[fileindex]),
            model: model
        })
        .then(function (response) {
            setPrediction(response['data']['data']);
          })
    }
    return(
        <div className='app'>
            <div>
                <h1>Model</h1>
                <p>You can use this page to upload data and see what the model outputs</p> 
            </div>
            <div>
                <Form.Select aria-label="Model chooser" onChange={modelSelect}>
                    {!used&&<option value="-1">Select Model</option>}
                    {models.map(model => (
                      <option key={model.value} value={model.value}>
                        {model.display}
                      </option>
                    ))}
                </Form.Select>
                <Form>
                    <Form.Group controlId="formFile" className="mb-3" onChange={fileRead}>
                    <Form.Label>Default file input example</Form.Label>
                    <Form.Control type="file" />
                    </Form.Group>
                </Form>
                {files&&<TOC files={files} fileindex={fileindex} setfileindex={setfileindex}></TOC>}
                <Form>
                    <Button variant="primary" type="submit" onClick={getPred}>
                     Predict
                    </Button>
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
                    {prediction&&<Col style={{border: '2px solid rgba(0, 0, 0, 0.05)', 
                                overflowY: 'auto',
                                maxHeight:600
                                }}>
                                    <h2> The prediction is: {prediction}</h2>
                    </Col>}
                    </Row>
                </Container>
            </div>
        </div>
    );
}
export default Model;