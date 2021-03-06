/**
 *  Decide what support block app should show
 *
 */

module.exports = cdb.core.View.extend({

  initialize: function() {
    this.user = this.options.user;
    this.template = cdb.templates.getTemplate('new_dashboard/views/support_banner');
  },

  render: function() {
    this.$el.html(
      this.template({
        userType: this._getUserType()
      })
    )
    return this;
  },

  _getUserType: function() {
    var accountType = this.user.get('account_type').toLowerCase();

    // Get user type
    if (this.user.isInsideOrg()) {
      return 'org';
    } else if (accountType === "internal" || accountType === "partner" || accountType === "ambassador") {
      return 'internal'
    } else if (accountType !== "free") {
      return 'client';
    } else {
      return 'regular'
    }
  }
  
});