package com.huawei.showcase.model;

public class SessionModel
{
 
  private String farmId;
  private String sessionInfoId;
  private String sessionStamp;
  private String sessionType;
  private String protocolType;
  private String osSessionId;
  private String loginUser;
  private String machineSid;
  private String machineName;
  private String failedReason;
  private Integer failedCode;
  private String preConnTime;
  private String startTime;
  private String endTime;
  private String clientMac;
  private String clientName;
  private String clientIp;
  private String clientVersion;
  private String agentVersion;
  private String clientType;
  private String vmIp;
  private String appName;
  private String lastStatusChangeTime;
  private String statusContinueTime;
  private String sessionState;
  private String desktopGroupId;
  private String groupId;

  public String generateSessionStamp()
  {
    StringBuilder strBuilder = new StringBuilder();
    strBuilder.append(this.machineSid + "-");
    strBuilder.append(this.loginUser + "-");
    strBuilder.append(this.protocolType + "-");
    strBuilder.append(this.sessionType);
    return strBuilder.toString();
  }

  public String toString()
  {
    return "SessionInfo [sessionInfoId=" + this.sessionInfoId + ", sessionType=" + this.sessionType + ", osSessionId=" + 
      this.osSessionId + ", loginUser=" + this.loginUser + ", appName=" + this.appName + ", sessionState=" + this.sessionState + 
      ", groupId=" + this.groupId + "]";
  }

  public String getMachineSid()
  {
    return this.machineSid;
  }

  public void setMachineSid(String machineSid)
  {
    this.machineSid = machineSid;
  }

  public String getMachineName()
  {
    return this.machineName;
  }

  public void setMachineName(String machineName)
  {
    this.machineName = machineName;
  }

  public String getFailedReason()
  {
    return this.failedReason;
  }

  public void setFailedReason(String failedReason)
  {
    this.failedReason = failedReason;
  }

  public Integer getFailedCode()
  {
    return this.failedCode;
  }

  public void setFailedCode(Integer failedCode)
  {
    this.failedCode = failedCode;
  }

  public String getPreConnTime()
  {
    return this.preConnTime;
  }

  public void setPreConnTime(String preConnTime)
  {
    this.preConnTime = preConnTime;
  }

  public String getStartTime()
  {
    return this.startTime;
  }

  public void setStartTime(String startTime)
  {
    this.startTime = startTime;
  }

  public String getEndTime()
  {
    return this.endTime;
  }

  public void setEndTime(String endTime)
  {
    this.endTime = endTime;
  }

  public String getClientMac()
  {
    return this.clientMac;
  }

  public void setClientMac(String clientMac)
  {
    this.clientMac = clientMac;
  }

  public String getClientName()
  {
    return this.clientName;
  }

  public void setClientName(String clientName)
  {
    this.clientName = clientName;
  }

  public String getClientIp()
  {
    return this.clientIp;
  }

  public void setClientIp(String clientIp)
  {
    this.clientIp = clientIp;
  }

  public String getClientVersion()
  {
    return this.clientVersion;
  }

  public void setClientVersion(String clientVersion)
  {
    this.clientVersion = clientVersion;
  }

  public String getAgentVersion()
  {
    return this.agentVersion;
  }

  public void setAgentVersion(String agentVersion)
  {
    this.agentVersion = agentVersion;
  }

  public String getClientType()
  {
    return this.clientType;
  }

  public void setClientType(String clientType)
  {
    this.clientType = clientType;
  }

  public String getVmIp()
  {
    return this.vmIp;
  }

  public void setVmIp(String vmIp)
  {
    this.vmIp = vmIp;
  }

  public String getDesktopGroupId()
  {
    return this.desktopGroupId;
  }

  public void setDesktopGroupId(String desktopGroupId)
  {
    this.desktopGroupId = desktopGroupId;
  }

  public String getAppName()
  {
    return this.appName;
  }

  public void setAppName(String appName)
  {
    this.appName = appName;
  }

  public String getLastStatusChangeTime()
  {
    return this.lastStatusChangeTime;
  }

  public void setLastStatusChangeTime(String lastStatusChangeTime)
  {
    this.lastStatusChangeTime = lastStatusChangeTime;
  }

  public String getLoginUser()
  {
    return this.loginUser;
  }

  public void setLoginUser(String loginUser)
  {
    this.loginUser = loginUser;
  }

  public String getSessionType()
  {
    return this.sessionType;
  }

  public void setSessionType(String sessionType)
  {
    this.sessionType = sessionType;
  }

  public String getStatusContinueTime()
  {
    return this.statusContinueTime;
  }

  public void setStatusContinueTime(String statusContinueTime)
  {
    this.statusContinueTime = statusContinueTime;
  }

  public String getSessionState()
  {
    return this.sessionState;
  }

  public void setSessionState(String sessionState)
  {
    this.sessionState = sessionState;
  }

  public String getSessionInfoId()
  {
    return this.sessionInfoId;
  }

  public void setSessionInfoId(String sessionInfoId)
  {
    this.sessionInfoId = sessionInfoId;
  }

  public String getOsSessionId()
  {
    return this.osSessionId;
  }

  public void setOsSessionId(String osSessionId)
  {
    this.osSessionId = osSessionId;
  }

  public String getProtocolType()
  {
    return this.protocolType;
  }

  public void setProtocolType(String protocolType)
  {
    this.protocolType = protocolType;
  }

  public String getSessionStamp()
  {
    return this.sessionStamp;
  }

  public void setSessionStamp(String sessionStamp)
  {
    this.sessionStamp = sessionStamp;
  }

  public String getFarmId()
  {
    return this.farmId;
  }

  public void setFarmId(String farmId)
  {
    this.farmId = farmId;
  }

  public String getGroupId()
  {
    return this.groupId;
  }

  public void setGroupId(String groupId)
  {
    this.groupId = groupId;
  }
}