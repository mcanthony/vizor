(function() {
	var ThreePointLightPlugin = E2.plugins.three_point_light = function(core) {
		ThreeObject3DPlugin.apply(this, arguments)

		this.desc = 'THREE.js Point Light'

		this.params = {
			/*color: core.renderer.color_white, */
			intensity: 1.0,
			distance: 0.0,
			decay: 1.0
		}

		this.input_slots = [
			{ name: 'intensity', dt: core.datatypes.FLOAT, def: this.params.intensity },
			{ name: 'distance', dt: core.datatypes.FLOAT, def: this.params.distance },
			{ name: 'decay', dt: core.datatypes.FLOAT, def: this.params.decay }
			//{ name: 'color', dt: core.datatypes.COLOR, def: this.params.color },
		].concat(this.input_slots)
	}

	ThreePointLightPlugin.prototype = Object.create(ThreeObject3DPlugin.prototype)

	ThreePointLightPlugin.prototype.reset = function() {
		ThreeObject3DPlugin.prototype.reset.apply(this)

		this.object3d = new THREE.PointLight( 0xFFFFFF ); // soft white light

		// back reference for object picking
		this.object3d.backReference = this
	}

})()

