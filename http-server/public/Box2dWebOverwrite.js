Box2D.Dynamics.b2World.prototype.DrawDebugDataCustom = function(){

	b2Color = Box2D.Common.b2Color;
	Box2D.Dynamics.b2World.prototype.DrawShape = Box2D.Dynamics.b2World.prototype.DrawShapeCustom;

	if (this.m_debugDraw == null) {
		return;
	}

    if ( !DEBUG_FLAGS.motionBlurRender.enabled )
    	this.m_debugDraw.m_sprite.graphics.clear();

	var flags = this.m_debugDraw.GetFlags();
	var i = 0;
	var b;
	var f;
	var s;
	var j;
	var bp;
	var invQ = new b2Vec2;
	var x1 = new b2Vec2;
	var x2 = new b2Vec2;
	var xf;
	var b1 = new b2AABB();
	var b2 = new b2AABB();
	var vs = [new b2Vec2(), new b2Vec2(), new b2Vec2(), new b2Vec2()];
	var color = new b2Color(0, 0, 0);
	if (flags & b2DebugDraw.e_shapeBit) {
		for (b = this.m_bodyList;
			 b; b = b.m_next) {
			xf = b.m_xf;
			for (f = b.GetFixtureList();
				 f; f = f.m_next) {
				s = f.GetShape();
				if (b.IsActive() == false) {
					color.Set(0.5, 0.5, 0.3);
					this.DrawShape(s, xf, color, b);
				}
				else if (b.GetType() == b2Body.b2_staticBody) {
					color.Set(0.5, 0.9, 0.5);
					this.DrawShape(s, xf, color, b);
				}
				else if (b.GetType() == b2Body.b2_kinematicBody) {
					color.Set(0.5, 0.5, 0.9);
					this.DrawShape(s, xf, color, b);
				}
				else if (b.IsAwake() == false) {
					color.Set(0.6, 0.6, 0.6);
					this.DrawShape(s, xf, color, b);
				}
				else {
					color.Set(0.9, 0.7, 0.7);
					this.DrawShape(s, xf, color, b);
				}
			}
		}
	}
	if (flags & b2DebugDraw.e_jointBit) {
		for (j = this.m_jointList;
			 j; j = j.m_next) {
			this.DrawJoint(j);
		}
	}
	if (flags & b2DebugDraw.e_controllerBit) {
		for (var c = this.m_controllerList; c; c = c.m_next) {
			c.Draw(this.m_debugDraw);
		}
	}
	if (flags & b2DebugDraw.e_pairBit) {
		color.Set(0.3, 0.9, 0.9);
		for (var contact = this.m_contactManager.m_contactList; contact; contact = contact.GetNext()) {
			var fixtureA = contact.GetFixtureA();
			var fixtureB = contact.GetFixtureB();
			var cA = fixtureA.GetAABB().GetCenter();
			var cB = fixtureB.GetAABB().GetCenter();
			this.m_debugDraw.DrawSegment(cA, cB, color);
		}
	}
	if (flags & b2DebugDraw.e_aabbBit) {
		bp = this.m_contactManager.m_broadPhase;
		vs = [new b2Vec2(), new b2Vec2(), new b2Vec2(), new b2Vec2()];
		for (b = this.m_bodyList;
			 b; b = b.GetNext()) {
			if (b.IsActive() == false) {
				continue;
			}
			for (f = b.GetFixtureList();
				 f; f = f.GetNext()) {
				var aabb = bp.GetFatAABB(f.m_proxy);
				vs[0].Set(aabb.lowerBound.x, aabb.lowerBound.y);
				vs[1].Set(aabb.upperBound.x, aabb.lowerBound.y);
				vs[2].Set(aabb.upperBound.x, aabb.upperBound.y);
				vs[3].Set(aabb.lowerBound.x, aabb.upperBound.y);
				this.m_debugDraw.DrawPolygon(vs, 4, color);
			}
		}
	}
	if (flags & b2DebugDraw.e_centerOfMassBit) {
		for (b = this.m_bodyList;
			 b; b = b.m_next) {
			xf = b2World.s_xf;
			xf.R = b.m_xf.R;
			xf.position = b.GetWorldCenter();
			this.m_debugDraw.DrawTransform(xf);
		}
	}
}

Box2D.Dynamics.b2World.prototype.DrawShapeCustom = function (shape, xf, color, body) {

	b2Shape = Box2D.Collision.Shapes.b2Shape;
	b2Math = Box2D.Common.Math.b2Math;
	//shape.m_type = 3;

	switch (shape.m_type) {
		case b2Shape.e_circleShape: //0
		{
			var circle = ((shape instanceof b2CircleShape ? shape : null));
			var center = b2Math.MulX(xf, circle.m_p);
			var radius = circle.m_radius;
			var axis = xf.R.col1;

			if(body.type == 'bag'){
				this.m_debugDraw.DrawSolidCircle(center, radius, axis, color);
				center.x -= 0.7;
				center.y -= 0.7;
				this.m_debugDraw.DrawImage(center, radius, axis, color, body.GetAngle());
				
			}else{


				this.m_debugDraw.DrawSolidCircle(center, radius, axis, color);
			}
		}
			break;
		case b2Shape.e_polygonShape: //1
		{
			var i = 0;
			var poly = ((shape instanceof b2PolygonShape ? shape : null));
			var vertexCount = parseInt(poly.GetVertexCount());
			var localVertices = poly.GetVertices();
			var vertices = new Vector(vertexCount);
			for (i = 0;
				 i < vertexCount; ++i) {
				vertices[i] = b2Math.MulX(xf, localVertices[i]);
			}
			this.m_debugDraw.DrawSolidPolygon(vertices, vertexCount, color);
		}
			break;
		case b2Shape.e_edgeShape: //2
		{
			var edge = (shape instanceof b2EdgeShape ? shape : null);
			this.m_debugDraw.DrawSegment(b2Math.MulX(xf, edge.GetVertex1()), b2Math.MulX(xf, edge.GetVertex2()), color);
		}
			break;
		case 3: //3
		{

			this.m_debugDraw.DrawImage(b2Math.MulX(xf, edge.GetVertex1()), b2Math.MulX(xf, edge.GetVertex2()), color);
			this.m_debugDraw
		}
			break;
	}
}

Box2D.Dynamics.b2DebugDraw.prototype.DrawImage = function (center, radius, axis, color, rotation) {

	var s = this.m_ctx,
		drawScale = this.m_drawScale,
		cx = center.x * drawScale,
		cy = center.y * drawScale;

				s.save();
				s.translate(cx + (teaImageObj.width / 2),cy + (teaImageObj.height / 2));
				s.rotate(rotation - 30);
								

	this.m_ctx.drawImage(teaImageObj,-(teaImageObj.width / 2),-(teaImageObj.height / 2));

	s.restore();
};