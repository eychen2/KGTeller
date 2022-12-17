import React, { useState } from "react";
import Changefileindex from "./Changefileindex";
const getColor = (colors, index) => {
    return colors[index];
  }
const ColorPara = (props, colors) => {
    var i=0;
    return (
      <p>
        {props.children.split(' ').map(text => {
          return (
            <div style={{ color: getColor(props.colors, i++), display: 'inline', }}>
              {text} &nbsp;
            </div>
          )
        })}
      </p>
    )
  }
export default function Task({ chore, onChange, colors}) {
  const [isEditing, setIsEditing] = useState(false);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleKeyPress = e => {
    if (e.key === "Enter"&&chore.length>0) {
      setIsEditing(false);
    }
  };

  return (
    <>
      {isEditing ? (
        <input
          autoFocus
          value={chore}
          onChange={onChange}
          onKeyPress={handleKeyPress}
          type="text"
        />
      ) : (
        <div onClick={handleClick} style={{ overflowY: 'auto',
        maxHeight:150}}>{chore}</div>
      )}
    </>
  );
}
