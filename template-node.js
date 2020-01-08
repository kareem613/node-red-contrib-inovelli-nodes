module.exports = function(RED) {
    function TemplateNode(config) {
        RED.nodes.createNode(this,config);

        var node = this;

        var sceneMap = {
            1: 'up',
            2: 'down',
            3: 'config'
        };
        var clickMap = {
            7680: 1,
            7860: 2,
            7920: 3, 
            7980: 4,
            8040: 5
        };

        initConfiguration();
        setStatus("grey");

        node.on('input', function(msg, send, done) {
            try{
                send = send || function() { node.send.apply(node,arguments) } //For backwards compatibility with node-red 0.x

                if(msg.payload){
                    if(msg.payload.event){
                        if(msg.payload.event.scene_id && msg.payload.event.scene_data){
                            var scene_id = msg.payload.event.scene_id;
                            var scene_data = msg.payload.event.scene_data;
                            var button = getButton(scene_id);
                            var clickCount = getClickCount(scene_data);
                            if(clickCount && button){
                                msg.payload.event.button = button;
                                msg.payload.event.click_count = clickCount;
                                setStatus("green", button, clickCount);
                            }
                        }
                    }
                }
                send([msg])
                if (node.done) {
                    node.done();
                }
            }catch(err){
                if(done){
                    node.done(err);
                }
                else
                    node.error(err, msg)
            }
        });

        function getButton(scene_id){
            return sceneMap[scene_id];
        }

        function getClickCount(scene_data){
            
            return clickMap[scene_data];
        }

        function initConfiguration() {
            node.config1 = config.config1 != undefined ? config.config1 : "default_config_1" ;
        }

        function setStatus(fill, button, clickCount){
            if(typeof button == 'undefined' || typeof clickCount == 'undefined'){
                node.status({fill:fill,shape:"dot",text: "No scene event yet."});
                return;
            }
            node.status({fill:fill,shape:"dot",text: getStatusString(button, clickCount)});
        }
    
        function getStatusString(button, clickCount){
            var timesText = clickCount == 1 ? " time":" times";
            var status =  "" + button + " clicked " + clickCount + timesText + " at "  + getPrettyDate(new Date());
            return status;
        }

        function getPrettyDate(date) {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour12: false,
                hour: 'numeric',
                minute: 'numeric'
            });
        }
    }

    RED.nodes.registerType("inovelli-scene-decoder",TemplateNode);
}