
# organizations

this document contains some notes on how to work with backbone models realted to organization

## models related to organization

- cdb.admin.User: it already existed, but it takes more importance
- cdb.admin.Organization: this represents an organization
- cdb.admin.Permission: permission object, contains the information to know about the ownership and
  permission list (called ``acl``) of an object. See https://github.com/Vizzuality/cartodb-management/wiki/multiuser-REST-API#permissions-object

## changes 

- ``User`` model has a organization attribute. Each user is **always** inside a organization, so
  this be always filled. When the organization contains only an user the application behavior is the
  same than we have currently (CartoDB 2.0)

- ``Visualization`` object contains a ``permission`` attribute (instance of ``cdb.admin.Permission``)


## how to use them

- add read permissions to a table

```
canonical_visualization.permission.setPermission(user_model, 'r').save();
```

- add read/write permissions to a table
```
canonical_visualization.permission.setPermission(user_model, 'rw').save();
```

- how to know if the organization for the current user is single or multiuser
```
user.isInsideOrg()
```

- know what users have access to a visualization

```
vis.permission.acl.each(function(aclItem) {
    console.log("user " + aclItem.get('user').get('username') + " permission: " + aclItem.get('type'))
})
```

- know the owner of a visualization
```
// owner is a cdb.admin.User instance
vis.permission.owner.get('username')
```

