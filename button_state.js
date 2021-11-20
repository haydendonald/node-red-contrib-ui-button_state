/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
module.exports = function (RED) {
    //Generate the HTML
    var generateHTML = function (config, width, height) {
        var numButtonsY = parseInt(config.height != 0 ? config.height : 20);
        var buttonHeight = (height / numButtonsY) - 10;

        var HTML = "<div>";
        
        //Add the CSS
        var containerCSS = String.raw`
            padding: 0;
            margin: 0;
            margin-left: 2.5px;
            margin-right: 2.5px;
            float: left;
            display: inline-block;
            width: ${(width / Math.ceil(config.options.length / numButtonsY)) - 5}px;
            height: ${height - 5}px;
            background-color: green;
        `
        var optionButtonCSS = String.raw`
            width: 100%;
            min-height: ${buttonHeight}px;
            max-height: ${buttonHeight}px;
            padding: 0;
            margin: 0;
            margin-top: 2.5px;
            margin-bottom: 2.5px;
        `;

        //Add a button to the HTML
        var addButton = function (value) {
            HTML += String.raw`
                <md-button style="${optionButtonCSS} background-color: {{(value == '${value.value}') ? '${value.onColor}': '${value.offColor}'}} !important" ng-click="buttonClicked('${value.value}')">${value.label}</md-button>
            `;
        }

        HTML += String.raw`<div style="${containerCSS}">`;

        //Add the buttons for the values
        var j = 0;
        for (var i = 0; i < config.options.length; i++) {
            //If we go outside our height bounds move over to the next column
            if (j >= numButtonsY) {
                HTML += String.raw`</div><div style="${containerCSS}">`;
                j = 0;
            }
            addButton(config.options[i]);
            j++;
        }

        HTML += "</div></div>";
        return HTML;
    }

    var ui = undefined;
    function ButtonState(config) {
        try {
            var node = this;
            if (ui === undefined) {
                ui = RED.require("node-red-dashboard")(RED);
            }
            
            RED.nodes.createNode(this, config);
            var done = ui.addWidget({
                node: node,
                format: generateHTML(config, (ui.getSizes().sx * config.width) + 18, ui.getSizes().sy * config.height + 21.25), //The 18 and 21.25 values are the difference in the value and what is actually on the dashboard
                templateScope: "local",
                group: config.group,
                emitOnlyNewValues: false,
                forwardInputMessages: false,
                storeFrontEndInputAsState: false,
                group: config.group,
                order: config.order,
                width: config.width,
                height: config.height,
                convertBack: function (value) {
                    return value;
                },

                //When the click function is called
                beforeSend: function (msg, orig) {
                    if (orig) {
                        return orig.msg;
                    }
                },

                //Setup the angular parameters
                initController: function ($scope, events) {
                    //Set our width (supporting old browsers that don't support calc)
                    $scope.value = "";

                    //When a button is clicked
                    $scope.buttonClicked = function (value) {
                        $scope.send({ payload: value });
                    }

                    //When a message comes on the input and is sent from before emit
                    $scope.$watch("msg", function (msg) {
                        if (!msg) { return; }
                        $scope.value = msg.payload;
                    });
                },

                //When a message is on the input
                beforeEmit: function (msg, value) {
                    return { msg };
                }

            });

        }
        catch (e) {
            console.log(e);
        }
        node.on("close", done);
    }
    RED.nodes.registerType('ui_button_state', ButtonState);
};