package com.huawei.showcase.model.request;

import javax.xml.bind.annotation.XmlRootElement;

import com.huawei.showcase.common.util.CommonUtils;

@XmlRootElement(name="FavoriteAppReq")
public class FavoriteAppReq extends UnsCommonReq
{
  private static final long serialVersionUID = -3846573692132704970L;
  private String userName;
  private String domain;
  private String appId;
  private Integer favoriteFlag;
  private String farmId;

  public boolean isValid()
  {
    boolean checkResult = true;

    if (CommonUtils.checkAllStringNull(new String[] { this.userName, this.appId, this.farmId }))
    {
      checkResult = false;
      return checkResult;
    }

    if ((this.favoriteFlag == null) || ((this.favoriteFlag.intValue() != 0) && (this.favoriteFlag.intValue() != 1)))
    {
      checkResult = false;
      return checkResult;
    }

    return checkResult;
  }

  public String toString()
  {
    StringBuilder sb = new StringBuilder();
    sb.append("userName = " + this.userName + ", ");
    sb.append("domain = " + this.domain + ", ");
    sb.append("favoriteFlag = " + this.favoriteFlag + ", ");
    sb.append("farmId = " + this.farmId + ", ");
    sb.append("appId = " + this.appId + ". ");

    return sb.toString();
  }

  public String getUserName()
  {
    return this.userName;
  }

  public void setUserName(String userName)
  {
    this.userName = userName;
  }

  public String getDomain()
  {
    return this.domain;
  }

  public void setDomain(String domain)
  {
    this.domain = domain;
  }

  public String getAppId()
  {
    return this.appId;
  }

  public void setAppId(String appId)
  {
    this.appId = appId;
  }

  public Integer getFavoriteFlag()
  {
    return this.favoriteFlag;
  }

  public void setFavoriteFlag(Integer favoriteFlag)
  {
    this.favoriteFlag = favoriteFlag;
  }

  public String getFarmId()
  {
    return this.farmId;
  }

  public void setFarmId(String farmId)
  {
    this.farmId = farmId;
  }
}