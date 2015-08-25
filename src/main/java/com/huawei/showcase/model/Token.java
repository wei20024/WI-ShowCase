package com.huawei.showcase.model;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

public class Token
  implements Serializable
{
  private static final long serialVersionUID = -8501347916923280557L;
  private String tokenId;
  private long startTime;
  private String authType = "user";
  private String tokenAuthType;
  private UserGroupInfo userInfo;
  private Map<String, VmModel> vmInfos;
  private String language;
  private Map<String, AppModel> appInfos;
  private Map<String, SessionModel> sessionInfos;
  private String loginExtendInfo;
  private String extendData;
  private List<String> extendList;
  private String currentIp;
  private String authTokenId;

  public String getLanguage()
  {
    return this.language;
  }

  public void setLanguage(String language)
  {
    this.language = language;
  }

  public long getStartTime()
  {
    return this.startTime;
  }

  public void setStartTime(long startTime)
  {
    this.startTime = startTime;
  }

  public String getTokenId()
  {
    return this.tokenId;
  }

  public void setTokenId(String tokenId)
  {
    this.tokenId = tokenId;
  }

  public String toString()
  {
    StringBuilder builder = new StringBuilder();
    builder.append("Token:startTime=" + this.startTime);
    builder.append(",tokenAuthType=" + this.tokenAuthType);
    builder.append(",currentIp=" + this.currentIp);
    builder.append(",vmInfos=" + this.vmInfos);
    return builder.toString();
  }

  public UserGroupInfo getUserInfo()
  {
    return this.userInfo;
  }

  public void setUserInfo(UserGroupInfo userInfo)
  {
    this.userInfo = userInfo;
  }

  public String getTokenAuthType()
  {
    return this.tokenAuthType;
  }

  public void setTokenAuthType(String tokenAuthType)
  {
    this.tokenAuthType = tokenAuthType;
  }

  public Map<String, VmModel> getVmInfos()
  {
    return this.vmInfos;
  }

  public void setVmInfos(Map<String, VmModel> vmInfos)
  {
    this.vmInfos = vmInfos;
  }

  public Map<String, AppModel> getAppInfos()
  {
    return this.appInfos;
  }

  public void setAppInfos(Map<String, AppModel> appInfos)
  {
    this.appInfos = appInfos;
  }

  public Map<String, SessionModel> getSessionInfos()
  {
    return this.sessionInfos;
  }

  public void setSessionInfos(Map<String, SessionModel> sessionInfos)
  {
    this.sessionInfos = sessionInfos;
  }

  public String getLoginExtendInfo()
  {
    return this.loginExtendInfo;
  }

  public void setLoginExtendInfo(String loginExtendInfo)
  {
    this.loginExtendInfo = loginExtendInfo;
  }

  public String getCurrentIp()
  {
    return this.currentIp;
  }

  public void setCurrentIp(String currentIp)
  {
    this.currentIp = currentIp;
  }

  public String getAuthTokenId()
  {
    return this.authTokenId;
  }

  public void setAuthTokenId(String authTokenId)
  {
    this.authTokenId = authTokenId;
  }

  public String getExtendData()
  {
    return this.extendData;
  }

  public void setExtendData(String extendData)
  {
    this.extendData = extendData;
  }

  public List<String> getExtendList()
  {
    return this.extendList;
  }

  public void setExtendList(List<String> extendList)
  {
    this.extendList = extendList;
  }

  public String getAuthType()
  {
    return this.authType;
  }

  public void setAuthType(String authType)
  {
    this.authType = authType;
  }
}