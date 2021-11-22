# Button State UI Widget for the NodeRed Dashboard
This is a simple widget for the NodeRed dashboard that displays many buttons that can be clicked to set a value, this value is then shown on the button's background color.

## Example interface
![Example](./img/example.png)

# Sending to input
Below is an example for setting the state on the widget
```
{
    "payload": "value"
}
```

# Output from the node
Below is an example of what will be output by the node (on the top output) when a button is clicked
```
{
    "payload": "value"
}
```

The node will also "request" an update on the bottom output with the following
```
{
    "payload": "current known value" //This will be "" when first deployed
}
```
It is expected that the node will be told it's value on the input when it requests this


# Example (Using colors) 
![Example](./img/example1.png)
```
[{"id":"748117d.6a8a4e8","type":"ui_button_state","z":"1c5d828.a47687e","group":"fb4ca7c3.864058","name":"Example","order":0,"onColor":"","offColor":"","width":"6","height":"2","options":[{"label":"Option 0","value":"option_0","onColor":"#99ff99","offColor":"#ff3333"},{"label":"Option 1","value":"option_1","onColor":"#99ff99","offColor":"#ff3333"},{"label":"Option 2","value":"option_2","onColor":"#99ff99","offColor":"#ff3333"},{"label":"Option 3","value":"option_3","onColor":"#99ff99","offColor":"#ff3333"}],"x":540,"y":260,"wires":[["5474af6.bc2735","dbaff572.416f78"],["478f72be.78290c"]]},{"id":"5474af6.bc2735","type":"function","z":"1c5d828.a47687e","name":"Pass","func":"return msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","x":550,"y":180,"wires":[["748117d.6a8a4e8"]]},{"id":"dbaff572.416f78","type":"debug","z":"1c5d828.a47687e","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","statusVal":"","statusType":"auto","x":730,"y":260,"wires":[]},{"id":"478f72be.78290c","type":"function","z":"1c5d828.a47687e","name":"Default","func":"return {\n    \"payload\": \"option_3\"\n}","outputs":1,"noerr":0,"initialize":"","finalize":"","x":540,"y":340,"wires":[["748117d.6a8a4e8"]]},{"id":"fb4ca7c3.864058","type":"ui_group","name":"Default","tab":"64be35cd.7831bc","order":1,"disp":true,"width":"6","collapse":false,"className":""},{"id":"64be35cd.7831bc","type":"ui_tab","name":"Home","icon":"dashboard","disabled":false,"hidden":false}]
```