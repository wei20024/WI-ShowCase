package com.huawei.showcase.model.request;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

import com.huawei.showcase.common.enumcode.StaticNumber;
import com.huawei.showcase.model.UserGroupInfo;

@XmlRootElement(name="GetVmListReq")
@XmlAccessorType(XmlAccessType.FIELD)
public class GetVmListReq extends UnsCommonReq
{
  private static final long serialVersionUID = -8501347916923280698L;

  @XmlElement(name="userInfo")
  private UserGroupInfo userInfo;

  @XmlElement(name="isEmergencyLogin")
  private String isEmergencyLogin;

  @XmlElement(name="queryType")
  private Integer queryType;

  public String toString()
  {
    return ToStringBuilder.reflectionToString(this, ToStringStyle.DEFAULT_STYLE);
  }

  public boolean isValid()
  {
    if ((this.queryType == null) || (StaticNumber.ZERO.getCode() == this.queryType.intValue()) || 
      (StaticNumber.ONE.getCode() == this.queryType.intValue()) || (StaticNumber.TWO.getCode() == this.queryType.intValue()))
    {
      return true;
    }

    return false;
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

  public Integer getQueryType()
  {
    return this.queryType;
  }

  public void setQueryType(Integer queryType)
  {
    this.queryType = queryType;
  }
}