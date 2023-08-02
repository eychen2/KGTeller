import React, {useEffect, useState} from 'react';
import Form from 'react-bootstrap/Form';

const TOC = ({elements,files, setFiles, fileindex, setfileindex, cm, setcm, edges, sentence,title, colors,cmall, setcmall})=>{
    const [used,setUsed]=useState(false);
    const handleChange= (e) =>{
        e.preventDefault()
        if(e.target.value!==-1)
        {
            saveCurrent()
            //setFiles(files)
            setfileindex(Number(e.target.value))
        }
        setUsed(true);
    };
    const saveCurrent = () =>{
        let temp = files
        temp[fileindex].Graph_Name=title
const lowerupper= new Map()
         for(const [key,value] of cm.entries())
            {
                lowerupper.set(value.toLowerCase(),value)
            }
        var tempedges=[]
        for (const x in edges)
        {
            const labels =edges[x].label.split(", ")
            for(var i =0; i<labels.length;++i)
            {
                tempedges.push([lowerupper.get(edges[x].source),labels[i],lowerupper.get(edges[x].target)])
            }

        }
        temp[fileindex].keep_triples=tempedges
        const store = sentence
        var entity=0
        var index=0
        var newText=""
        let ref_dict={}
        const myMap = new Map()
        const mySet= new Set()
        console.log(colors)
        while(index<colors.length)
        {
            if(colors[index]==='black')
            {
                
                newText+=store[index]
                ++index
            }   
            else
            {
                const color = colors[index]
                if(cm.get(color).indexOf('') >= 0)
                {
                    while(colors[index]===color)
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
                mySet.add(cm.get(color).toLowerCase())
                ref_dict["<entity_"+entity.toString()+">"]= cm.get(color)
                newText+="<entity_"+entity.toString()+">"
                ++entity
                }
            }
        }
        for(const x of elements)
        {
            if(!mySet.has(x.id))
                {
                    ref_dict["<entity_"+entity.toString()+">"]= lowerupper.get(x.id)
                    ++entity
                }
        }
        temp[fileindex].entity_ref_dict=ref_dict
        temp[fileindex].narration=newText
        setFiles(temp)
    }
    return(
        <Form.Select onChange={handleChange}>

                    {!used&&<option value={-1}>
                        Select which graph you want to render from the file
                    </option>}
                    {Object.entries(files).map((key, value) => {
                        return <option value={value}>{key[1].Graph_Name}</option>;
                        })}
        </Form.Select>
    )
}
export default TOC;