import React, { useState } from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
const getColor = (colors, index) => {
    return colors[index];
  }
const ColorPara = (props, colors) => {
    var i=0;
    return (
      <div style={{overflowY: 'auto',
      maxHeight:150, width: 300}}>
        {props.children.split(' ').map(text => {
          return (
            <div style={{ color: getColor(props.colors, i++), display: 'inline'}}>
              {text} &nbsp;
            </div>
          )
        })}
      </div>
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
          onKeyDown={handleKeyPress}
          type="text"
        />
      ) : (
        <Row xs={1} md={2}>
          <Col>
          <ColorPara colors={colors}>{chore}</ColorPara>
          </Col>
          <Col>
          <button onClick={handleClick}>Edit</button>
          </Col>
          
        </Row>
      )}
    </>
  );
}
