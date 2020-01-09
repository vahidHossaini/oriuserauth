module.exports = class authz{
  static getRole(roles)
  {
    var r=0
    if(roles && Array.isArray(roles))
        for(var a of roles)
        {
          r=r|a
        }
    return r
  }
  static setRoles(roles,name,parent)
  {
    var r=0
    if(roles && Array.isArray(roles))
        for(var a of roles)
        {
          if(a=='public' || a=='login')
          {
            if(a=='public')
            {
              parent.auth.push(name)
              return  
            }
            parent.auth.push({name:name,role:'login'})
            return
          }
          r=r|a
        }
    parent.auth.push({name:name,role:r})
    return 
  }
  static setAllRoles(roles,parent)
  {
     if(roles && Array.isArray(roles))
         for(var a in roles)
         {
           this.setRoles(roles[a],a,parent)
         }
  }
}