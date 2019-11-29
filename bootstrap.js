module.exports = class paymentBootstrap{
  constructor(config)
  {
    this.funcs=[
      {
          name:'isLogin',
          title1:'isLogin' 
      },
      {
          name:'login',
          title1:'login with username and password' ,
          captcha:true,
          inputs:[
          {
              name:'username',
              type:'string',
              nullable:false},
          {
              name:'password',
              type:'string',
              nullable:false}
          ]
      },
      {
          name:'register',
          title1:'register' ,
          captcha:true,
          inputs:[
          {
              name:'userData',
              type:'userpass',
              nullable:false}
          ]
      },
      {
          name:'saveUser',
          title:'ایجاد کاربر جدید' 
      },
      {
          name:'viewUser',
          title:'دیدن کاربران سیستم' 
      },
      {
          name:'logout',
          title1:'logout' 
      },
      {
          name:'changePassword',
          title1:'change password when user login' ,
          inputs:[
          {
              name:'oldPassword',
              type:'string',
              nullable:false},
          {
              name:'newPassword',
              type:'string',
              nullable:false}, 
          ]
      },
      {
          name:'activeUser',
          title:'فعال کردن کاربر' ,
          inputs:[
          {
              name:'userid',
              type:'string',
              nullable:false},
          {
              name:'active',
              type:'boolean',
              nullable:false}, 
          ]
      },
      {
          name:'forgetPassword',
          captcha:true,
          title1:'if user forgetpassword enter username or email then send code to reset password' ,
          inputs:[
          {
              name:'name',
              type:'string',
              nullable:false}
          ]
      },
      {
          name:'resetPassword',
          title1:'send code and new password to change old password' ,
          inputs:[
          {
              name:'code',
              type:'string',
              nullable:false},
          {
              name:'password',
              type:'string',
              nullable:false}
          ]
      },
      {
          name:'verify',
          title1:'verify email or phone number' ,
          inputs:[
          {
              name:'code',
              type:'string',
              nullable:false}
          ]
      },
      {
          name:'twoStep',
          title1:'ow step verification' ,
          inputs:[
          {
              name:'code',
              type:'string',
              nullable:false}
          ]
      },
    ]
    this.captcha=['login']
    this.auth=['login','register','forgetPassword','resetPassword','twoStep','verify',
              {name:'logout',role:'login',title:"title"},
              {name:'changePassword',role:'login'}, 
              {name:'isLogin',role:'login'}, 
              ]
    let sample={
        requirePhone:true,
        confirmEmail:true,
        confirmPhone:true,
        linkToSmsAuth:true,
        linkToOauth:true,
        superadmin:{
          username:'vahid',
          password:'123456'
        },
        twoStepVerificationRoles:[],
        defaultAuthorization:[],
        emailNotifyContext:'email',//notificationName
        emailNotifyTemplate:'confirmeEmail',//notification template name
        forgetPasswordTemplate:'forgetEmail',//notification template name
        notifyContext:'sms',//notificationName
        notifyTemplate:'confirmeSms',//notification template name
        twoStepEmail:false,
        twoStepSms:true,
        isActive:true
    }
  }
}