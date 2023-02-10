import React, {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
const Form = ({elements,setElements,edges, setEdges, sentence, setsentence, setcolors, setjson, fileindex, setfileindex, files, setFiles,setTitle, cm, setcm}) =>{
    const [name, setname] = useState('');
    const [node, setnode] = useState('');
    const [source, setsource] = useState('');
    const [target, settarget] = useState('');
    const [label, setlabel] = useState('');
    const [sentence_holder, setsentence_holder] = useState('');
    const [temp, settemp]= useState('');
    const [colormap, setcolormap] = useState(new Map())
    const [edge,setEdge] = useState({source:'', target:'', label:''})
    const colors = ['limegreen','purple','indianred','darksalmon','red','darkred','pink','hotpink','deeppink','mediumvioletred','tomato','orangered','darkorange','orange','aqua','aquamarine','blue','chocolate','blueviolet','cadetblue','burlywood','chartreuse','cyan','darkcyan','darkblue','darkgoldenrod','darkgrey','darkkhaki','darkslategrey','forestgreen','ivory','lemonchiffon','lime','mediumslateblue','mistyrose','peru','rebeccapurple','rosybrown','seashell','steelblue','tan','teal','thistle','wheat','yellow','silver','blanchedalmond','cornsilk','grey','indigo'];
    const Reset = (e) => {
        setElements([]);
        setEdges([]);
        settemp("");
        setsentence_holder("");
        colormap.clear()
        setcolormap(colormap);
        cm.clear()
        setcm(cm)
        setcolors([]);
        setFiles("");
        setfileindex(0);
      }
      const Reset2 = (e) => {
        setElements([]);
        setEdges([]);
        settemp("");
        setsentence_holder("");
        colormap.clear()
        setcolormap(colormap);
        cm.clear()
        setcm(cm)
        setcolors([]);
      }
    const addTitle = (e) =>{
        e.preventDefault()
        setTitle(name)
        setname("")
    }
    const addNode = (e) => {
        e.preventDefault();
        var index = elements.findIndex(x=>x.id===node)
        if(index===-1&&node!=='')
        {
            setElements([...elements, {id: node.toLowerCase(), data: {label: node},position:{x:-400,y:800}, style:{color: colors[elements.length]}}].sort((a, b) => {
                return a.id.length - b.id.length;
            }));
            setcolormap(colormap.set(node.toLowerCase(),colors[elements.length]))
            setcm(cm.set(colors[elements.length],node))
        }
        setnode("");
    };
    const addEdge = (e) =>{
        e.preventDefault()
        var index = edges.findIndex(x=>(x.source.toLowerCase()===source.toLowerCase() && x.target.toLowerCase()===target.toLowerCase()))
        if(index===-1&&target!==''&&source!==''&&label!=='')
        {
            setEdges([...edges,{id:(edges.length+1).toString(), type: 'smart', source:source.toLowerCase(), target:target.toLowerCase(), label:label, markerEnd: {
                type: "arrowclosed", color: 'black'
              },style: { stroke: 'black' }}])//style:{stroke: colors[elements.length]}}])
        }
        else if(label!=''){
            
            let update = [...edges]
            let test = update[index].label.split(/\s*,\s*/)
            let seen=false
            for(const i in test)
            {
                if(test[i]===label)
                {
                    seen=true
                    break;
                }
            }
            if(!seen)
            {
                update[index].label+=', '+label
                setEdges(update)
            }
        }      
        setsource("")
        settarget("")
        setlabel("")
    };
    useEffect(()=> {
        
        },[edge])
    const addText = (e) =>{
        e.preventDefault();
        setElements(elements.sort((a, b) => {
            return a.id.length - b.id.length;
        }));
        setsentence(sentence_holder);
        settemp(sentence_holder)
        
    };
    useEffect(()=> {
        
        const phraseIndices = elements.flatMap(phrase => {
        let indices = [];
        let index = sentence.toLowerCase().indexOf(phrase.id.toLowerCase());
        while (index !== -1) {
            let id = phrase.id.toLowerCase()
            indices.push({ id, index });
            index = sentence.toLowerCase().indexOf(phrase.id.toLowerCase(), index + 1);
        }
        return indices;
        });
        
        const filteredIndices = phraseIndices.filter(index1 => {
          for (const index2 of phraseIndices) {
            if (index1.index == index2.index && index1.id !== index2.id && index2.id.toLowerCase().includes(index1.id.toLowerCase()))
            {

              return false;
            }
          }
          return true;
        });

        var temp2 = (sentence).toLowerCase();
        var textcolors= Array(temp2.length).fill('black');
        
        for(const x of filteredIndices)
        {
            textcolors.splice(x.index, x.id.length,...Array(x.id.length).fill(colormap.get(x.id)));
        }        

        if(temp2.length>2)
        {
            setcolors(textcolors);
        }
        setsentence_holder('');
        },[elements,sentence]);
    useEffect(()=> {
        Reset2()
        const current = files[fileindex]
        if(current)
        {
            setTitle(current.Graph_Name)
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
                var node = [{id: value.toLowerCase(), data: {label: value},position:{x:(-400+200*(i%4)),y:200*y}, style:{color: colors[tempnodes.length]}}]
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
                    
                    tempedges.push({id: (access).toString(), type: 'smart', source:current.keep_triples[access][0].toLowerCase(), 
                    target:current.keep_triples[access][2].toLowerCase(), label:current.keep_triples[access][1], markerEnd: {
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
            setElements(tempnodes.sort((a, b) => {
                return a.id.length - b.id.length;
            }))
            setEdges(tempedges)
            let text = current.narration
            if(text.length>0&&map1.size>0)
            {
            var re = new RegExp(Object.keys(store).join("|"),"gi");
            text = text.replace(re, function(matched){
                return map1.get(matched.toLowerCase());
            });
            }
            settemp(text)
            setsentence(text)
            setcolormap(tempcolor)
            setjson(JSON.stringify(current))
        }
    },[files,fileindex]);
    return(
        <form>
            <Row>
            <Col xs={9}>
            <div>
            <input type="name" value={name} placeholder="Graph Name" onChange={(e)=> setname(e.target.value)} style={{width:300}}></input>
            <button onClick={addTitle} className="submitButton" type="submit" > Add Graph Name</button>
            </div>
            <div>
            <input type="text" value={node} placeholder="Node Name" onChange={(e)=> setnode(e.target.value)}></input>
            <button onClick={addNode} className="submitButton" type="submit" > Add Node</button>
            </div>
            <div>
                <input type="text" value={source} placeholder="Source Node Name" onChange={(e)=> setsource(e.target.value)}></input>
            <input type="text" value={target} placeholder="Target Node Name" onChange={(e)=> settarget(e.target.value)}></input>
            <input type="text" value={label} placeholder="Edge Name" onChange={(e)=> setlabel(e.target.value)}></input>
            <button onClick={addEdge} className="submitButton" type="submit" > Add Edge</button>
            </div>

            <div>
                <input type="text" value={sentence_holder} placeholder="Text" onChange={(e)=> setsentence_holder(e.target.value)} style={{width:500}}></input>
            <button onClick={addText} className="submitButton" type="submit">Add Text</button>
            </div>
            </Col>
            <Col xs={3}>
            <div>
            <Button variant="danger" onClick={Reset} className="submitButton" type="submit" >Clear all</Button>
            </div>
            </Col>
            </Row>
        </form>
        
    )
}
export default Form;