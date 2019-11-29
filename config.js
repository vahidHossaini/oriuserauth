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
      return []
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
          requirePhone:true,
          confirmEmail:true,
          confirmPhone:true,
          linkToSmsAuth:true,
          linkToOauth:true,
          superadmin:{
            username:'vahid',
            password:'123456'
          },
          twoStepVerificationRoles:[roles.userAuth],
          defaultAuthorization:[roles.userAuth],
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