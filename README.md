<!-- ![github build](https://github.com/kareem613/node-red-contrib-sequence-detector/workflows/Node.js%20Package/badge.svg) -->

## Overview
Decodes inovelli scene activation data and adds simplified properties to the payload.

### Input

Input from home assistant events : all node with Event Type set to zwave.scene_activated

 ### Output

Looks for scene_id and scene_data properties in msg.payload.event. If found, adds button and click_count properties to msg.payload.event.

If either scene_id or scene_data is not found or if values are unsupported, the msg is not modified.
