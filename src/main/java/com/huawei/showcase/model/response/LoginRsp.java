package com.huawei.showcase.model.response;

import com.huawei.showcase.model.CurrentInfo;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

@XmlRootElement(name="LoginRsp")
@XmlAccessorType(XmlAccessType.FIELD)
public class LoginRsp extends CustomRsp
{
  private static final long serialVersionUID = 777476630517176525L;

  @XmlElement(name="loginState")
  private int loginState;

  @XmlElement(name="tokenId")
  private String tokenId;

  @XmlElement(name="token")
  private String token;

  @XmlElement(name="currentInfo")
  private CurrentInfo currentInfo;

  @XmlElement(name="loginType")
  private String loginType;

  @XmlElement(name="extentInfo")
  private String extentInfo;

  @XmlElement(name="userName")
  private String userName;
  private String userId;
  private String WIId; //用于标示WI，WiId，与Req的GroupId对应
  private String currentIp;//WiIP


  @XmlTransient
  private boolean retry;
  public int getLoginState()
  {
    return this.loginState;
  }

  public void setLoginState(int loginState)
  {
    this.loginState = loginState;
  }

  public String getTokenId()
  {
    return this.tokenId;
  }

  public void setTokenId(String tokenId)
  {
    this.tokenId = tokenId;
  }

  public String getToken()
  {
    return this.token;
  }

  public void setToken(String token)
  {
    this.token = token;
  }

  public CurrentInfo getCurrentInfo()
  {
    return this.currentInfo;
  }

  public void setCurrentInfo(CurrentInfo currentInfo)
  {
    this.currentInfo = currentInfo;
  }

  public String getLoginType()
  {
    return this.loginType;
  }

  public void setLoginType(String loginType)
  {
    this.loginType = loginType;
  }

  public String getExtentInfo()
  {
    return this.extentInfo;
  }

  public void setExtentInfo(String extentInfo)
  {
    this.extentInfo = extentInfo;
  }

  public String getUserId()
  {
    return this.userId;
  }

  public void setUserId(String userId)
  {
    this.userId = userId;
  }

  public String getWIId()
  {
    return this.WIId;
  }

  public void setWIId(String WIId)
  {
    this.WIId = WIId;
  }

  public String getCurrentIp()
  {
    return this.currentIp;
  }

  public void setCurrentIp(String currentIp)
  {
    this.currentIp = currentIp;
  }
    
  public boolean isRetry()
  {
	return this.retry;
  }
			
  public void setRetry(boolean retry)
  {
    this.retry = retry;
  }

  public String getUserName()
  {
    return this.userName;
  }

  public void setUserName(String userName)
  {
    this.userName = userName;
  }
}