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
    var generateHTML = function (config) {
        var HTML = "";

        //Add the CSS
        HTML += String.raw`
        <style>
            .on {
                background-color: green !important;
            }

            .off {
                background-color: red !important;
            }
        </style>
        `;

        //Add a button to the HTML
        var addButton = function (value) {
            HTML += String.raw`
                <md-button class="{{(value == '${value.value}') ? 'on': 'off'}}" ng-click="buttonClicked('${value.value}')">${value.text}</md-button>
            `;
        }

        //Add the buttons for the values
        for (var i = 0; i < config.values.length; i++) {
            addButton(config.values[i]);
        }
        return HTML;
    }

    var ui = undefined;
    function ButtonState(config) {
        try {
            var node = this;
            if (ui === undefined) {
                ui = RED.require("node-red-dashboard")(RED);
            }

            //Stuff to be set in the config
            config.values = [
                {
                    "text": "Test",
                    "value": "testVal",
                    "onColor": "green",
                    "offColor": "red"
                },
                {
                    "text": "Test1",
                    "value": "testVal1",
                    "onColor": "green",
                    "offColor": "red"
                },
                {
                    "text": "Test2",
                    "value": "testVal2",
                    "onColor": "green",
                    "offColor": "red"
                },
                {
                    "text": "Test3",
                    "value": "testVal3",
                    "onColor": "green",
                    "offColor": "red"
                },
                {
                    "text": "Test4",
                    "value": "testVal4",
                    "onColor": "green",
                    "offColor": "red"
                }
            ];


            RED.nodes.createNode(this, config);
            var done = ui.addWidget({
                node: node,
                format: generateHTML(config),
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
                    $scope.value = "";

                    //When a button is clicked
                    $scope.buttonClicked = function (value) {
                        $scope.send({ payload: value });
                    }

                    //When a message comes on the input and is sent from before emit
                    $scope.$watch("msg", function (msg) {
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