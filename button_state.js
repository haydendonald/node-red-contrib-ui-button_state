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
        var HTML = String.raw`<div style="width: 100%; height: 100%; display: none;">`;

        var optionButtonCSS = String.raw`
            width: 100%;
            padding: 0;
            margin: 0;
            margin-top: 2.5px;
            margin-bottom: 2.5px;
        `;

        //Add a button to the HTML
        var addButton = function (value) {
            HTML += String.raw`
                <md-button 
                    style='${optionButtonCSS} ${config.offClass == "" ? "background-color:" + value.offColor : ""}'
                    ${config.offClass != "" ? "class=" + config.offClass : ""}
                    ng-click="buttonClicked('${value.value}')"
                    value="${value.value}" 
                    oncolor="${value.onColor}" 
                    offcolor="${value.offColor}" 
                    onclass="${config.onClass || "disabled"}" 
                    offclass="${config.offClass || "disabled"}">${value.label}
                </md-button>
            `;
        }

        HTML += String.raw`<div>`;

        //Add the buttons for the values
        var j = 0;
        for (var i = 0; i < config.options.length; i++) {
            //If we go outside our height bounds move over to the next column
            if (j >= parseInt(config.height)) {
                HTML += String.raw`</div><div>`;
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
                format: generateHTML(config),
                templateScope: "local",
                group: config.group,
                emitOnlyNewValues: false,
                forwardInputMessages: false,
                storeFrontEndInputAsState: true,
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
                    $scope.buttons = {};

                    //Find the containing element
                    setTimeout(function () {
                        for (var i = 0; i < document.getElementsByTagName("md-card").length; i++) {
                            var curr = document.getElementsByTagName("md-card")[i];
                            if (curr.getAttribute("node-id") == id) {
                                var width = curr.clientWidth;
                                var height = curr.clientHeight;
                                curr.style.padding = 0;
                                curr.style.margin = 0;

                                
                                var containerWidth = (width / (curr.getElementsByTagName("div").length - 1)) - 5;
                                var buttonHeight = (height / $scope.height) - 5;

                                //Set our size based on the rendered size
                                for (var j = 1; j < curr.getElementsByTagName("div").length; j++) {
                                    var currDiv = curr.getElementsByTagName("div")[j];
                                    var containerCSS = String.raw`
                                    padding: 0;
                                    margin: 0;
                                    margin-left: 2.5px;
                                    margin-right: 2.5px;
                                    float: left;
                                    width: ${containerWidth}px;
                                    height: 100%;
                                    display: inline-block;
                                `;

                                    currDiv.style.cssText = containerCSS;
                                    for (var k = 0; k < currDiv.getElementsByTagName("button").length; k++) {
                                        var currButton = currDiv.getElementsByTagName("button")[k];
                                        currButton.style.height = String.raw`${buttonHeight}px`;
                                        if ($scope.buttons[currButton.getAttribute("value")] === undefined) { $scope.buttons[currButton.getAttribute("value")] = []; }
                                        $scope.buttons[currButton.getAttribute("value")].push(currButton);
                                    }
                                }
                                $scope.updateButtons($scope.value);

                                //Show the element once everything has loaded since this will happen after the page is loaded :(
                                curr.getElementsByTagName("div")[0].style.display = "block";

                                //Send a request to get states
                                $scope.send([undefined, { payload: $scope.value }]);
                            }
                        }

                    }, 300); //The timeout exists to allow the DOM to render in before we grab it's values to do our calculations


                    //When a button is clicked
                    $scope.buttonClicked = function (value) {
                        $scope.send([{ payload: value }, undefined]);
                    }

                    $scope.updateButtons = function (newValue) {
                        //Update our buttons
                        try {
                            for (var j = 0; j < $scope.buttons[$scope.value].length; j++) {
                                var offColor = $scope.buttons[$scope.value][j].getAttribute("offColor");
                                var offClass = $scope.buttons[$scope.value][j].getAttribute("offClass");
                                var onClass = $scope.buttons[$scope.value][j].getAttribute("onClass");

                                if (offClass != "disabled") {
                                    $scope.buttons[$scope.value][j].style.backgroundColor = "";
                                    $scope.buttons[$scope.value][j].classList.add(offClass);
                                    $scope.buttons[$scope.value][j].classList.remove(onClass);
                                }
                                else {
                                    $scope.buttons[$scope.value][j].style.backgroundColor = offColor;
                                }
                            }
                        }
                        catch (e) { }
                        try {
                            for (var j = 0; j < $scope.buttons[newValue].length; j++) {
                                var onColor = $scope.buttons[newValue][j].getAttribute("onColor");
                                var offClass = $scope.buttons[newValue][j].getAttribute("offClass");
                                var onClass = $scope.buttons[newValue][j].getAttribute("onClass");

                                if (onClass != "disabled") {
                                    $scope.buttons[newValue][j].style.backgroundColor = "";
                                    $scope.buttons[newValue][j].classList.add(onClass);
                                    $scope.buttons[newValue][j].classList.remove(offClass);
                                }
                                else {
                                    $scope.buttons[newValue][j].style.backgroundColor = onColor;
                                }
                            }
                        }
                        catch (e) { }
                    }

                    //When a message comes on the input and is sent from before emit
                    $scope.$watch("msg", function (msg) {
                        if (!msg) { return; }

                        $scope.updateButtons(msg.payload);
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