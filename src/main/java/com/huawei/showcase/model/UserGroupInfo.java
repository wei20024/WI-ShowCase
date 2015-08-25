package com.huawei.showcase.model;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="UserInfo")
@XmlAccessorType(XmlAccessType.FIELD)
public class UserGroupInfo
  implements Serializable
{
  private static final long serialVersionUID = -8501347916923280667L;
  private String userName;
  private List<String> userGroupList;
  private String sid;
  private String domain;
  private Date pwdLastSet;
  private String userPrincipalName;
  private String password;
  private String userDN;
  private List<String> userGroupDN;

  public String toString()
  {
    return "userName = " + this.userName + " domain = " + this.domain + " userGroupList = " + this.userGroupList + 
      " userDN = " + this.userDN + " userGroupDN = " + this.userGroupDN;
  }

  public String getUserName()
  {
    return this.userName;
  }

  public void setUserName(String userName)
  {
    this.userName = userName;
  }

  public List<String> getUserGroupList()
  {
    return this.userGroupList;
  }

  public void setUserGroupList(List<String> userGroupList)
  {
    this.userGroupList = userGroupList;
  }

  public String getSid()
  {
    return this.sid;
  }

  public void setSid(String sid)
  {
    this.sid = sid;
  }

  public String getDomain()
  {
    return this.domain;
  }

  public void setDomain(String domain)
  {
    this.domain = domain;
  }

  public Date getPwdLastSet()
  {
    return this.pwdLastSet;
  }

  public void setPwdLastSet(Date pwdLastSet)
  {
    this.pwdLastSet = pwdLastSet;
  }

  public String getUserPrincipalName()
  {
    return this.userPrincipalName;
  }

  public void setUserPrincipalName(String userPrincipalName)
  {
    this.userPrincipalName = userPrincipalName;
  }

  public String getPassword()
  {
    return this.password;
  }

  public void setPassword(String password)
  {
    this.password = password;
  }

  public String getUserDN()
  {
    return this.userDN;
  }

  public void setUserDN(String userDN)
  {
    this.userDN = userDN;
  }

  public List<String> getUserGroupDN()
  {
    return this.userGroupDN;
  }

  public void setUserGroupDN(List<String> userGroupDN)
  {
    this.userGroupDN = userGroupDN;
  }
}