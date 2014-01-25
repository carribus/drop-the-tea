var peg, bag;

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


var world = new b2World(
      new b2Vec2(0, 10) //gravity
      , true //allow sleep
);
var frame = 0;
var pegs = [];

var fixDef = new b2FixtureDef;
fixDef.density = 1.0;
fixDef.friction = 0.5;
fixDef.restitution = 0.2;

var bodyDef = new b2BodyDef;

/*
 * Collision Listener object
 */
var contactListener = new b2ContactListener();
contactListener.BeginContact = function(contact) {
    console.log('BeginContact');
    console.log(contact);
}

contactListener.EndContact = function(contact) {
    console.log('EndContact');
    console.log(contact);
}

function addBag() {

	//create the bag
	bag = new b2BodyDef;
	bag.type = b2Body.b2_dynamicBody;
	fixDef.shape = new b2CircleShape(0.4);
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
}

function init() {
      var map;

      // create the world's contact listener
      world.SetContactListener(contactListener);

      bodyDef.type = b2Body.b2_kinematicBody;
      fixDef.shape = new b2CircleShape(0.4);
      for (var i = 1; i < 10; ++i) {
            for (var j = 0; j < 3; j++) {
                  fixDef.shape = new b2CircleShape(
                        0.3 //radius
                  );

                  bodyDef.position.x = i * 4.2;
                  bodyDef.position.y = (j % 40)* 3 + 10;
                  map = world.CreateBody(bodyDef).CreateFixture(fixDef);

                  if(j% 2){
                        map.m_body.SetLinearVelocity (new b2Vec2(2, 0));    
                  }else{
                        map.m_body.SetLinearVelocity (new b2Vec2(-2, 0)); 
                  }

                  pegs.push(map);
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


      //create some objects
      addTeaCup()


      //setup debug draw
      var debugDraw = new b2DebugDraw();
      debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
      debugDraw.SetDrawScale(30.0);
      debugDraw.SetFillAlpha(0.5);
      debugDraw.SetLineThickness(1.0);
      debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
      world.SetDebugDraw(debugDraw);

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
            world.Step(1 / 60, 10, 10);
            world.DrawDebugData();
            world.ClearForces();

            if(frame % 50 === 0){
                  var velocity;
                  for(var i = 0; i < pegs.length; i++){
                        velocity = pegs[i].m_body.GetLinearVelocity();
                        pegs[i].m_body.SetLinearVelocity(new b2Vec2(-velocity.x, velocity.y));
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
