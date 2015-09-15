package com.huawei.showcase.common.enumcode;

public enum ResultCode
{
  SUCCESS(
    0, "success"), 

  FAIL(
    -1, "fail"), 
  VM_NOT_EXIST_IN_AD(
    410100, "the vm is not in domain"), 

  WRONG_PASSWORD(
    410101, "Password is increct,please confirm and then input"), 

  USER_NOT_EXISTS(
    410102, "The user is not exist, please confirm and then input"), 

  ACCOUNT_REVOKED(
    410103, "The user account is locked,please try again later"), 

  UNKNOWED_REASON(
    410104, "logon failed,unknown reason"), 



  EMERGENCY_LOGON(
    410106, "In emergency mode, no operating authority"), 

  AD_NOT_INIT(
    410107, "AD moudle is not ready"), 

  WRONG_DOMAIN_NAME(
    410108, "domain user is error"), 

  FIND_USER_EXCEPTION_IN_AD(
    410109, "search the user in AD is exception"), 

  UESR_LOGIN_FAILED(
    410110, "decode error"), 

  UESR_ACCOUNT_EXPIRED(
    410111, "account is expired"), 

  UESR_PASSWORD_EXPIRED(
    410112, "password is expired"), 

  DESKTOP_PREPARING(
    400200, "desktop is preparing"), 

  DESKLOGIN_PRE_RETURN_NULL(
    400201), 

  DESKLOGIN_VM_ALREADY_LOGIN_BY_OTHER_USER(
    400202), 

  DESKLOGIN_VM_DOESNOT_EXIT(
    400203), 

  DESKLOGIN_VM_STATUS_EXCEPTION(
    400205), 

  DESKLOGIN_DG_NOT_VALID_VM(
    400207), 

  DESKLOGIN_QUERY_VNCINFO_ERROR(
    400250), 

  DESKLOGIN_START_VM_ERROR(
    400251), 

  DESKLOGIN_LIC_OVER(
    400260), 

  DESKLOGIN_GET_LICINFO_ERROR(
    400261), 

  DESKLOGIN_CALL_LIC_ERROR(
    400262), 

  DESKLOGIN_LIC_INVALID(
    400263), 

  DESKLOGIN_INTERFACE_ERROR(
    400213), 

  EMERGENCY_LOGGON_FAILED(
    28104013), 

  DESKLOGIN_BY_OTHER_RDP(
    28104006), 

  DESKLOGIN_BY_OTHER_HDP(
    28104009), 

  USER_NOT_BINDING_TO_THE_TC(
    60021, "the user is not binding to the TC"), 

  USER_NOT_BINDING_TO_TC(
    60022, "the user is not binding to the TC"), 

  REQUEST_INVALID(
    410200, "request parameter is invalid."), 


  SESSION_INVALID(
    410202, "session is invalid."), 

  RESOURCE_INVALID(
    410203, "the vm is invalid."), 

  DESK_PREPARING(
    410204, "desktop is preparing"), 

  DESKLOGIN_PRE_RETURN_FAIL(
    410205), 

  DESKLOGIN_VM_ALREADY_LOGINED_BY_OTHER_USER(
    410206), 

  DESKLOGIN_VM_NOT_EXIT(
    410207), 

  DESKLOGIN_VM_STATUS_ABNORMAL(
    410208), 

  DESKLOGIN_NOT_VALID_VM_IN_DG(
    410209), 

  DESKLOGIN_PRE_CONNECTION_TIMEOUT(
    410210), 

  DESKLOGIN_GET_VNCINFO_ERROR(
    410211), 

  DESKLOGIN_RUN_VM_ERROR(
    410212), 

  DESKLOGIN_LICEN_OVER(
    410213), 

  DESKLOGIN_GET_LICENINFO_ERROR(
    410214), 

  DESKLOGIN_CALL_LICEN_ERROR(
    410215), 

  DESKLOGIN_LIC_EXPIRES(
    410216), 

  DESKLOGIN_LIC_SERVICES_EXCEPTION(
    410217), 

  VNCGATE_INVALID(
    410218, "system have not VNCGateway."), 

  SID_IN_SESSION_INVALID(
    410219, "the user donot have this vm."), 


  FARM_INVALID(
    410222, "farmid of vm and login.properties is not same."), 

  NOT_VALID_LICENSE(
    420014), 

  GET_DYNAMIC_CODE_SUCCESS(
    410224), 

  GET_DYNAMIC_CODE_FAIL(
    410225), 

  RADIUS_SERVICE_EXCEPTION(
    410226), 

  CHECK_DYNAMIC_CODE_FAIL(
    410227), 

  INIT_DYNAMIC_CODE_FAIL(
    410228), 

