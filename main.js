var DEBUG_FLAGS = {
    verboseLogging: false
}

var peg, bag;

var level = levels[0]

var b2Vec2 = Box2D.Common.Math.b2Vec2,
      b2AABB = Box2D.Collision.b2AABB,
      b2BodyDef = Box2D.Dynamics.b2BodyDef,
      b2Body = Box2D.Dynamics.b2Body,
      b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
      b2Fixture = Box2D.Dynamics.b2Fixture,
      b2World = Box2D.Dynamics.b2World,
      b2MassData = Box2D.Collision.Shapes.b2MassData,
      b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
      b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
      b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
      b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef,
      b2ContactListener = Box2D.Dynamics.b2ContactListener;

var ctx;

var world = new b2World(
      new b2Vec2(0, 10) //gravity
      , true //allow sleep
);
var frame = 0;
var pegs = [];

var fixDef = new b2FixtureDef;
fixDef.density = 1.0;
fixDef.friction = 0.5;
fixDef.restitution = 0.4;

var bodyDef = new b2BodyDef;

/*
 * Collision Listener object
 */
function ContactListener() {
    this.listeners = [];
};
ContactListener.prototype = Object.create(b2ContactListener.prototype);
ContactListener.prototype.constructor = ContactListener;

ContactListener.prototype.on = function(body, listener) {
    this.listeners.push({"body": body, "once": false, "listener": listener});
}

ContactListener.prototype.once = function(body, listener) {
    this.listeners.push({"body": body, "once": true, "listener": listener});
}

ContactListener.prototype.notify = function(body, otherBody) {
    var listener;
    for ( var i = 0, len = this.listeners.length; i < len; i++ ) {
        if ( body == this.listeners[i].body || otherBody == this.listeners[i].body ) {
            listener = this.listeners[i].listener;
            // remove the listener if its a 'once-off'
            if ( this.listeners[i].once ) {
                this.listeners.splice(i--);
            }
            listener(this.listeners[i].body);
        }
    }
}

var contactListener = new ContactListener();

contactListener.BeginContact = function(contact) {
    if ( DEBUG_FLAGS.verboseLogging ) {
        console.log('BeginContact');
        console.log(contact);
    }

    this.notify(contact.m_fixtureA.m_body, contact.m_fixtureB.m_body);
}

contactListener.EndContact = function(contact) {
    if ( DEBUG_FLAGS.verboseLogging ) {
        console.log('EndContact');
        console.log(contact);
    }
}

function addBag() {

	//create the bag
	bag = new b2BodyDef;
	bag.type = b2Body.b2_dynamicBody;
	fixDef.shape = new b2CircleShape(1);
	bag.position.x = 15;
	bag.position.y = 1;
	bag = world.CreateBody(bag).CreateFixture(fixDef);

	var md = new b2MouseJointDef();
	md.bodyA = peg.m_body;
	md.bodyB = bag.m_body;
	md.target.Set(peg.m_body.m_xf.position.x, peg.m_body.m_xf.position.y);
	md.collideConnected = true;
	md.maxForce = 400;
	bag.m_body.string = world.CreateJoint(md);

//    contactListener.on(bag.m_body, onBagCollision);

}

function onBagCollision() {
    console.log('Your bag touched something icky...');
}

