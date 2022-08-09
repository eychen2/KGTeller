import React, {useState} from 'react';
const Form = ({elements,setElements,edges, setEdges, setsentence, setcolors}) =>{
    const [node, setnode] = useState('');
    const [source, setsource] = useState('');
    const [target, settarget] = useState('');
    const [label, setlabel] = useState('');
    const [temp, settemp] = useState('');
    const [colormap, setcolormap] = useState(new Map())
    const colors = ['limegreen','antiquewhite','indianred','darksalmon','red','darkred','pink','hotpink','deeppink','mediumvioletred','tomato','orangered','darkorange','orange','aqua','aquamarine','blue','chocolate','blueviolet','cadetblue','burlywood','chartreuse','cyan','darkcyan','darkblue','darkgoldenrod','darkgrey','darkkhaki','darkslategrey','forestgreen','ivory','lemonchiffon','lime','mediumslateblue','mistyrose','peru','rebeccapurple','rosybrown','seashell','steelblue','tan','teal','thistle','wheat','yellow','silver','blanchedalmond','cornsilk','grey','indigo'];
    const addNode = (e) => {
        e.preventDefault();
        var index = elements.findIndex(x=>x.id===node)
        if(index===-1&&node!=='')
        {
            setElements([...elements, {id: node, data: {label: node},position:{x:1250,y:200}, style:{color: colors[elements.length]}}]);
            setcolormap(colormap.set(node,colors[elements.length]))
        }
        setnode("");
    };
    const addEdge = (e) =>{
        e.preventDefault();
        var index = elements.findIndex(x=>(x.source===source && x.target===target))
        console.log(target)
        if(index===-1&&target!==''&&source!==''&&label!=='')
        {
            setEdges([...edges,{id:(edges.length+1).toString(), type: 'smart', source:source, target:target, label:label, markerEnd: {
                type: "arrowclosed", color: 'black'
              },style: { stroke: 'black' }}])//style:{stroke: colors[elements.length]}}])
        }
        setsource('');
        settarget('');
        setlabel('');
    };
    const addSentence = (e) =>{
        e.preventDefault();
        var temp2 = (" "+temp+" ").toLowerCase();
        var textcolors= Array(temp2.length).fill('black');
        setElements(elements.sort((a, b) => {
            return a.id.length - b.id.length;
        }));
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
        setsentence(temp);
        settemp('');
        setcolors(realcolors);
    };
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
                <input type="text" value={temp} placeholder="Sentence" onChange={(e)=> settemp(e.target.value)}></input>
            <button onClick={addSentence} className="submitButton" type="submit" > Add Sentence</button>
            </div>
        </form>
    )
}
export default Form;