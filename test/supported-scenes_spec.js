var should = require("should");
var testData = require('mocha-testdata');
var helper = require("node-red-node-test-helper");
var decoderNode = require("../template-node.js");


helper.init(require.resolve('node-red'));

describe('Supported Scene Inputs', function () {
  var runs = [
    {it: '1 click up', scene_id: 1, scene_data:7680, clickCount : 1, button : "down", action:"tap"},
    {it: '2 click up', scene_id: 1, scene_data:7860, clickCount : 2, button : "down", action:"tap"},
    {it: '3 click up', scene_id: 1, scene_data:7920, clickCount : 3, button : "down", action:"tap"},
    {it: '4 click up', scene_id: 1, scene_data:7980, clickCount : 4, button : "down", action:"tap"},
    {it: '5 click up', scene_id: 1, scene_data:8040, clickCount : 5, button : "down", action:"tap"},
    {it: '1 click down', scene_id: 2, scene_data:7680, clickCount : 1, button : "up", action:"tap"},
    {it: '1 click config', scene_id: 3, scene_data:7680, clickCount : 1, button : "config", action:"tap"},
    {it: 'hold down', scene_id: 1, scene_data:7800, clickCount : 1, button : "down", action:"hold"},
    {it: 'release down', scene_id: 1, scene_data:7740, clickCount : 1, button : "down", action:"release"},
    {it: 'hold up', scene_id: 2, scene_data:7800, clickCount : 1, button : "up", action:"hold"},
    {it: 'release up', scene_id: 2, scene_data:7740, clickCount : 1, button : "up", action:"release"},
    
  ];

  beforeEach(function (done) {
      helper.startServer(done);
  });

  afterEach(function (done) {
      helper.unload();
      helper.stopServer(done);
  });

  testData.given(runs).it('adds parameters', function (done, run) {
        
    var flow = [
          { id: "n1", type: "inovelli-scene-decoder", name: "inovelli-scene-decoder",wires:[["n2"]] },
          { id: "n2", type: "helper" }
        ];
        helper.load(decoderNode, flow, function () {
          var receiver = helper.getNode("n2");
          var nut = helper.getNode("n1");
          receiver.on("input", function (msg) {
            try{
              msg.payload.event.should.have.property('button', run.button);
              msg.payload.event.should.have.property('click_count', run.clickCount);
              msg.payload.event.should.have.property('action', run.action);
              done();
            }catch(err){
              return done(err);
            }
          });
          nut.receive( {"payload":{"event_type":"zwave.scene_activated","event":{"scene_id":run.scene_id,"scene_data":run.scene_data}}});
        });
      });
});

