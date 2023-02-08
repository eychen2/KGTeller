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
        files.push({Event_Name:"", keep_triples:[], narration:"",entity_ref_dict:{}})
        setFiles(files)
        setfileindex(fileindex+1)
        cm.clear()
        setcm(cm)
    };
    /*useEffect(()=> {
        var temp=files[fileindex]
        console.log(temp)
        temp.Event_Name=title
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
        console.log(temp)
        temp[fileindex].Event_Name=title
        var tempedges=[]
        //console.log(fileindex)
        for (const x in edges)
        {
            const labels =edges[x].label.split(", ")
            for(var i =0; i<labels.length;++i)
            {
                tempedges.push([edges[x].source,labels[i],edges[x].target])
            }

        }
        temp[fileindex].keep_triples=tempedges
        const store = sentence.split(" ")
        //console.log(store)
        var entity=0
        var index=0
        var newText=""
        let ref_dict={}
        const myMap = new Map()
        const mySet= new Set()
        while(index<colors.length)
        {
            if(colors[index]==='black')
            {
                
                newText+=store[index]+" "
                ++index
            }   
            else
            {
                const color = colors[index]
                if(cm.get(color).indexOf(' ') >= 0)
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
                    if('.!?,\"'.indexOf(store[index-1].slice(-1)) >= 0)
                        newText+=store[index-1].slice(-1)
                    newText+=" "
                }
                else
                {
                myMap.set(color,"<entity_"+entity.toString()+">")
                mySet.add(cm.get(color))
                ref_dict["<entity_"+entity.toString()+">"]= cm.get(color)
                newText+="<entity_"+entity.toString()+">"
                if(store[0]!==''&&'.!?,\"'.indexOf(store[index-1].slice(-1)) >= 0)
                    newText+=store[index-1].slice(-1)
                newText+=" "
                ++entity
                }
            }
        }
        for(const x of elements)
        {
            if(!mySet.has(x.id))
                {
                    ref_dict["<entity_"+entity.toString()+">"]= x.id
                    ++entity
                }
        }
        newText=newText.slice(0,-1)
        temp[fileindex].entity_ref_dict=ref_dict
        temp[fileindex].narration=newText
        setFiles(temp)
        //console.log(temp)
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