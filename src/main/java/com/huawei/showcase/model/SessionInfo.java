package com.huawei.showcase.model;

import com.huawei.showcase.common.util.CommonUtils;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class SessionInfo
{
  private String userId;
  private String farmId = "default";
  private String password;
  private String currentIp;
  private Date createTime;
  private Map<String, String> ipTokenMap = new HashMap<String, String>();

  public boolean equals(Object obj)
  {
    if (obj == null)
    {
      return false;
    }
    if ((obj instanceof SessionInfo))
    {
      return this.farmId.equals(((SessionInfo)obj).getFarmId());
    }
    return false;
  }

  public int hashCode()
  {
    return this.farmId.hashCode();
  }

  public String getId()
  {
    return CommonUtils.getUserFarmId(this.userId, this.farmId);
  }

  public String getTokenId(String ip)
  {
    return (String)this.ipTokenMap.get(ip);
  }

  public String getPassword()
  {
    return this.password;
  }

  public void setPassword(String password)
  {
    this.password = password;
  }

  public String getFarmId()
  {
    return this.farmId;
  }

  public void setFarmId(String farmId)
  {
    this.farmId = farmId;
  }

  public Date getCreateTime()
  {
    return this.createTime;
  }

  public void setCreateTime(Date createTime)
  {
    this.createTime = createTime;
  }

  public String getUserId()
  {
    return this.userId;
  }

  public void setUserId(String userId)
  {
    this.userId = userId;
  }

  public Map<String, String> getIpTokenMap()
  {
    return this.ipTokenMap;
  }

  public void setIpTokenMap(Map<String, String> ipTokenMap)
  {
    this.ipTokenMap = ipTokenMap;
  }

  public String getCurrentIp()
  {
    return this.currentIp;
  }

  public void setCurrentIp(String currentIp)
  {
    this.currentIp = currentIp;
  }
}