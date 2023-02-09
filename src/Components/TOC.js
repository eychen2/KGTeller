import React, {useEffect, useState} from 'react';
import Form from 'react-bootstrap/Form';

const TOC = ({files, setFiles, fileindex, setfileindex, cm, setcm, edges, sentence,title, colors,cmall, setcmall})=>{
    const [used,setUsed]=useState(false);
    const handleChange= (e) =>{
        e.preventDefault()
        if(e.target.value!==-1)
        {
            //saveCurrent()
            //setFiles(files)
            setfileindex(e.target.value)
        }
        setUsed(true);
    };
    /*const saveCurrent = () =>{
        var temp=files[fileindex]
        temp.Graph_Name=title
        var tempedges=[]
        for (const x in edges)
        {
            const labels =edges[x].label.split(", ")
            for(var i =0; i<labels.length;++i)
            {
                tempedges.push([edges[x].source,labels[i],edges[x].target])
            }

        }
        temp.keep_triples=tempedges
        const store = sentence.split(" ")
        var entity=0
        var index=0
        var filestring=""
        while(index<colors.length)
        {
            if(colors[index]==='black')
            {
                
                filestring+=store[index]+" "
                ++index
            }
            else
            {
                const color = colors[index]
                while(colors[index]===color)
                {
                    ++index
                }
                temp.entity_ref_dict["<entity_"+entity.toString()+">"]= cm.get(color)
                filestring+="<entity_"+entity.toString()+"> "
                ++entity
            }
        }
        setcmall(cmall.set(title,cm))
        filestring=filestring.slice(0,-1)
        temp.narration=filestring
        files[fileindex]=temp
    }*/
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