var should = require("should");
var helper = require("node-red-node-test-helper");
var decoderNode = require("../template-node.js");

helper.init(require.resolve('node-red'));

describe('Basic Configuration', function () {

  beforeEach(function (done) {
      helper.startServer(done);
  });

  afterEach(function (done) {
      helper.unload();
      helper.stopServer(done);
  });

  it('should be loaded', function (done) {
    var flow = [{ id: "n1", type: "inovelli-scene-decoder", name: "inovelli-scene-decoder"}];
    helper.load(decoderNode, flow, function () {
      var n1 = helper.getNode("n1");
      
      try{
        n1.should.have.have.property('name', 'inovelli-scene-decoder');
        done();
      }catch(err){
        return done(err);
      }
    });
  });

  it('should have default config options', function (done) {
    var flow = [{ id: "n1", type: "inovelli-scene-decoder", name: "inovelli-scene-decoder"}];
    helper.load(decoderNode, flow, function () {
      var n1 = helper.getNode("n1");
      
      try{
        n1.should.have.have.property('name', 'inovelli-scene-decoder');
        n1.should.have.have.property('config1', 'default_config_1');
        done();
      }catch(err){
        return done(err);
      }
    });
  });

  it('should use config options', function (done) {
    var flow = [{ id: "n1", type: "inovelli-scene-decoder", name: "inovelli-scene-decoder",
      config1: "new_config_1"
    }];
    helper.load(decoderNode, flow, function () {
      var n1 = helper.getNode("n1");
      
      try{
        n1.should.have.have.property('name', 'inovelli-scene-decoder');
        n1.should.have.have.property('config1', 'new_config_1');
        done();
      }catch(err){
        return done(err);
      }
    });
  });

 
});

describe('Unsupported Inputs', function () {
  it('should output input for message with missing properties', function (done) {
    var flow = [
      { id: "n1", type: "inovelli-scene-decoder", name: "inovelli-scene-decoder",wires:[["n2"]] },
      { id: "n2", type: "helper" }
    ];
    helper.load(decoderNode, flow, function () {
      var receiver = helper.getNode("n2");
      var nut = helper.getNode("n1");
      receiver.on("input", function (msg) {
        try{
          msg.should.have.property('payload', '0');
          done();
        }catch(err){
          return done(err);
        }
      });
      nut.receive({ payload: "0" });
    });
  });

  it('should output input for unsupported scene_data', function (done) {
    var flow = [
      { id: "n1", type: "inovelli-scene-decoder", name: "inovelli-scene-decoder",wires:[["n2"]] },
      { id: "n2", type: "helper" }
    ];
    var inputMessage = {"payload":{"event_type":"zwave.scene_activated","event":{"scene_id":1,"scene_data":1234}}};
    helper.load(decoderNode, flow, function () {
      var receiver = helper.getNode("n2");
      var nut = helper.getNode("n1");
      receiver.on("input", function (msg) {
        try{
          msg.payload.event.should.not.have.property('click_count');
          msg.payload.event.should.not.have.property('button');
          done();
        }catch(err){
          return done(err);
        }
      });
      nut.receive(inputMessage);
    });
  });

  it('should output input for unsupported scene_id', function (done) {
    var flow = [
      { id: "n1", type: "inovelli-scene-decoder", name: "inovelli-scene-decoder",wires:[["n2"]] },
      { id: "n2", type: "helper" }
    ];
    var inputMessage = {"payload":{"event_type":"zwave.scene_activated","event":{"scene_id":99,"scene_data":7860}}};
    helper.load(decoderNode, flow, function () {
      var receiver = helper.getNode("n2");
      var nut = helper.getNode("n1");
      receiver.on("input", function (msg) {
        try{
          msg.payload.event.should.not.have.property('click_count');
          msg.payload.event.should.not.have.property('button');
          done();
        }catch(err){
          return done(err);
        }
      });
      nut.receive(inputMessage);
    });
  });
});
