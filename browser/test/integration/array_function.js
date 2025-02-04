var assert = require('assert');
var fs = require('fs')

var reset = require('../unit/plugins/helpers').reset;
var loadPlugin = require('../unit/plugins/helpers').loadPlugin;

global.E2 = {}
var Application = require('../../scripts/application')

global._ = require('lodash')
global.EventEmitter = require('../../scripts/event-emitter')
global.Node = require('../../scripts/node').Node
global.LinkedSlotGroup = require('../../scripts/node').LinkedSlotGroup
global.Graph = require('../../scripts/graph')
global.Flux = require('../../vendor/flux')
global.Plugin = require('../../scripts/plugin');
global.Store = require('../../scripts/store');
global.GraphStore = require('../../scripts/graphStore');
global.PeopleManager = function() {}
global.PeopleStore = function() {
	this.list = function(){ return [] }
}

global.NodeUI = function() {
	this.dom = [$()]
	this.dom.remove = function(){}
	this.dom.position = this.dom[0].position
	this.dom.width = this.dom[0].width
	this.dom.height = this.dom[0].height
	this.dom[0].style = {}
}

global.PresetManager = function() {}

require('../../scripts/commands/graphEditCommands')

global.TextureCache = function(){}

function Color() {}
Color.prototype.setRGB = function(r, g, b) {
	this.r = r
	this.g = g
	this.b = b
}

global.THREE = {
	Vector3: function(){},
	Matrix4: function(){},
	Color: Color,
	Material: function(){},
	MeshBasicMaterial: function(){},
	PerspectiveCamera: function(){}
}
global.THREE.Matrix4.prototype.identity = function() {}

global.UndoManager = require('../../scripts/commands/undoManager.js')
global.GraphApi = require('../../scripts/graphApi.js')
global.Connection = require('../../scripts/connection.js').Connection
global.ConnectionUI = require('../../scripts/connection.js').ConnectionUI
global.ConnectionUI.prototype.resolve_slot_divs = function() {
	this.src_slot_div = $()
	this.dst_slot_div = $()
}
global.navigator = { userAgent: 'test' }

describe('Array function', function() {
	
	global.window = global

	var Core = require('../../scripts/core')
	
	function PluginManager() {
		EventEmitter.call(this)
		this.keybyid = {}
		var that = this
		process.nextTick(function() {
			that.emit('ready')
		})
	}
	PluginManager.prototype = Object.create(EventEmitter.prototype)
	PluginManager.prototype.create = function(id, node) {
		if (!E2.plugins[id])
			loadPlugin(id)
		var p = new E2.plugins[id](core, node)
		p.id = id
		return p
	}

	global.PluginManager = PluginManager

	global.Node.prototype.initialise = function(){}

	function TreeNode() {}
	TreeNode.prototype.add_child = function() { return new TreeNode() }
	global.TreeNode = TreeNode

	beforeEach(function() {
		global.window = { location: { pathname: 'test/test' } }
		var dummyCore = reset()
		E2.commands.graph = require('../../scripts/commands/graphEditCommands')

		require('../../scripts/variables')
		require('../../scripts/util')

		app = E2.app = new Application()
		app.updateCanvas = function() {}
		core = E2.core = new Core()
		core.renderer = dummyCore.renderer
		E2.app.player = { core: core }
		core.active_graph = new Graph(core, null, new TreeNode())
		core.root_graph = core.active_graph
		core.graphs = [ core.active_graph ]

		// throw any errors
		global.msg = function(txt) {
			if (/^ERROR/.test(txt))
				throw new Error(txt)
		}

	})

	it('isn`t run consecutively because always_update is off', function() {
		app.setupStoreListeners()

		var updates = 0

		var graph = E2.core.active_graph

		E2.app.instantiatePlugin('array_function')

		var afNode = E2.core.active_graph.nodes[0]
		afNode.plugin.update_state = function() {
			updates++
		}

		graph.update()
		graph.update()

		assert.equal(1, updates)
	})

})

	
