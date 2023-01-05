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

const Model = () =>{
    const [files, setFiles] = useState("");
    const [prediction, setPrediction] = useState(["test1","test2","test3"]); 
    const [model, setModel] = useState(["BART", "JointGT", "GAP"]);
    const [fileindex,setfileindex]= useState(0);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [colormap, setcolormap] = useState(new Map())
    const [colors2, setcolors] = useState([])
    let colorstemp=["blue","green","red","orange"]
    let temp=""
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
            setcolormap(tempcolor)
            console.log(tempcolor)
        }
    },[files,fileindex]);
    const colorText = () =>{
    var temp2 = (" "+temp+" ").toLowerCase();
    var textcolors= Array(temp2.length).fill('black');
        for(const x of nodes)
        {
            var indexOccurence = temp2.indexOf(" "+x.id.toLowerCase()+" ",0);
            while(indexOccurence >= 0) 
            {
                textcolors.splice(indexOccurence, x.id.length,...Array(x.id.length).fill(colormap.get(x.id)));
                indexOccurence=temp2.indexOf(" "+x.id.toLowerCase()+" ",indexOccurence+x.id.length);
            }
            indexOccurence = temp2.indexOf(" "+x.id.toLowerCase()+",",0);
            while(indexOccurence >= 0) 
            {
                textcolors.splice(indexOccurence, x.id.length,...Array(x.id.length).fill(colormap.get(x.id)));
                indexOccurence=temp2.indexOf(" "+x.id.toLowerCase()+" ",indexOccurence+x.id.length);
            }
            indexOccurence = temp2.indexOf(" "+x.id.toLowerCase()+".",0);
            while(indexOccurence >= 0) 
            {
                textcolors.splice(indexOccurence, x.id.length,...Array(x.id.length).fill(colormap.get(x.id)));
                indexOccurence=temp2.indexOf(" "+x.id.toLowerCase()+" ",indexOccurence+x.id.length);
            }
            indexOccurence = temp2.indexOf(" "+x.id.toLowerCase()+";",0);
            while(indexOccurence >= 0) 
            {
                textcolors.splice(indexOccurence, x.id.length,...Array(x.id.length).fill(colormap.get(x.id)));
                indexOccurence=temp2.indexOf(" "+x.id.toLowerCase()+" ",indexOccurence+x.id.length);
            }
        }
        var realcolors = Array(temp.split(" ").length).fill('black');
        var index=0;
        var space=temp2.indexOf(" ",0);
        while(space>=0)
        {
            realcolors[index]=textcolors[space];
            space=temp2.indexOf(" ",space+1);
            index++;
        }
        realcolors.pop();
        setcolors(realcolors)
    }
    const modelSelect = e => {
        e.preventDefault();
        console.log(e.target.value)
        setModel([].slice.call(e.target.selectedOptions).map(item => item.value))
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
            console.log(response)
            temp=response['data']
            setPrediction(response['data']);
            colorText()
          })
    }
    const handleChange = (e, index) => {
        const value = e.target.value;
        console.log(value)
        console.log(index)
        setPrediction((state) => [
            ...state.slice(0, index),
            value,
            ...state.slice(index + 1)
          ]);
      }
      const updateFile = (e) =>{
        
       };
    return(
        <div className='app'>
            <div>
                <h1>Model</h1>
                <p>You can use this page to upload data and see what the model outputs</p> 
            </div>
            <div>
            <Form.Group as={Col} controlId="my_multiselect_field">
                <Form.Label>Select which models you want to use. Use Ctrl and Click to select multiple</Form.Label>
                <Form.Control as="select" multiple value={model} onChange={e => setModel([].slice.call(e.target.selectedOptions).map(item => item.value))}>
                    {models.map(model => (
                      <option key={model.value} value={model.value}>
                        {model.display}
                      </option>
                    ))}
            </Form.Control>
            </Form.Group>
                <Form>
                    <Form.Group controlId="formFile" className="mb-3" onChange={fileRead}>
                    <Form.Label>Input a data file</Form.Label>
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
                    {/*prediction&&<Col style={{border: '2px solid rgba(0, 0, 0, 0.05)', 
                                overflowY: 'auto',
                                maxHeight:600
                                }}>
                                    <ColorPara colors={colors2}>{prediction}</ColorPara>
                            </Col>*/}
                    {prediction&&<Col style={{border: '2px solid rgba(0, 0, 0, 0.05)', 
                                maxHeight:600
                                }}>
                    {prediction.map((ele, index) => {
        return (
            <div>
            <h4>
                {model[index]}
            </h4>
          <Result
            preds={ele}
            index={index}
            colors={colors2}
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