function init() {
      var map;

      // create the world's contact listener
      world.SetContactListener(contactListener);

      bodyDef.type = b2Body.b2_kinematicBody;
      fixDef.shape = new b2CircleShape(0.4);
      // for (var i = 1; i < 10; ++i) {
      //       for (var j = 0; j < 3; j++) {
      //             fixDef.shape = new b2CircleShape(
      //                   0.3 //radius
      //             );

      //             bodyDef.position.x = i * 4.2;
      //             bodyDef.position.y = (j % 40)* 3 + 10;
      //             map = world.CreateBody(bodyDef).CreateFixture(fixDef);

      //             if(j% 2){
      //                   map.m_body.SetLinearVelocity (new b2Vec2(2, 0));    
      //             }else{
      //                   map.m_body.SetLinearVelocity (new b2Vec2(-2, 0)); 
      //             }

      //             pegs.push(map);
      //       }
      // }

      function addc(s){
            fixDef.shape = new b2CircleShape(
                  0.3 //radius
            );  

            bodyDef.position.x = s.position.x;
            bodyDef.position.y = s.position.y;

            map = world.CreateBody(bodyDef).CreateFixture(fixDef);
            map.m_body.SetLinearVelocity (new b2Vec2(s.velocity.x, s.velocity.y));    

            s.fixture = map;      
            if(s.av){
              s.fixture.m_body.SetAngularVelocity(s.av);
            }
      }

      function addb(s){
            fixDef.shape = new b2PolygonShape;
            fixDef.shape.SetAsBox(s.size.w, s.size.h);

            bodyDef.position.x = s.position.x;
            bodyDef.position.y = s.position.y;

            map = world.CreateBody(bodyDef).CreateFixture(fixDef);
            map.m_body.SetLinearVelocity (new b2Vec2(s.velocity.x, s.velocity.y));    

            s.fixture = map;      
            if(s.av){
              s.fixture.m_body.SetAngularVelocity(s.av);    
            }
      }

      function addcup(s){
            for(var i = 0; i < 3; i++){
                  fixDef.shape = new b2PolygonShape;
                  switch(i){
                        case 0:
                              fixDef.shape.SetAsBox(0.5, 2);   
                              bodyDef.position.x = s.position.x - s.size.w + 0.5;
                              bodyDef.position.y = s.position.y - 3;
                            map = world.CreateBody(bodyDef).CreateFixture(fixDef);
                            map.m_body.SetLinearVelocity (new b2Vec2(s.velocity.x, s.velocity.y));
                        break;
                        case 1:
                              fixDef.shape.SetAsBox(s.size.w, 0.5);   
                              bodyDef.position.x = s.position.x;
                              bodyDef.position.y = s.position.y-0.5;
                            map = world.CreateBody(bodyDef).CreateFixture(fixDef);
                            map.m_body.SetLinearVelocity (new b2Vec2(s.velocity.x, s.velocity.y));
                            contactListener.on(map.m_body, function(body) {
                                console.info('Cup cup cup. FUck you cup');
                            })
                        break;
                        case 2:
                              fixDef.shape.SetAsBox(0.5, 2);   
                              bodyDef.position.x = s.position.x + s.size.w - 0.5;
                              bodyDef.position.y = s.position.y - 3;
                            map = world.CreateBody(bodyDef).CreateFixture(fixDef);
                            map.m_body.SetLinearVelocity (new b2Vec2(s.velocity.x, s.velocity.y));
                        break;
                  }
                   

                  


                  s.fixture = map;      
                  if(s.av){
                    s.fixture.m_body.SetAngularVelocity(s.av);    
                  }                      
            }
   
      }

      for(var i = 0; i < level.shapes.length; i++){
            switch(level.shapes[i].type){
                  case 'c':
                        addc(level.shapes[i]);
                  break;
                  case 'b':
                        addb(level.shapes[i]);
                  break;
                  case 'cup':
                        addcup(level.shapes[i]);
                  break;
            }
      }

      //create ground
      bodyDef.type = b2Body.b2_staticBody;
      //Top bottom limits
      fixDef.shape = new b2PolygonShape;
      fixDef.shape.SetAsBox(40, 2);
      bodyDef.position.Set(10, 900 / 30 + 1.8);
      world.CreateBody(bodyDef).CreateFixture(fixDef);
      bodyDef.position.Set(10, -1.8);
      world.CreateBody(bodyDef).CreateFixture(fixDef);

      //Left Right
      fixDef.shape.SetAsBox(2, 18);
      bodyDef.position.Set(-1.8, 17);
      world.CreateBody(bodyDef).CreateFixture(fixDef);
      bodyDef.position.Set(1400 / 30 + 1.8, 13);
      world.CreateBody(bodyDef).CreateFixture(fixDef);

      //create the peg
      peg = new b2BodyDef;
      peg.type = b2Body.b2_staticBody;
      fixDef.shape = new b2CircleShape(0.1);
      peg.position.x = 22;
      peg.position.y = 1;
      peg = world.CreateBody(peg).CreateFixture(fixDef);

      //create the bag attached to the peg



      //setup debug draw
      ctx = document.getElementById('canvas').getContext('2d');
      var debugDraw = new b2DebugDraw();
      debugDraw.SetSprite(ctx);
      debugDraw.SetDrawScale(30.0);
      debugDraw.SetFillAlpha(0.5);
      debugDraw.SetLineThickness(1.0);
      debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
      world.SetDebugDraw(debugDraw);

      window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

      window.setInterval(update, 1000 / 60);

      //mouse

      var mouseX, mouseY, mousePVec, isMouseDown, selectedBody, mouseJoint;
      var canvasPosition = getElementPosition(document.getElementById("canvas"));

      document.addEventListener("mousedown", function(e) {
            mouseX = (e.clientX - canvasPosition.x) / 30;
            mouseY = (e.clientY - canvasPosition.y) / 30;
            var clickedBag = getBodyAtMouse();
            if (clickedBag) {
                  world.DestroyJoint(clickedBag.string);
            }
      }, true);


      function getBodyAtMouse() {
            mousePVec = new b2Vec2(mouseX, mouseY);
            var aabb = new b2AABB();
            aabb.lowerBound.Set(mouseX - 0.001, mouseY - 0.001);
            aabb.upperBound.Set(mouseX + 0.001, mouseY + 0.001);

            // Query the world for overlapping shapes.
            selectedBody = null;
            world.QueryAABB(getBodyCB, aabb);
            return selectedBody;
      }

      function getBodyCB(fixture) {
            if (fixture.GetBody().GetType() != b2Body.b2_staticBody) {
                  if (fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mousePVec)) {
                        selectedBody = fixture.GetBody();
                        return false;
                  }
            }
            return true;
      }

      //update
      function update() {
            frame++;
            world.Step(1 / 30, 10, 10);
            world.DrawDebugData();
            world.ClearForces();

            for(var i = 0; i < level.shapes.length; i++){
                  if(!level.shapes[i].flip) continue;
                  if(frame % level.shapes[i].flip === 0){
                        velocity = level.shapes[i].fixture.m_body.GetLinearVelocity();
                        level.shapes[i].fixture.m_body.SetLinearVelocity(new b2Vec2(-velocity.x, velocity.y));
                        
                  }
            }
      };

      //helpers

      //http://js-tut.aardon.de/js-tut/tutorial/position.html
      function getElementPosition(element) {
            var elem = element,
                  tagname = "",
                  x = 0,
                  y = 0;

            while ((typeof(elem) == "object") && (typeof(elem.tagName) != "undefined")) {
                  y += elem.offsetTop;
                  x += elem.offsetLeft;
                  tagname = elem.tagName.toUpperCase();

                  if (tagname == "BODY")
                        elem = 0;

                  if (typeof(elem) == "object") {
                        if (typeof(elem.offsetParent) == "object")
                              elem = elem.offsetParent;
                  }
            }

            return {
                  x: x,
                  y: y
            };
      }


};
