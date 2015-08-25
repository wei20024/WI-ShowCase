package com.huawei.showcase.model.response;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

import com.huawei.showcase.model.UserGroupInfo;

@XmlRootElement(name="GetUserInfoRsp")
@XmlAccessorType(XmlAccessType.FIELD)
public class GetUserInfoRsp extends CommonRsp
{
  private static final long serialVersionUID = 237476630517176525L;

  @XmlElement(name="userInfo")
  private UserGroupInfo userInfo;

  public String toString()
  {
    return ToStringBuilder.reflectionToString(this, ToStringStyle.DEFAULT_STYLE);
  }

  public UserGroupInfo getUserInfo()
  {
    return this.userInfo;
  }

  public void setUserInfo(UserGroupInfo userInfo)
  {
    this.userInfo = userInfo;
  }
}