  DYNAMIC_CODE_NULL(
    410229), 
  USER_PASSWORD_INVALID(
    410230, "the username or password is error"), 

  OTHER_USER_LOGINED(
    410231, "The other user is logon in other tab"), 

  USER_LOCK(
    410232, "the user is locked"), 

  UNKNOW_REASON(
    410233, "unknown error"), 

  AD_UNREADY(
    410234, "AD moudle is not ready or search user is exception"), 

  PASSWORD_WILL_INVALIDATION(
    410236, "the user password will be expired"), 

  PASSWORD_INVALIDATIONED(
    410237, "the user password is expired"), 

  ACCOUNT_INVALIDATIONED(
    410238, "the user accout is expired"), 

  PARAMETER_INVALID(
    410239, "parameter error"), 

  LOGIN_INVALID(
    410240, "logon failure"), 

  USER_NO_EXIST(
    410241, "the username or password is error"), 

  CERREVOKE(
    410300, "certificate_revoked"), 

  CERNOSIGN(
    410301, "certificate_no_signed"), 

  CERINVALIDKEY(
    410302, "invalid_publickey"), 

  CERNOSUCHALGORITHM(
    410303, "no_such_algorithm"), 

  CERSIGNATURE(
    410304, "signature_invalid"), 

  CERCERTIFICATEEXPIRED(
    410305, "certificate_expired"), 

  CERCERTIFICATENOTVALID(
    410306, "certificate_not_yet_valid"), 

  CEROTHEREXCEPTION(
    410307, "other_exception"), 

  CER_SSO_PARA_NULL(
    410308, "client_auth_para_null"), 

  CER_USRENAME_NULL(
    410309, "username_of_cer_null"), 

  CER_REVOKE_STATE_UNKNOW(
    410310, "certificate_revoke_state_unknown"), 

  CER_NO_CERCERTIFICATE(
    410311, "no certificate"), 

  CER_USERNAME_NOCORRECT(
    410312, "certificate username no correct"), 
  REST_AUTH_FAIL(
    410400), 

  REST_TOKEN_TIMEOUT(
    410401), 

  REST_USER_OR_PASS_NULL(
    410402), 

  REST_USER_OR_PASS_OR_TOKEN_NULL(
    410403), 

  REST_METHOD_NOT_POST(
    410404), 

  REST_PATH_NOT_LOGIN(
    410405), 

  REST_PORT_INVALID(
    410406), 

  REST_GET_USERINFO_FAIL(
    410407), 

  API_LOGIN_TYPE_ERROR(
    410410), 
  PROPPARAMETER_INVALID(
    410501, "parameter is null"), 

  WRITEFILECODE_INVALID(
    410502, "write file is some error"), 

  OPERATE_SUCCESS(
    200, "operate success"), 

  LOGINTYPE_INVALID(
    410501, "no login type"), 

  USERNAME_UNNORMAL(
    410501, "get username is null"), 

  COMMON_WRONG_OLD_PWD(
    10025, "The userName or password error."), 

  COMMON_NOT_MEET_PWD_POLICY(
    10026, "new password not satisfy for policy"), 

  COMMON_ACCOUNT_LOCKED_OUT(
    10027, "acconut is locked"), 

  COMMON_MDY_PWD_FAILED(
    10028, "repair pwd meet some error.pls check AD"), 

  COMMON_PWD_INVOKEINTERFACE_FAILED(
    10029, "invoke ITA interface meet some error."), 

  COMMON_PWD_INVOKEINTERFACE_NULL(
    10030, "changePWD prameters have some null ."), 

  COMMON_PWD_CHANGE_TIMEOUT(
    10031, "Change password timeout"), 

  TOKEN_NOT_EXIST(
    410409), 
  LOGIN_IN_EMERGENCY(
    410408), 

  WI_INVALID(
    410201, "WI error."), 

  UESR_PASSWORD_EXPIRED_C10(
    27000011, "password is expired"), 
  DESK_PREPARING_C10(
    1204, "desktop is preparing"), 

  REST_USER_LOGIN_EMERGENCY_C10(
    300208), 
  LOGIN_IN_EMERGENCY_C10(
    300300), 

  TOKEN_NOT_EXIST_R2(
    300301), 
  WI_PASS_EXPIRED(
    10000103, "PASS_EXPIRED."), 

  SYN_USER_DATA_FAIL(
    410600), 
  OPERATE_DB_ERROR(
    410601), 
  COMPONENT_ERROR(
    410602);

  private int code;
  private String message;

  private ResultCode(int code)
  {
    this.code = code;
  }

  private ResultCode(int code, String message)
  {
    this.code = code;
    this.message = message;
  }

  public int getCode()
  {
    return this.code;
  }

  public String getMessage()
  {
    return this.message;
  }
}