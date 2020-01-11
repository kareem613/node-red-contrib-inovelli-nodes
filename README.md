![github build](https://github.com/kareem613/node-red-contrib-inovelli-nodes/workflows/Node.js%20Package/badge.svg)

## Overview

Decodes inovelli scene activation data and adds simplified properties to the payload.

### Input
Input from home assistant `events : all node` with Event Type set to `zwave.scene_activated`

### Output
Looks for <code>scene_id</code> and <code>scene_data</code> properties in <code>msg.payload.event</code>. If found, adds <code>button<</code>> and <code>click_count</code> properties to <code>msg.payload.event</code>.

If either `scene_id` or `scene_data` is not found or if values are unsupported, `msg` is not modified.