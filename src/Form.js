import React, {useEffect, useState} from 'react';
import download from 'downloadjs';
const Form = ({elements,setElements,edges, setEdges, setsentence, setcolors, setjson, fileindex, setfileindex, files, setFiles}) =>{
    const [node, setnode] = useState('');
    const [source, setsource] = useState('');
    const [target, settarget] = useState('');
    const [label, setlabel] = useState('');
    const [sentence_holder, setsentence_holder] = useState('');
    const [temp, settemp]= useState('');
    const [colormap, setcolormap] = useState(new Map())
    const [edge,setEdge] = useState({source:'', target:'', label:''})
    const [filereader, setfilereader] = useState(new FileReader());
    const colors = ['limegreen','antiquewhite','indianred','darksalmon','red','darkred','pink','hotpink','deeppink','mediumvioletred','tomato','orangered','darkorange','orange','aqua','aquamarine','blue','chocolate','blueviolet','cadetblue','burlywood','chartreuse','cyan','darkcyan','darkblue','darkgoldenrod','darkgrey','darkkhaki','darkslategrey','forestgreen','ivory','lemonchiffon','lime','mediumslateblue','mistyrose','peru','rebeccapurple','rosybrown','seashell','steelblue','tan','teal','thistle','wheat','yellow','silver','blanchedalmond','cornsilk','grey','indigo'];
    const Reset = () => {
        setElements([]);
        setEdges([]);
        settemp("");
        setsentence_holder("");
        setcolormap(colormap.clear());
        setcolors([]);
        setFiles("");
        setfileindex(0);
      }
    const addNode = (e) => {
        e.preventDefault();
        var index = elements.findIndex(x=>x.id===node)
        if(index===-1&&node!=='')
        {
            setElements([...elements, {id: node.toLowerCase(), data: {label: node},position:{x:0,y:700}, style:{color: colors[elements.length]}}].sort((a, b) => {
                return a.id.length - b.id.length;
            }));
            setcolormap(colormap.set(node.toLowerCase(),colors[elements.length]))
        }
        setnode("");
    };
    const addEdge = (e) =>{
        e.preventDefault();
        setEdge({source: {source}, target: {target},label:{label} })
    };
    useEffect(()=> {
        var index = edges.findIndex(x=>(x.source.toLowerCase()===source.toLowerCase() && x.target.toLowerCase()===target.toLowerCase()))
        console.log(index)
        if(index===-1&&target!==''&&source!==''&&label!=='')
        {
            setEdges([...edges,{id:(edges.length+1).toString(), type: 'smart', source:source, target:target, label:label, markerEnd: {
                type: "arrowclosed", color: 'black'
              },style: { stroke: 'black' }}])//style:{stroke: colors[elements.length]}}])
        }
        if(index!==-1&&label!=='')
        {
            console.log('reached')
            const updateedge=edges
            updateedge[index].label=updateedge[index].label+", "+label
            setEdges(updateedge)
            console.log(edges)
        }
        setsource('');
        settarget('');
        setlabel('');
        },[edge])
    const addText = (e) =>{
        e.preventDefault();
        var temp2 = (" "+temp+" ").toLowerCase();
        var textcolors= Array(temp2.length).fill('black');
        setElements(elements.sort((a, b) => {
            return a.id.length - b.id.length;
        }));
        setsentence(sentence_holder);
        settemp(sentence_holder)
        
    };
    useEffect(()=> {
        var temp2 = (" "+temp+" ").toLowerCase();
        var textcolors= Array(temp2.length).fill('black');
        for(const x of elements)
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
        setcolors(realcolors);
        setsentence_holder('');
        
        },[elements,temp]);
    const handleFile = e => {
        filereader.readAsText(e.target.files[0], "UTF-8");
    }
    useEffect(()=> {
        filereader.onload = e => {
            Reset();
            setFiles(JSON.parse(e.target.result));
        }; 
    },[filereader]);
    useEffect(()=> { 
        console.log(fileindex)
        const current = files[fileindex]
        console.log(current)
        if(current)
        {
            var tempnodes=[];
            const length = current.nodes.length
            let tempcolor= new Map()
            let y=4;
            for(var i=0; i<length;++i)
            {
                tempnodes.push({id: current.nodes[i].toLowerCase(), data: {label: current.nodes[i]},position:{x:(-400+200*(i%4)),y:200*y}, style:{color: colors[tempnodes.length]}})
                if(i%4===3)
                    y-=1;
                tempcolor.set(current.nodes[i].toLowerCase(),colors[tempnodes.length-1])
            }
            var tempedges=[];
            const elength = current.edges.length;
            for(var i=0; i<elength;++i)
            {
                tempedges.push({id: (i).toString(), type: 'smart', source:current.edges[i].source.toLowerCase(), 
                target:current.edges[i].target.toLowerCase(), label:current.edges[i].label, markerEnd: {
                    type: "arrowclosed", color: 'black'
                  },style: { stroke: 'black' }})
            }
            console.log(current.text)
            settemp(current.text)
            setElements(tempnodes.sort((a, b) => {
                return a.id.length - b.id.length;
            }))
            setEdges(tempedges)
            setcolormap(tempcolor)
            setsentence(current.text)
            setjson({nodes:JSON.stringify({nodes:current.nodes}),edges:JSON.stringify({edges:current.edges}),text:JSON.stringify({text:current.text})})
        }
    },[files,fileindex]);
    const saveFile = (e) =>{
        e.preventDefault();
        var tempnodes=[];
        var tempedges=[];
        for(var i=0; i<elements.length;++i)
            tempnodes.push(elements[i].id);
        for(var i=0; i<edges.length;++i)
            tempedges.push({source: edges[i].source, target: edges[i].target, label: edges[i].label})
        var tempjson = {nodes: tempnodes, edges: tempedges, text: temp}
        var filestring= JSON.stringify(tempjson)
        download('['+filestring+']',"data.json","text/plain");
    }
    return(
        <form>
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
                <input type="text" value={sentence_holder} placeholder="Text" onChange={(e)=> setsentence_holder(e.target.value)} style={{width:800}}></input>
            <button onClick={addText} className="submitButton" type="submit"> Add Text</button>
            </div>
            <div>
            <input type="file" onChange={handleFile} />
            </div>
            <div>
            <button onClick={saveFile} className="submitButton" type="submit" >Save File</button>

            </div>
            <div>
            <button onClick={Reset} className="submitButton" type="submit" >Clear all</button>
            </div>
        </form>
    )
}
export default Form;