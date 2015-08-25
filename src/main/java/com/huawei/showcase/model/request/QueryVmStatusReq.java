package com.huawei.showcase.model.request;

import com.huawei.showcase.model.UserGroupInfo;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="QueryVmStatusReq")
@XmlAccessorType(XmlAccessType.FIELD)
public class QueryVmStatusReq extends UnsCommonReq
{
  private static final long serialVersionUID = -8501347916923280698L;

  @XmlElement(name="id")
  private String id;
  private UserGroupInfo userInfo;
  private String isEmergencyLogin;

  public String toString()
  {
    return "id =" + this.id;
  }

  public UserGroupInfo getUserInfo()
  {
    return this.userInfo;
  }

  public void setUserInfo(UserGroupInfo userInfo)
  {
    this.userInfo = userInfo;
  }

  public String getIsEmergencyLogin()
  {
    return this.isEmergencyLogin;
  }

  public void setIsEmergencyLogin(String isEmergencyLogin)
  {
    this.isEmergencyLogin = isEmergencyLogin;
  }

  public String getId()
  {
    return this.id;
  }

  public void setId(String id)
  {
    this.id = id;
  }
}