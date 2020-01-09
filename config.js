module.exports = class paymentConfig
{
    constructor(config)
    { 
         
    }
    getPackages()
    {
       return []
    }
    
    getVersionedPackages()
    { 
      return [{name:"uuid"}]
    }

    geInternaltPackages()
    {
       return ['account']
    }


    getVersion()
    {
      return '0.0.1'
    }
    getDefaultConfig()
    {
      return {
          context:'default',
          requirePhone:false,
          confirmEmail:false,
          confirmPhone:false,
          linkToSmsAuth:false,
          linkToOauth:false,
          superadmin:{
            username:'vahid',
            password:'123456'
          },
          //twoStepVerificationRoles:[roles.userAuth],
          //defaultAuthorization:[roles.userAuth],
          emailNotifyContext:'email',//notificationName
          emailNotifyTemplate:'confirmeEmail',//notification template name
          forgetPasswordTemplate:'forgetEmail',//notification template name
          notifyContext:'sms',//notificationName
          notifyTemplate:'confirmeSms',//notification template name
          twoStepEmail:false,
          twoStepSms:false,
          isActive:true

      }
    }
}