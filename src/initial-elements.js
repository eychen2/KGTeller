export const M1elements =[
  {id: '0',data:{label:'Brunei at the 2013 World Aquatics Championships'}, style: {color: "Black"}, position: { x: 0, y: 0 }},
  {id: '1', data: {label: "2013"}, style: {color: "White"},position: { x: 200, y: 200 }},
  {id: '2', data: {label:'2013 World Aquatics Championships'}, style: {color: "DarkBlue"},position: { x: 200, y: -200 }},
  {id: '3', data: {label:'Spain'},  style: {color: "DarkGreen,"},position: { x: -200, y: 200 }},
  {id: '4', data: {label:'Barcelona'}, style: {color: "DarkGrey"}, position: { x: -200, y: -200 }},
];

export const M1edges= [
{id: 'e0-1', source:'0', target: '1', label: 'point in time', animated: true, style: {stroke: 'Black'}},
{id: 'e0-2', source:'0', target: '2', label: 'partcipated in', style: {stroke: 'DarkBlue'}},
{id: 'e0-3', source:'0', target: '3', label: 'location', style: {stroke: 'DarkGreen'}},
{id: 'e0-4', source:'0', target: '4', label: 'location',style: {stroke: 'DarkGrey'}},
{id: 'e0-2-2', source:'0', target: '5', label: 'participant of',  style: {stroke: 'DarkBlue'}}
];