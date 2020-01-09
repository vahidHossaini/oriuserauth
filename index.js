var authz=require('./common/authz')
var general=require('./common/general')
var uuid=require('uuid')
module.exports = class paymentConfig
{
  constructor(config,dist)
  {
    this.config=config.statics
    this.context=this.config.context 
    this.bootstrap=require('./bootstrap.js')
    this.enums=require('./struct.js') 
    this.tempConfig=require('./config.js')
    
    this.defaultAuthz = authz.getRole(this.config.defaultAuthorization)
	if(this.config.twoStepVerificationRoles)
    this.twoRoles = authz.getRole(this.config.twoStepVerificationRoles)
  } 
  async login(msg,func,self){
    //Next Version
    //captcha 
    //block user 
    //block ip
    //alarm when login or lock or ....

    let dt=msg.data
    let user=null
    if(self.config.superadmin)
    {
        if(self.config.superadmin.username==dt.username && self.config.superadmin.password==dt.password)
            return func (null,{session:[{name:'userid',value:'1111'},{name:'type',value:'userAuth'},{name:'roles',value:0},{name:'isAdmin',value:true},{name:'username',value:dt.username}],i:true}) 
    }
    try{ 
      user=await global.db.SearchOne(self.context,'userAuth',{where:{$and:[{username:dt.username},{password:dt.password}]}})
    }catch(exp){
      return func({m:'auth017'})
    }
    if(!user)
      return func({m:'auth001'})
    if(user.blacklist)
      return func({m:'auth002'})
    if(self.config.confirmEmail && user.emailCode)
      return func({m:'auth003'})
    if(self.config.confirmPhone && user.phoneCode)
      return func({m:'auth004'})
    if(!user.active)
      return func({m:'auth005'})
	
    let acc=await global.acc.get(user.userid)
    let roles =0
	// console.log('--->1 ',user.roles)
    if(!user.roles)
    {
	// console.log('--->2 ',user.roles)
		try{
		  await global.acc.create(user.userid,self.defaultAuthz)    
		  roles= self.defaultAuthz
			
		}catch(exp)
		{
			console.log(exp)
			return func({m:'none'})
		}
    }
    else
    {
	// console.log('--->3 ',acc.roles)
      roles=user.roles
    }
    let istwostep=false
    if(self.config.twoStepVerificationRoles)
    {
      for(var a of self.config.twoStepVerificationRoles)
      {
        if(roles&a)
        {
          istwostep=true
          break
        }
      }
    }
    if(!istwostep && !user.twoStep)
      return func (null,{session:[{name:'userid',value:user.userid},{name:'type',value:'userAuth'},{name:'roles',value:roles},{name:'username',value:dt.username}],i:true}) 
    var code= general.randomNumber(10000,99999)
    if(self.config.twoStepEmail)
    { 
      global.nt.Send(c.emailNotifyContext,c.config.emailNotifyTemplate,{code:code},()=>{})
    }
    return func (null,{session:[
	
      {name:'twoStep',value:code},
      {name:'type',value:'userAuth'},
	  {name:'roles',value:roles},
      {name:'twouserid',value:user.userid},
	  {name:'username',value:dt.username}
    ],twoStep:true,
    code:code//for test
  }) 
    //NEXT
  }
  async register(msg,func,self){
    let dt=msg.data.userData
    let session=msg.session
    let c=self.config
    let u=null
    try{u=await global.db.SearchOne(self.context,'userAuth',{where:{username:dt.username}})}catch(exp){}
    if(u)
      return func({m:'auth006'})
    dt.active=c.isActive
    //check phone validation
    if(c.requirePhone && !dt.phone)
      return func({m:'auth007'}) 
      console.log('XXX : ',c.confirmEmail) 
    if(c.confirmEmail)
    {
      //check oauth
      try{
          dt.emailCode=general.randomString(20)
		  if(global.nt)
          global.nt.Send(c.emailNotifyContext,c.emailNotifyTemplate,
            {
              username:dt.username,
              code:dt.emailCode,
              to:dt.email
            },(e,d)=>{
          
        })
      
      }catch(exp){
        
        console.log('XXX2 : ',exp) 
      }
    }
    if(c.confirmPhone)
    {
      //check sms
      try{
      dt.phoneCode=general.randomNumber(1000,9999).toString()
      global.nt.Send(c.notifyContext,c.config.notifyTemplate,{code:dt.phoneCode},()=>{})}catch(exp){}
    }
    if(session && session.userid)
    { 
      dt.userid=session.userid
      var dts= await global.acc.get(session.userid)
      var rls=dts.data.roles
      for(var a of self.context.defaultAuthorization)
      {
        if((a&rls) == 0)
          rls=a|rls
      }
      await global.acc.update(session.userid,'roles',rls)
    }
    else{
      dt.userid = uuid.v4()
    }
    if(!session  || !session.userid)
	{
		dt.roles=self.defaultAuthz
	}
    try{await global.db.Save(self.context,'userAuth',['username'],dt)}catch(exp){
		console.log(exp,self.context)
      return func({m:'auth013'})
    }
    if(!session  || !session.userid)
    { 
		
      await global.acc.create(dt.userid,self.defaultAuthz)
    }
    return func(null,{isDone:true})
  }
  async forgetPassword(msg,func,self){
    var dt=msg.data
    var user=await global.db.SearchOne(self.context,'userAuth',{where:{email:dt.name}})
    if(!user)
      return func({m:'auth008'})
      
    let c=self.config
    user.forgetCode=general.randomString(20)
    await global.nt.Send(c.emailNotifyContext,c.forgetPasswordTemplate,{code:user.forgetCode},()=>{})
    try{await global.db.Save(self.context,'userAuth',['id'],user)}catch(exp){return func({m:'auth010'})}
    return func(null,{i:true})
  }
  async resetPassword(msg,func,self){
    var dt=msg.data
    var user= await  global.db.SearchOne(self.context,'userAuth',{where:{forgetCode:dt.code}})
    if(!user)
      return func({m:'auth009'})
    user.password=dt.password
    user.forgetCode=''
    try{await global.db.Save(self.context,'userAuth',['id'],user)}catch(exp){return func({m:'010'})}    
    return func(null,{i:true})
  }
  twoStep(msg,func,self){
    var dt=msg.data
    var session=msg.session
    if(!session.twoStep || session.twoStep!=dt.code)
      return func({m:'auth011'})

    return func (null,{session:[
      {name:'twoStep',value:null}, 
      {name:'twouserid',value:null},
      {name:'userid',value:session.twouserid},
    ],twoStep:true})
  }
  logout(msg,func,self){
      console.log('----->',msg.session)
    return func (null,{session:[{name:'userid',value:null},{name:'isAdmin',value:null},{name:'type',value:null},{name:'roles',value:null}],i:true}) 
  }
  async changePassword(msg,func,self){
    var dt=msg.data
    var session=msg.session
    var user=await global.db.SearchOne(self.context,'userAuth',{where:{userid:session.userid}})
    if(!user)
      return func({m:'auth012'})
    if(user.password!=dt.oldPassword)  
      return func({m:'auth020'})
    user.password=dt.newPassword  
    try{await global.db.Save(self.context,'userAuth',['id'],user)}catch(exp){return func({m:'auth010'})}    
    return func(null,{i:true})
  }
  async verify(msg,func,self){
    //Next Version 
    //If send wrong code Then change code
    var dt=msg.data
    var user=await global.db.SearchOne(self.context,'userAuth',{where:{$or:[{phoneCode:dt.code},{emailCode:dt.code}]}})
    if(!user)
      return func({m:'auth014'})
    if(user.emailCode==dt.code)
      user.emailCode=''
    else
      user.phoneCode=''
    try{await global.db.Save(self.context,'userAuth',['_id'],user)}catch(exp){console.log(exp);return func({m:'auth010'})}     
    return func(null,{i:true})
  }
  isLogin(msg,func,self)
  {
	  console.log('********************',msg)
    return func(null,{i:true,s:msg.session})
  }
  
	async saveUser(msg,func,self)
	{
		var dt=msg.data;
		var saveobj={}
		// console.log('----------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>--------')
		// console.log(dt)
		if(dt.userid)
		{
			saveobj.userid = dt.userid;
			
		}
		else
		{
			saveobj.userid=uuid.v4();
			saveobj.roles=0;
			saveobj.username=dt.username;
			if(!dt.username)
			{
				return func({m:'auth017'}) 
			}
		}
		if(dt.roles)
			saveobj.roles=dt.roles;
		if(dt.password!=null)
		{
			saveobj.password=dt.password;
		}
		var action=await global.db.Save(self.context,'userAuth',["userid"],saveobj );
		return func(null,action) ;
	}
	async activeUser(msg,func,self)
	{
		var dt=msg.data;
		var action=await global.db.Save(self.context,'userAuth',["userid"],{active:dt.active,userid:dt.userid} );
		return func(null,action) 
	}
	async viewUser(msg,func,self)
	{
		var dt=msg.data;
		var users=await global.db.Search(self.context,'userAuth',{select:["userid","username","active","roles","confirmEmail","confirmPhone"]},dt );
		return func(null,users)
	}
	
}