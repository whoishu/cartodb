var $ = require('jquery');
var cdb = require('cartodb.js');
cdb.admin = require('cdb.admin');
var LocalStorage = require('new_common/local_storage');
var HeaderView = require('new_dashboard/header_view');
var SupportView = require('new_dashboard/support_view');
var ContentControllerView = require('new_dashboard/content_controller_view');

module.exports = cdb.core.View.extend({

  events: {
    'click': '_onClick'
  },

  initialize: function() {
    this._initModels();
    this._initViews();
    this._initBindings();
  },

  _initBindings: function() {
    this.router.model.bind('change', this._onRouterChange, this);
    this.add_related_model(this.router.model);
  },

  _initModels: function() {
    // Why not have only one collection?
    this.collection =  new cdb.admin.Visualizations();

    this.user = this.options.user;
    this.router = this.options.router;
    this.localStorage = new LocalStorage();

    // Update order attribute to router model
    this.router.model.set('order', this.localStorage.get('dashboard.order'), { silent: true });
  },

  _onRouterChange: function(m, changes) {
    this._fetchCollection(m, changes);
  },

  _fetchCollection: function(m, changes) {
    var params = this.router.model.attributes;

    // Get order from localStorage if it is not defined or
    // come from other type (tables or visualizations)
    var order = this.localStorage.get("dashboard.order") || 'updated_at';

    // TODO: review, should collection params really be set here?
    this.collection.options.set({
      q:              params.q,
      page:           params.page || 1,
      tags:           params.tag,
      per_page:       this.collection[ "_" + ( params.content_type === "datasets" ? 'TABLES' : 'ITEMS') + '_PER_PAGE'],
      only_shared:    params.shared,
      exclude_shared: !params.shared,
      locked:         params.locked,
      only_liked:     params.liked,
      order:          order,
      type:           params.content_type === "datasets" ? 'table' : 'derived'
    });

    this.collection.fetch();
  },

  _initViews: function() {

    var headerView = new HeaderView({
      el:         this.$('#header'), //pre-rendered in DOM by Rails app
      model:      this.user,
      router:     this.router,
      localStorage: this.localStorage
    });
    headerView.render();

    this.controllerView = new ContentControllerView({
      el:           this.$('#content-controller'),
      user:         this.user,
      router:       this.router,
      collection:   this.collection,
      localStorage: this.localStorage
    });

    this.controllerView.render();

    var supportView = new SupportView({
      el: this.$('#support-banner'),
      user: this.user
    });

    supportView.render();
  },

  // In case user clicks out of any dialog "body" will fire
  // a closeDialogs event
  _onClick: function(e) {
    cdb.god.trigger("closeDialogs");
  }

});
