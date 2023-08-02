import {Button} from 'react-bootstrap'
import React, {useEffect, useState} from 'react';
const Changefileindex = ({files, setFiles, fileindex, setfileindex, cm, setcm, edges, sentence,title, colors, elements})=>{
    const goPrevious= (e) =>{
        e.preventDefault()
        if(fileindex>0)
        {
            saveCurrent()
            setfileindex(fileindex-1);
        }
    };
    const goNext= (e) =>{
        e.preventDefault()
        if(fileindex<files.length-1)
        {
            saveCurrent()
            setfileindex(fileindex+1);
        }

    };
    const addNew= (e) =>{
        e.preventDefault()
        saveCurrent()
        files.push({Graph_Name:"", keep_triples:[], narration:"",entity_ref_dict:{}})
        setFiles(files)
        setfileindex(fileindex+1)
        cm.clear()
        setcm(cm)
    };
    /*useEffect(()=> {
        var temp=files[fileindex]
        console.log(temp)
        temp.Graph_Name=title
        console.log(title)
        var tempedges=[]
        for (const x in edges)
        {
            const labels =edges[x].label.split(", ")
            for(var i =0; i<labels.length;++i)
            {
                tempedges.push([edges[x].source,labels[i],edges[x].target])
            }

        }
        console.log(tempedges)
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
                console.log(color)
                temp.entity_ref_dict["\"<entity_"+entity.toString()+">\""]= cm.get(color)
                filestring+="<entity_"+entity.toString()+"> "
                ++entity
            }
        }
        filestring=filestring.slice(0,-1)
        temp.narration=filestring
        console.log(fileindex)
        console.log(files.length)
        console.log(temp)
    },[clicked])*/
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
        <form>
            <div>
                {fileindex>0&&cm.size!=0&&<Button onClick={goPrevious} className="submitButton" type="submit">Previous</Button>}
                {fileindex<files.length-1&&cm.size!=0&&<Button onClick={goNext} className="submitButton" type="submit">Next</Button>}
                {fileindex>=files.length-1&&cm.size!=0&&<Button onClick={addNew} className="submitButton" type="submit">Add New Graph</Button>}
            </div>
                
        </form>
    )
}
export default Changefileindex;