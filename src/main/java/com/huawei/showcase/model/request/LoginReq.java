package com.huawei.showcase.model.request;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.huawei.showcase.common.util.CommonUtils;

@XmlRootElement(name="LoginReq")
@XmlAccessorType(XmlAccessType.FIELD)
public class LoginReq extends CustomReq
{
  private static final long serialVersionUID = -8501347916923280698L;

  
  
  @XmlElement(name="username")
  private String userName;

  @XmlElement(name="password")
  private String password;
 
  @XmlElement(name="domain")
  private String domain;


  
  @XmlElement(name="authType")
  private String authType = "user";

  public String toString()
  {
    return "username:" + this.userName;
  }


  public String getDomain()
  {
    return this.domain;
  }

  public void setDomain(String domain)
  {
    this.domain = domain;
  }


  public String getUserName()
  {
    return this.userName;
  }

  public void setUserName(String userName)
  {
    this.userName = userName;
  }

  public String getPassword()
  {
    return this.password;
  }

  public void setPassword(String password)
  {
    this.password = password;
  }

  public String getAuthType()
  {
    if (CommonUtils.checkAllStringNull(new String[] { this.authType }))
    {
      this.authType = "user";
    }
    return this.authType;
  }

  public void setAuthType(String authType)
  {
    this.authType = authType;
  }
}