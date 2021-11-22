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